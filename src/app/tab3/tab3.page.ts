import { Component } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { NavController,AlertController } from '@ionic/angular';

import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  constructor(
    public navController: NavController,
    public nativeStorage: NativeStorage,
    private googlePlus: GooglePlus,
    private fb: Facebook, public alertCtrl: AlertController
  ) {}


  async logout_Confirmation(){
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      // header: 'Logout!',
      message: '<strong>Are you sure you want to logout?</strong>',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            // console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Yes',
          handler: () => {
            this.logout();
          }
        }
      ]
    });

    await alert.present();
  }

  logout() {
    this.nativeStorage.clear();
    this.navController.navigateRoot('/login');
     this.fbLogout();
     this.gLogout();
    //  alert('Logout '+this.nativeStorage.getItem('user_data'));
    //  console.log('Logout '+this.nativeStorage.getItem('user_data'));  
  }



  fbLogout() {
  this.fb.logout()
    .then(res => {
        // alert('sucs fb logout '+JSON.stringify(res));
        // console.log('sucs fb logout '+JSON.stringify(res));
    })
    .catch(e => {
        // alert('err fb logout '+JSON.stringify(e));
        // console.log('err fb logout '+JSON.stringify(e));
    });
  }


  gLogout() {
    this.googlePlus.logout()
      .then(res => {
          // alert('sucs gLogout '+JSON.stringify(res));
          // console.log('sucs gLogout '+JSON.stringify(res));
      })
      .catch(e => {
          // alert('err gLogout '+JSON.stringify(e));
          // console.log('err gLogout '+JSON.stringify(e));
      });
    }


  nativeStorageFN(){
  // platform.ready().then(() => {
  //   //Here we will check if the user is already logged in
  //   //because we don't want to ask users to log in each time they open the app
  //   this.nativeStorage.getItem('google_user')
  //   .then( data =>{
  //     // user is previously logged and we have his data
  //     // we will let him access the app
  //     this.router.navigate(["/user"]);
  //     this.splashScreen.hide();
  //   }, error =>{
  //     this.router.navigate(["/login"]);
  //     this.splashScreen.hide();
  //   });
  //   this.statusBar.styleDefault();
  // });
  }


}
