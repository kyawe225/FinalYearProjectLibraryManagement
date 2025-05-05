import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { authInceptor, dateParser, loggingInterceptor } from './service/interceptor';
import { DatePipe, DecimalPipe } from '@angular/common';
import { provideNativeDateAdapter } from '@angular/material/core';

export const appConfig: ApplicationConfig = {
  providers: [provideAnimationsAsync(), provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideHttpClient(withInterceptors([loggingInterceptor, authInceptor, dateParser])), DatePipe, DecimalPipe
  ,provideNativeDateAdapter()]
};
