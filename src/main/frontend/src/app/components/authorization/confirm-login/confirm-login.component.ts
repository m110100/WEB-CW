import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../services/auth/auth.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AccessTokenRequest} from "../../../models/dto/request/accessTokenRequest";
import {AuthResponse} from "../../../models/dto/response/authResponse";
import {Auth} from "../../../models/auth";
import {UserResponse} from "../../../models/dto/response/userResponse";

@Component({
  selector: 'app-confirm-login',
  templateUrl: './confirm-login.component.html',
  styleUrls: ['./confirm-login.component.scss', '../auth.scss']
})
export class ConfirmLoginComponent implements OnInit {
  confirmGroup: FormGroup;
  errorMessage: string;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.confirmGroup = new FormGroup({
      token: new FormControl('', [Validators.required,
        Validators.minLength(36),
        Validators.maxLength(36),
      ]),
    })

    this.errorMessage = '';
  }

  confirmToken() {
    if (this.confirmGroup.valid) {
      const tokenValue: string = this.confirmGroup.value.token;

      const request: AccessTokenRequest = {
        token: tokenValue
      };

      this.authService.confirmLogin(request).subscribe((response: AuthResponse) => {
        const accessTokenValue: string = response.accessToken;
        const email = this.authService.getUserEmailFromToken(accessTokenValue);

        // Костыль ;)
        this.authService.setAuth({
          accessToken: accessTokenValue,
          userId: -1,
          role: ''
        })

        this.authService.getUserByEmail(email).subscribe((response: UserResponse) => {
          const auth: Auth = {
            accessToken: accessTokenValue,
            userId: response.userId,
            role: response.role
          }

          this.authService.setAuth(auth);

          this.router.navigate(["/dashboard"]);
        }, error => {
          console.log(error);
        })
      }, error => {
        this.errorMessage = 'Ошибка. Неправильный токен'
      })
    } else {
      return;
    }
  }

}
