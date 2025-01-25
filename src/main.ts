import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routes } from './app/app.routes';


bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(), // Correct way to provide HttpClient in standalone components
    provideRouter(routes),
    importProvidersFrom(CommonModule), // Import CommonModule for common directives like NgIf
  ]
}).catch((err) => console.error(err));
