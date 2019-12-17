import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';
import { ReactiveFormsModule } from '@angular/forms';
import {
  AngularFireFunctionsModule,
  FUNCTIONS_ORIGIN,
} from '@angular/fire/functions';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    ReactiveFormsModule,
    AngularFireFunctionsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
