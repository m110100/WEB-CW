import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {JwtHelperService} from "@auth0/angular-jwt";
import {AuthRequest} from "../../models/dto/request/authRequest";
import {SignupRequest} from "../../models/dto/request/signupRequest";
import {AccessTokenRequest} from "../../models/dto/request/accessTokenRequest";
import {ConfirmTokenRequest} from "../../models/dto/request/confirmTokenRequest";
import {AuthResponse} from "../../models/dto/response/authResponse";
import {UserResponse} from "../../models/dto/response/userResponse";
import {Auth} from "../../models/auth";
import {User} from "../../models/user";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly authKey: string = 'auth';

  private isRegisteredSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private isLoggedInSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  // public isRegistered: Observable<boolean> = this.isRegisteredSubject.asObservable();

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  logout() {
    this.setIsLoggedIn(false);
    this.removeAuth();
    this.http.post('/api/auth/logout', null).subscribe(() => {
      this.router.navigate(['/auth']);
    });
  }

  login(request: AuthRequest): Observable<any> {
    return this.http.post('/api/auth/login', request);
  }

  signup(request: SignupRequest) {
    return this.http.post('/api/auth/signup', request);
  }

  confirmLogin(request: AccessTokenRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('/api/auth/login/confirm', request);
  }

  confirmEmail(request: ConfirmTokenRequest): Observable<any> {
    return this.http.post('/api/auth/signup/confirm', request);
  }

  getUserByEmail(email: string): Observable<UserResponse> {
    return this.http.get<UserResponse>(`/api/management/users/${email}`);
  }

  setAuth(auth: Auth) {
    localStorage.setItem(this.authKey, JSON.stringify(auth));
  }

  /**
   * @returns the user; will never be null
   */
  getUser(): User {
    const auth: Auth = JSON.parse(localStorage.getItem(this.authKey)!);

    return {
      id: auth!.userId,
      role: auth!.role
    };
  }

  getAuth(): Auth | null {
    const data = localStorage.getItem(this.authKey) || '';

    if (data) {
      return JSON.parse(data);
    } else {
      return null;
    }
  }

  removeAuth() {
    localStorage.removeItem(this.authKey);
  }

  setIsRegistered(value: boolean): void {
    this.isRegisteredSubject.next(value);
  }

  getIsRegistered(): boolean {
    return this.isRegisteredSubject.value;
  }

  setIsLoggedIn(value: boolean): void {
    this.isLoggedInSubject.next(value);
  }

  getIsLoggedIn(): boolean {
    return this.isLoggedInSubject.value;
  }

  getUserEmailFromToken(token: string) {
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(token);

    return decodedToken.sub;
  }

  isTokenExpired(): boolean {
    const auth = this.getAuth();
    if (auth && auth.accessToken) {
      const tokenExpiration = this.getTokenExpiration(auth.accessToken);

      return Date.now() >= tokenExpiration;
    }

    return true;
  }

  private getTokenExpiration(token: string): number {
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(token);

    return decodedToken.exp * 1000;
  }
}
