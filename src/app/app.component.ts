import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AngularFireFunctions } from '@angular/fire/functions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  textarea = new FormControl('');
  isLoading = false;
  isSuccess = false;
  failureMessage = '';

  constructor(private fns: AngularFireFunctions) {}

  handleSubmit(value: string): void {
    if (!value) {
      return;
    }

    this.isLoading = true;
    const sendToInboxFn = this.fns.httpsCallable('sendToInbox');
    sendToInboxFn({ content: value }).subscribe(res => {
      if (res.success) {
        this.isSuccess = true;
        this.textarea.reset();
      } else {
        this.failureMessage = res.error;
      }
      this.isLoading = false;
    });
  }
}
