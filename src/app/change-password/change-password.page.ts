import { Component, OnInit } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { NavController, ToastController } from '@ionic/angular';
import { ConfigService } from 'src/providers/config/config.service';
import { LoadingService } from 'src/providers/loading/loading.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {

  userData: any;

  constructor(
    private nativeStorage: NativeStorage,
    private navController:  NavController,
    private config: ConfigService,
    private loader: LoadingService,
    private toastController: ToastController,
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.checkData();
  }

  checkData() {
    this.nativeStorage.getItem('user_data').then( data => {
      if(data !== null || data !== '' || typeof(data) !== 'undefined') {
        this.userData = data;
      } else {
        this.navController.navigateRoot('/login');
      }
    }).catch( err => {
      console.log(err);
      this.navController.navigateRoot('/login');
    });
  }


  changePassword(formData) {
    this.loader.show();
    this.config.postData('/changePassword', formData.value, this.userData.token).then((res:any) => {
        this.loader.hide();
        if(res.success) {
          this.navController.navigateRoot('/home/tabs/tab1');
        } else {
          this.presentToast(res.message);
        }
    }).catch( err => {
      console.log(err);
    });
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }


}
