import { HttpEvent, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { EMPTY, Observable, tap } from "rxjs";
import { AuthService } from "./auth.service";
import { ActivatedRoute, Router } from "@angular/router";



export function loggingInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> { 
    console.log(req); 
    return next(req).pipe(tap(event=> {
        console.log(event);
    })); 
}

export function authInceptor(request : HttpRequest<unknown> , next: HttpHandlerFn) : Observable<HttpEvent<unknown>>{
    let authService = inject(AuthService);
    let currentRoute = inject(ActivatedRoute);

    let routes = currentRoute.snapshot.url;

    console.log(routes);
    if(routes.length != 0){
        if(routes[0].path.toLocaleLowerCase() == 'auth'){
            return next(request);
        }
    }
    

    let token = authService.currentData.getValue();
    let newReq = request;
    console.log("token",token);
    if(token){
        newReq= request.clone({
            setHeaders:{
                Authorization: `Bearer ${token}`
            }
        });
    }

    return next(newReq);
}


