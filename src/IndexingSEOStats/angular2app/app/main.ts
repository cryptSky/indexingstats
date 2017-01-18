import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app.module';

import './styles/custom.css';
import './styles/modern.css';
import './styles/green.css';

platformBrowserDynamic().bootstrapModule(AppModule);