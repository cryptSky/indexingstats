using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using IndexingSEOStats.Interfaces;
using IndexingSEOStats.Data.Entities;
using Microsoft.Extensions.Options;
using Newtonsoft.Json.Linq;
using System.IO;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Hosting;
using Autofac;
using IndexingSEOStats.ProxyProviders;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace IndexingSEOStats.Controllers
{
    [Route("api/[controller]/[action]")]
    public class SettingsController : Controller
    {
        private IProxyProvider _proxyProvider;
        private readonly IHostingEnvironment _hostingEnvironment;
        private ProxySettings _proxySettings { get; set; }

        public SettingsController(IHostingEnvironment hostingEnvironment, IOptionsSnapshot<ProxySettings> proxySettings, IProxyProvider proxyProvider)
        {
            _proxySettings = proxySettings.Value;
            _hostingEnvironment = hostingEnvironment;
            _proxyProvider = proxyProvider;
        }

        // GET: api/values
        [HttpGet]
        public IActionResult GetProxyUrl()
        {
            var oldProxy = _proxySettings.Settings["ProxyHub"].Url;
            return Ok(new { Proxy = oldProxy });
        }

        // POST api/values
        [HttpPost]
        public IActionResult SetProxyUrl([FromBody]string value)
        {
            SaveNewProxyUrl(value);
            return Ok(new { Proxy = value });
        }

        private void SaveNewProxyUrl(string url)
        {
            string webRootPath = _hostingEnvironment.WebRootPath;
            string contentRootPath = _hostingEnvironment.ContentRootPath;

            string configFile = System.IO.Path.Combine(contentRootPath, "appsettings.json");

            JObject config = JObject.Parse(System.IO.File.ReadAllText(configFile));

            var psettings = config["ProxySettings"];
            var proxySettings = psettings.ToObject<ProxySettings>();
            if (proxySettings.Settings["ProxyHub"].Url.Equals(url))
            {
                return;
            }

            proxySettings.Settings["ProxyHub"].Url = url;

            config.Remove("ProxySettings");
            config.Add("ProxySettings", JToken.FromObject(proxySettings));

            string output = JsonConvert.SerializeObject(config, Formatting.Indented);
            System.IO.File.WriteAllText(configFile, output);

            
        }
    }

}
