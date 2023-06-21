import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../services/auth/auth.service";
import {take} from "rxjs";
import {Router} from "@angular/router";
import {AuthRequest} from "../../../models/dto/request/authRequest";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss', '../auth.scss']
})
export class LoginComponent implements OnInit {
  errorMessage: string;
  hidePassword: boolean = true;
  loginForm: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)])
    })

    this.errorMessage = '';
  }

  login() {
    if (this.loginForm.valid) {
      const email: string = this.loginForm.value.email;
      const password: string = this.loginForm.value.password;

      const request: AuthRequest = {
        email: email,
        password: password
      };

      this.authService.login(request).subscribe(() => {
        this.authService.setIsLoggedIn(true);
        this.router.navigate(["/auth/confirm-login"])
      }, error => {
        this.errorMessage = 'Ошибка авторизации. Неправильный email или пароль'
      });
    } else {
      return;
    }
  }
}
