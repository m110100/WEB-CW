import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import {EMPTY, Observable} from 'rxjs';
import {AuthService} from "./auth.service";
import {Auth} from "../../models/auth";
import {Router} from "@angular/router";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const data: Auth | null = this.authService.getAuth();

    if (data === null) {
      this.router.navigate(["/auth"])
    }

    if (data != null) {
      const token = data.accessToken;

      if (this.authService.isTokenExpired()) {
        this.authService.logout();

        return EMPTY;
      }

      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next.handle(request)
    } else {
      return next.handle(request)
    }
  }
}
