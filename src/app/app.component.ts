import { Component, ViewChild } from '@angular/core';

import { Platform, MenuController, Nav } from 'ionic-angular';
import { ProfilePage } from '../pages/profile/profile';

import { User } from '../domain/user';
import { UsersService } from '../services/usersService';
import { AppConstants } from '../services/appConstants';
import { Broadcaster } from '../services/broadcaster';
import { Storage } from '@ionic/storage';

@Component({
  templateUrl: 'app.html',
  providers: [UsersService, AppConstants, Broadcaster]
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = ProfilePage;
  pages: Array<{title: string, component: any}>;
isUserAuth : boolean = false;
  loggedUser : User;

  constructor(public platform: Platform, public menu: MenuController, public usersService: UsersService, public storage: Storage) {
    this.initializeApp();
    this.pages = [
      { title: 'Profile', component: ProfilePage }
    ];
    this.profileListener();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.storage.get('').then((val) => {
          this.usersService.getLoggedUser()
            .subscribe(
              data =>  { this.loggedUser = data; this.isUserAuth = (data !=null); }
            );
      })
    });
  }

  openPage(page) {
    this.menu.close();
    this.nav.setRoot(page.component);
  }

  profileListener() {
    this.usersService.receiveLogin().subscribe(data => {
        this.loggedUser = data; this.isUserAuth = (data !=null);
    });
  }

}
