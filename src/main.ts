import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app-entry/app.config';
import { AppComponent } from './app/app-entry/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
