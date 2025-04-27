import { HttpEvent, HttpHandlerFn, HttpRequest, HttpResponse } from "@angular/common/http";
import { inject } from "@angular/core";
import { EMPTY, map, Observable, of, switchMap, tap } from "rxjs";
import { AuthService } from "./auth.service";
import { ActivatedRoute, Router } from "@angular/router";



export function loggingInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    console.log(req);
    return next(req).pipe(tap(event => {
        console.log(event);
    }));
}

export function authInceptor(request: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    let authService = inject(AuthService);
    let currentRoute = inject(ActivatedRoute);

    let routes = currentRoute.snapshot.url;

    console.log(routes);
    if (routes.length != 0) {
        if (routes[0].path.toLocaleLowerCase() == 'auth') {
            return next(request);
        }
    }


    let token = authService.currentData.getValue();
    let newReq = request;
    console.log("token", token);
    if (token) {
        newReq = request.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    }

    return next(newReq);
}

export function dateParser(request: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    return next(request).pipe(map(event => {
        if (event instanceof HttpResponse) {
            if (event.status == 401) {
                let router = inject(Router);
                router.navigate(['/auth/login']);
                return event;
            }
            const modifiedBody = convertDates(event.body);
            const modifiedResponse = event.clone({ body: modifiedBody });
            console.log(modifiedBody);
            return modifiedResponse;
        }
        return event;
    }));
}

function convertDates(obj: any): any {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(item => convertDates(item));
    }

    const newObj: any = {};
    for (const key of Object.keys(obj)) {
        if (key.toLowerCase().includes('date') && typeof obj[key] === 'string') {
            const dateValue = new Date(obj[key]);
            newObj[key] = isNaN(dateValue.getTime()) ? obj[key] : dateValue; // Check if valid date
        } else if (key.toLowerCase().includes('at') && typeof obj[key] === 'string') {
            console.log(key);
            const dateValue = new Date(obj[key]);
            newObj[key] = isNaN(dateValue.getTime()) ? obj[key] : dateValue; // Check if valid date
            console.log(newObj[key]);
        }
         else {
            newObj[key] = convertDates(obj[key]);
        }
    }
    console.log(newObj)
    return newObj;
}



