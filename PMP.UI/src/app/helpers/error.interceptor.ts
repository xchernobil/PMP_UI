import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor() {
        
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            const error = err.error == null ? (err.Message == null? err.statusText : err.Message) : err.error.Message;
            console.log(err);
            if(err.status === 0) {
                return throwError("Sorry, service is down");
            }
            return throwError(error);
        }))
    }
}