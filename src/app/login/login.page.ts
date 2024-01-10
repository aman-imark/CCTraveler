// import { decimalDigest } from '@angular/compiler/src/i18n/digest';
import { Component, OnInit } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { NavController, ToastController } from '@ionic/angular';
import { ConfigService } from 'src/providers/config/config.service';
import { EventServiceService } from 'src/providers/event/event-service.service';
import { LoadingService } from 'src/providers/loading/loading.service';

import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

User;
socialForm: any;
  constructor(
    public nav: NavController,
    public config: ConfigService,
    public loader: LoadingService,
    public toastController: ToastController,
    public nativeStorage: NativeStorage,
    public eventService: EventServiceService,
    private fb: Facebook,
    private googlePlus: GooglePlus
  ) { }

  ngOnInit() { }

  // simple email login
  login(formData) {
    this.loader.show();
    this.config.postData('/login', formData.value).then((res:any) => {
        this.loader.hide();
        if(res.success) {   // console.log(res.data);         
          this.eventService.publish( res.data);                 // event publish
          this.nativeStorage.setItem('user_data', res.data);    // native storage

          if(!res.data.is_subscribed) {
            this.nav.navigateRoot('subscription');
          } else {
            this.nav.navigateRoot('home/tabs/tab1');
          }
        } else {
          this.presentToast(res.message);
        }
    }).catch( err => {  console.log(err);   });
  }

  // google login / social media
  gLogin() {
    this.loader.show();
    this.googlePlus.login({})
    .then(result => {  //  console.log('Success '+JSON.stringify(result));
            const g_name = result.displayName;
            const g_email = result.email;
            this.socialForm = {'user_name' : g_name, 'email': g_email};   //  console.log(this.socialForm);

        this.config.postData('/socialLogin', this.socialForm )
        .then((res:any) => {
            this.loader.hide();
            if(res.success) {
                this.eventService.publish( res.data);                 // event publish
                this.nativeStorage.setItem('user_data', res.data);    // native storage
      
                if(!res.data.is_subscribed) {
                  this.nav.navigateRoot('subscription');
                } else {
                  this.nav.navigateRoot('home/tabs/tab1');
                }
            } else {
                this.presentToast(res.message);
            }
        }).catch( err => { console.log(JSON.stringify(err));  });
    }).catch(err => {
         console.log('gLogin err '+JSON.stringify(err));
         // alert('gLogin err '+JSON.stringify(err));
    });
  }


  // facebook login / social media
  fbLoginStatus(){
    this.loader.show();
    // first check fb login status (connected or not connected)
    this.fb.getLoginStatus()
      .then((res) => {
          // console.log(JSON.stringify(res));
          // alert(JSON.stringify(res));
        if(res.status === 'connected') {
           this.getUserDetail(res.authResponse.userID);
        } else {    // this.isLoggedIn = false;
           this.fbLogin();
        }
      }).catch(e => {
        // console.log('fb login status '+JSON.stringify(e));
        // alert('fb login status '+JSON.stringify(e));
      });
  }
  
  // fb login request function
  fbLogin(){
    this.fb.login(['public_profile', 'user_friends', 'email'])
     .then((res: FacebookLoginResponse) => {
          console.log('Logedm fb', +JSON.stringify(res))
          // alert(JSON.stringify(res));

       if(res.status === 'connected') {
          this.getUserDetail(res.authResponse.userID);
       } else {
        // this.isLoggedIn = false;
       }
     }).catch(e => {
          console.log('Error log fb',  +JSON.stringify(e))
          // alert(JSON.stringify(e));
     });
  }

  // fb function, that get user detail using userid (that coming in fb login response)
  getUserDetail(userid: any) {
    this.fb.api('/' + userid + '/?fields=id,email,name,picture', ['public_profile'])
      .then(res => { //  alert('Detail '+JSON.stringify(res)); //  console.log('Detail '+JSON.stringify(res));
           const fb_name = res.name;
           const fb_email = res.email;
           this.socialForm = {'user_name' : fb_name, 'email': fb_email};

        this.config.postData('/socialLogin', this.socialForm )
        .then((res:any) => { // console.log('socialL ',res);
          if(res.success) {
            this.loader.hide();
            this.eventService.publish( res.data);                 // event publish
            this.nativeStorage.setItem('user_data', res.data);    // native storage
  
            if(!res.data.is_subscribed) {
              this.nav.navigateRoot('subscription');
            } else {
              this.nav.navigateRoot('home/tabs/tab1');
            }
          } else {
            this.presentToast(res.message);
          }
        }).catch( err => {  console.log(JSON.stringify(err));
            // console.log(JSON.stringify(err));            
        });
      })
      .catch(e => { console.log(JSON.stringify(e)); // console.log(JSON.stringify(e));
      });
  }
  
  // login ------------------


  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

}
