import { Component } from '@angular/core';
import { Platform, ToastController } from 'ionic-angular';
import { Facebook, Google } from 'ng2-cordova-oauth/core';
import { OauthCordova } from 'ng2-cordova-oauth/platform/cordova';
import { UsersService } from '../../services/usersService';
import { User } from '../../domain/user';


@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {

    user: User;
    isUserAuth: boolean = false;

    private oauth: OauthCordova = new OauthCordova();
    private facebookProvider: Facebook = new Facebook({
      clientId: "FACEBOOK_CLIENT_ID",
      appScope: ["email", "public_profile", "user_friends"]
    });
    private googleProvider: Google = new Google({
      clientId: "GOOGLE_CLIENT_ID",
      appScope: ["email", "profile"]
    });

    constructor(public toastCtrl: ToastController, private platform: Platform, private usersService: UsersService) {
        this.setLoggedUser();
    }

    public loginFacebook() {
       this.platform.ready().then(() => {
            this.oauth.logInVia(this.facebookProvider).then((data) => {
                this.usersService.setFacebookProfileData(data['access_token'], this, this.updateStatus);
            }, (error) => {
                let toast = this.toastCtrl.create({
                  message: 'Erro ao entrar com o Facebook. Verifique sua conexão.',
                  duration: 3000
                });
                toast.present();
            });
        });
    }

    public loginGoogle() {
       this.platform.ready().then(() => {
            this.oauth.logInVia(this.googleProvider).then((data) => {
                this.usersService.setGoogleProfileData(data['access_token'], this, this.updateStatus);
            }, (error) => {
                let toast = this.toastCtrl.create({
                  message: 'Erro ao entrar com o Google. Verifique sua conexão.',
                  duration: 3000
                });
                toast.present();
            });
        });
    }

    private setLoggedUser() : void {
        this.usersService.getLoggedUser()
        .subscribe(
            data =>  { this.isUserAuth = (data !=null); this.user = data; }
        );
    }

    private updateStatus(source, data) : void {
        source.isUserAuth = (data !=null);
        source.user = data;
        source.usersService.notifyLogin(data);
    }

    public logout() {
       this.usersService.logout();
       this.user = null;
       this.isUserAuth = false;
    }

}
