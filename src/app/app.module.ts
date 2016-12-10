import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { HttpModule } from '@angular/http';
import { MyApp } from './app.component';
import { ProfilePage } from '../pages/profile/profile';

@NgModule({
  declarations: [
    MyApp,
    ProfilePage
  ],
  imports: [
    IonicModule.forRoot(MyApp), HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ProfilePage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler},Storage]
})
export class AppModule {}
