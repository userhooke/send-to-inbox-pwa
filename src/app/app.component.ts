import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  user$!: Observable<firebase.User | null>;
  isLoading = true;
  email = new FormControl('');
  password = new FormControl('');
  errorMessage = '';

  constructor(public afAuth: AngularFireAuth) {}

  ngOnInit(): void {
    this.user$ = this.afAuth.user;
    this.user$.subscribe(() => (this.isLoading = false));
  }

  login() {
    this.isLoading = true;
    this.afAuth.auth
      .signInWithEmailAndPassword(this.email.value, this.password.value)
      .catch(err => {
        this.errorMessage = err;
      })
      .finally(() => {
        this.isLoading = false;
      });
  }
}
