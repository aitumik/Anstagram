import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth/auth.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subscription, Subject } from 'rxjs';
import { HttpService } from '../../core/services/http/http.service';

@Component({
  selector: 'ia-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {

  registerForm: FormGroup;
  isEmailInvalid = false;
  isUsernameInvalid = false;
  isPasswordsMatch = true;
  isRegistrationComplete = false;
  errorMessage: string;
  notificationType = 'is-danger';
  usernameSubscription: Subscription;
  usernameSubject = new Subject<string>();
  isUsernameAvailable = false;

  constructor(private authService: AuthService, private titleService: Title, private httpService: HttpService) {
    this.titleService.setTitle('Register');
  }

  ngOnInit() {
    this.registerForm = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      // tslint:disable-next-line: max-line-length
      email: new FormControl('', [Validators.required, Validators.email, Validators.pattern(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i)]),
      username: new FormControl('', [Validators.min(4), Validators.pattern(/^[a-zA-Z0-9-_]+$/)]),
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required]),
      dateOfBirth: new FormControl('', [Validators.required]),
      gender: new FormControl('', [Validators.required]),
      termsAndConditions: new FormControl('', [Validators.required])
    });

    this.usernameSubscription = this.usernameSubject.pipe(debounceTime(1000), distinctUntilChanged()).subscribe(usernameInput => {
      if (usernameInput && usernameInput.length > 3) {
        this.checkAvailabilityOfUsername(usernameInput);
      }
    });
  }

  ngOnDestroy() {
    if (this.usernameSubscription) {
      this.usernameSubscription.unsubscribe();
    }
  }

  register() {
    this.errorMessage = null;
    if (this.isUsernameAvailable) {
      this.httpService.post('users/register', this.registerForm.value).subscribe(res => {
        this.isRegistrationComplete = true;
      }, err => {
        this.errorMessage = err.error.message;
        console.log(err);
      });
    } else {
      this.errorMessage = 'Please check your username and try again';
    }
  }

  checkEmail() {
    this.isEmailInvalid = this.registerForm.controls.email.value && !this.registerForm.controls.email.valid;
  }

  validatePassword() {
    this.isPasswordsMatch = this.registerForm.controls.password.value === this.registerForm.controls.confirmPassword.value;
  }

  checkUsername() {
    this.isUsernameAvailable = false;
    // tslint:disable-next-line: max-line-length
    this.isUsernameInvalid = this.registerForm.controls.username.touched && this.registerForm.controls.username.dirty && !this.registerForm.controls.username.valid;

    if (!this.isUsernameInvalid) {
      this.usernameSubject.next(this.registerForm.controls.username.value);
    }
  }

  checkAvailabilityOfUsername(usernameInput) {
    this.httpService.get(`users/check/${usernameInput}`).subscribe(res => {
      if (!res) {
        this.isUsernameAvailable = true;
      } else {
        this.isUsernameAvailable = false;
      }
    }, err => {
      this.isUsernameAvailable = false;
      console.log(err);
    });
  }

}
