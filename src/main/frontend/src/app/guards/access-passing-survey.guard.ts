import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccessPassingSurveyGuard implements CanActivate {
  private access = false;

  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.access) {
      return true;
    } else {
      this.router.navigate(['/dashboard']);
      return false;
    }
  }

  setAccess() {
    this.access = true;
  }
}
