import { Injectable } from '@angular/core';
import { Http, Headers} from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { AppConstants } from '../services/appConstants';
import { Broadcaster } from '../services/broadcaster';
import { User } from '../domain/user';
import { Storage } from '@ionic/storage';

@Injectable()
export class UsersService {

    keyEventProfile : string;

    constructor(private http : Http, private appConstants: AppConstants, public storage: Storage, private broadcaster: Broadcaster) {
        this.keyEventProfile = this.appConstants.getEventProfileListener();
    }

    public setFacebookProfileData(token : string, source, callback) : void {
        var urlProfile = this.appConstants.getFacebookProfileData() + "/me?fields=id,name,email&access_token=" + token;

        let profile = this.http.get(urlProfile, {headers: this.getHeaders()}).map(toUser).catch(handleError);
        profile.subscribe(
            profileData => {
                var urlPicture = this.appConstants.getFacebookProfileData() + "/" + profileData.id + "/picture?type=large";
                this.http.get(urlPicture, {headers: this.getHeaders()}).subscribe(
                    pictureData => {
                        profileData.avatar = pictureData.url;
                        this.setUser(profileData); callback(source, profileData);
                    }
                );
            }
        )
    }

    public setGoogleProfileData(token : string, source, callback) : void {
        var urlProfile = this.appConstants.getGoogleProfileData() + token;
        let profile = this.http.get(urlProfile, {headers: this.getHeaders()}).map(toUser).catch(handleError);
        profile.subscribe(
            profileData => {
                this.setUser(profileData); callback(source, profileData);
            }
        )
    }

    public getLoggedUser(): Observable<User> {
        return Observable.create(observer => {
            this.storage.get('user').then((val) => {
                observer.next(JSON.parse(val));
            });
        });
    }

    public logout() : void {
        this.storage.set('user', null);
        this.broadcaster.broadcast(this.keyEventProfile, null);
    }

    public notifyLogin(user : User) : void {
        this.broadcaster.broadcast(this.keyEventProfile, user);
    }

    public receiveLogin() : Observable<User> {
        return this.broadcaster.on<User>(this.keyEventProfile);
    }

    private setUser(data:any) : void {
        this.storage.set('user', JSON.stringify(data));
    }

    private getHeaders(){
        let headers = new Headers();
        return headers;
    }

}

function toUser(r:any): User {
    let responseUser = JSON.parse(r._body);
    let user = <User>({
        id: responseUser.id,
        name: responseUser.name,
        email: responseUser.email,
        picture: responseUser.picture
    });
    console.log('Parsed user:', user);
    return user;
}

function handleError(error: any) {
  let errorMsg = error.message || "Yikes! There was was a problem with our hyperdrive device and we couldn't retrieve your data!";
  console.error(errorMsg);

  return Observable.throw(errorMsg);
}
