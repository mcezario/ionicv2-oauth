import { Injectable } from '@angular/core';

@Injectable()
export class AppConstants {

    EVENT_PROFILE_LISTENER : string = "EVENT_PROFILE_LISTENER";
    FACEBOOK_PROFILE_DATA : string = "https://graph.facebook.com/v2.8";
    GOOGLE_PROFILE_DATA : string = "https://www.googleapis.com/oauth2/v1/userinfo?access_token=";

    constructor(){
    }

    public getFacebookProfileData(): string {
        return this.FACEBOOK_PROFILE_DATA;
    }

    public getGoogleProfileData(): string {
        return this.GOOGLE_PROFILE_DATA;
    }

    public getEventProfileListener(): string {
        return this.EVENT_PROFILE_LISTENER;
    }

}