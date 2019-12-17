import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AngularFireFunctions } from '@angular/fire/functions';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
  textarea = new FormControl('');
  isLoading = false;
  isSuccess = false;
  failureMessage = '';

  constructor(private fns: AngularFireFunctions) {}

  ngOnInit(): void {
    const parsedUrl = new URL(window.location.toString());
    const title = parsedUrl.searchParams.get('title');
    const text = parsedUrl.searchParams.get('text');
    const url = parsedUrl.searchParams.get('url');
    if (title || text || url) {
      this.textarea.setValue(
        `Title shared: ${title}

Text shared: ${text}

URL shared: ${url}`,
      );
    }
  }

  handleSubmit(value: string): void {
    if (!value) {
      return;
    }

    this.isLoading = true;
    this.isSuccess = false;
    this.failureMessage = '';

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
