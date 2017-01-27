using Akka.Actor;
using Akka.DI.AutoFac;
using Akka.DI.Core;
using Akka.Routing;
using Autofac;
using Autofac.Extensions.DependencyInjection;
using Autofac.Integration.SignalR;
using AutofacSerilogIntegration;
using AutoMapper;
using IndexingSEOStats.Actors;
using IndexingSEOStats.Data.AutoMapper;
using IndexingSEOStats.Data.Infrastructure;
using IndexingSEOStats.Data.Interfaces;
using IndexingSEOStats.Hubs;
using IndexingSEOStats.Interfaces;
using IndexingSEOStats.ProxyProviders;
using IndexingSEOStats.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Serialization;
using Serilog;
using Serilog.Sinks.RollingFile;
using System;
using System.Linq;
using Microsoft.AspNetCore.SignalR.Infrastructure;
using IndexingSEOStats.Utils;
using System.IO;

namespace IndexingSEOStats
{
    public class Startup
    {
        private MapperConfiguration _mapperConfiguration { get; set; }
        public static IConnectionManager ConnectionManager;
        public Startup(IHostingEnvironment env)
        {
            var builder = new ConfigurationBuilder()
                            .SetBasePath(env.ContentRootPath)
                            .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                            .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
                            .AddEnvironmentVariables();
            Configuration = builder.Build();

            _mapperConfiguration = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile(new AutoMapperProfileConfiguration());
            });

            ActorSystemRefs.ActorSystem = ActorSystem.Create("DomainProcessingSystem");

            string logPathFormat = Path.Combine(env.ContentRootPath, @"\logs\log-{Date}.txt");

#if DEBUG
            Log.Logger = new LoggerConfiguration()
             .MinimumLevel.Debug()
             .WriteTo.RollingFile(logPathFormat)
             .CreateLogger();
#else
            Log.Logger = new LoggerConfiguration()
            .MinimumLevel.Information()
            .WriteTo.RollingFile(logPathFormat).CreateLogger();
#endif
        }

        public IContainer ApplicationContainer { get; private set; }
        public IConfigurationRoot Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit http://go.microsoft.com/fwlink/?LinkID=398940
        public IServiceProvider ConfigureServices(IServiceCollection services)
        {
            // SignalR camel case contract
            var settings = new JsonSerializerSettings();
            settings.ContractResolver = new SignalRContractResolver();
            var serializer = JsonSerializer.Create(settings);
            services.Add(new ServiceDescriptor(typeof(JsonSerializer),
                                           provider => serializer,
                                           ServiceLifetime.Transient));

            services.AddCors();
            services.AddMvc()
                .AddJsonOptions(opt => {
                    opt.SerializerSettings.DateFormatString = "yyyy-MM-dd";
                    // opt.SerializerSettings.Converters = new[] { new JavaScriptDateTimeConverter() };

                });

            services.AddSignalR(options => {
                options.Hubs.EnableDetailedErrors = true;
                //options.Hubs.EnableJavaScriptProxies = false;
                });

            var builder = new ContainerBuilder();

            builder.RegisterLogger();
            builder.RegisterType<DomainStatSenderHub>().ExternallyOwned()
                .SingleInstance();

            builder.RegisterInstance<IMapper>(_mapperConfiguration.CreateMapper())
                .SingleInstance();
            builder.RegisterInstance<IConfigurationRoot>(Configuration)
                .SingleInstance();
            builder.RegisterType<UnitOfWork>().As<IUnitOfWork>()
                .SingleInstance();
            builder.RegisterType<DomainService>().As<IDomainService>()
                .SingleInstance();
            builder.RegisterInstance(new DBContext(Configuration))
                .SingleInstance();
            builder.RegisterType<UnitOfWork>().As<IUnitOfWork>()
                .SingleInstance();
            builder.RegisterType<TimeGeneratorService>().As<ITimeGeneratorService>()
                .SingleInstance()
                //.WithParameter("startTime", TimeSpan.FromMinutes(1).TotalSeconds)
                //.WithParameter("timePeriodSec", TimeSpan.FromMinutes(15).TotalSeconds)
                ;

            builder.RegisterType<DomainProcessorActor>();
            builder.RegisterType<DomainParserActor>();
            builder.RegisterType<RequestSchedulerActor>()
                .SingleInstance();
            builder.RegisterType<CoordinatorActor>()
                .SingleInstance();

            ProcessProxySettings(builder);

            builder.Populate(services);
            ApplicationContainer = builder.Build();

            // Create the dependency resolver
            IDependencyResolver resolver = new AutoFacDependencyResolver(ApplicationContainer, ActorSystemRefs.ActorSystem);

            var actorSystem = ActorSystemRefs.ActorSystem;

            var propsCoord = resolver.Create<CoordinatorActor>();
            SystemActors.CoordinatorActor = actorSystem.ActorOf(propsCoord, "CoordinatorActor");

            // Register the actors with the system
            //var propsParser = resolver.Create<DomainParserActor>().WithRouter(new RoundRobinPool(5));
            var propsProc = resolver.Create<DomainProcessorActor>();
            //var propScheduler = resolver.Create<RequestSchedulerActor>();            

            SystemActors.DomainProcessorActor = actorSystem.ActorOf(propsProc, "DomainProcessorActorForApiRequests");
            //SystemActors.DomainParserActor = actorSystem.ActorOf(propsParser, "DomainParserActor");
            //SystemActors.RequestSchedulerActor = actorSystem.ActorOf(propScheduler, "RequestSchedulerActor");
            

            SystemActors.CoordinatorActor.Tell("start");

            // Return the IServiceProvider resolved from the container.
            return ApplicationContainer.Resolve<IServiceProvider>();
        }


       
        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory, IServiceProvider serviceProvider)
        {
            ConnectionManager = serviceProvider.GetService<IConnectionManager>();

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();

                loggerFactory.AddConsole(Configuration.GetSection("Logging")).AddSerilog();
                loggerFactory.AddDebug(LogLevel.Information).AddSerilog();
            }
            else
            {
                loggerFactory.AddDebug(LogLevel.Error).AddSerilog();
            }

            var angularRoutes = new[] {
                 "/dashboard"
             };

            app.Use(async (context, next) =>
            {
                if (context.Request.Path.HasValue && null != angularRoutes.FirstOrDefault(
                    (ar) => context.Request.Path.Value.StartsWith(ar, StringComparison.OrdinalIgnoreCase)))
                {
                    context.Request.Path = new PathString("/");
                }

                await next();
            });


            app.UseDefaultFiles();
            app.UseStaticFiles();

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");
            });

            app.UseSignalR("/signalr");
        }

        private void ProcessProxySettings(ContainerBuilder builder)
        {
            var proxyType = Configuration.GetValue<string>("ProxySettings:Type");
            switch (proxyType)
            {
                case "Hub":
                    var hubAddress = Configuration.GetValue<string>("ProxySettings:ProxyHub:HubAddress");
                    builder.RegisterInstance<IProxyProvider>(new HubProxyProvider(hubAddress));
                    break;
                case "Fetcher":
                    var fetcherApiAddress = Configuration.GetValue<string>("ProxySettings:ProxyFetcher:FetcherAPIUrl");
                    builder.RegisterInstance<IProxyProvider>(new FetcherProxyProvider(fetcherApiAddress));
                    break;
                case "List":
                    var type = Configuration.GetValue<string>("ProxySettings:ProxyList:Type");
                    var listUrl = Configuration.GetValue<string>("ProxySettings:ProxyList:Url");
                    if (type.Equals("Page", StringComparison.InvariantCultureIgnoreCase))
                    {
                        builder.RegisterInstance<IProxyProvider>(
                            new ListProxyProvider(listUrl, ListProxyProviderType.ListPageParser));
                    }
                    else
                    {
                        builder.RegisterInstance<IProxyProvider>(
                            new ListProxyProvider(listUrl, ListProxyProviderType.ListApiFetcher));
                    }
                    break;
                case "UrlSub":
                    var urlStringFormat = Configuration.GetValue<string>("ProxySettings:ProxyUrlSub:UrlSubFormat");
                    builder.RegisterInstance<IProxyProvider>(new UrlSubProxyProvider(urlStringFormat));
                    break;

                default:
                    builder.RegisterInstance<IProxyProvider>(new NullProxyProvider());
                    break;
            }
        }
    }
}
