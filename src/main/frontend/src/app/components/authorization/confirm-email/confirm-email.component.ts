import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../services/auth/auth.service";
import {Router} from "@angular/router";
import {ConfirmTokenRequest} from "../../../models/dto/request/confirmTokenRequest";

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.scss', '../auth.scss']
})
export class ConfirmEmailComponent implements OnInit {
  confirmGroup: FormGroup;
  errorMessage: string;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
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

      const request: ConfirmTokenRequest = {
        token: tokenValue
      };

      this.authService.confirmEmail(request).subscribe(() => {
        this.authService.setIsRegistered(false);
        this.router.navigate(['/auth/login']);
      }, error => {
        this.errorMessage = 'Ошибка. Неправильный токен'
      })
    } else {
      return;
    }
  }
}
