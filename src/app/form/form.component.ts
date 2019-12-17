import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AngularFireFunctions } from '@angular/fire/functions';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent {
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
