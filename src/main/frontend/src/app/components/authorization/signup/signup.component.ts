import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../services/auth/auth.service";
import {Router} from "@angular/router";
import {SignupRequest} from "../../../models/dto/request/signupRequest";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss', '../auth.scss']
})
export class SignupComponent implements OnInit {
  hidePassword: boolean = true;
  signupForm: FormGroup;

  signedUp: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.signupForm = new FormGroup({
      surname: new FormControl('', [Validators.required]),

      name: new FormControl('', [Validators.required]),

      patronymic: new FormControl(''),

      insurancePolicy: new FormControl('', [Validators.required,
        Validators.minLength(16),
        Validators.maxLength(16)]),

      email: new FormControl('', [Validators.required,
        Validators.email]),

      password: new FormControl('', [Validators.required,
        Validators.minLength(8)]),
    })
  }

  signup() {
    if (this.signupForm.valid) {
      this.signedUp = true;

      const request: SignupRequest = {
        surname: this.signupForm.value.surname,
        name: this.signupForm.value.name,
        patronymic: this.signupForm.value.patronymic,
        insurancePolicy: this.signupForm.value.insurancePolicy,
        email: this.signupForm.value.email,
        password: this.signupForm.value.password
      }

      this.authService.signup(request).subscribe(
        () => {
          this.authService.setIsRegistered(true);
          if (this.authService.getIsRegistered()) {
            this.router.navigate(['/auth/confirm-email']);
          }
        },
        error => {
          console.log(error);
        }
      );
    } else {
      return;
    }
  }
}
