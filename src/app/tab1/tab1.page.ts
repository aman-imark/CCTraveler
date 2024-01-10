import { Component } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { NavController, ToastController } from '@ionic/angular';
import { ConfigService } from 'src/providers/config/config.service';
// import { EventServiceService } from 'src/providers/event/event-service.service';
import { LoadingService } from 'src/providers/loading/loading.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  slideOpts = {
    initialSlide: 1,
    speed: 400
  };

  userData:any;
  homeData: any = {
    name: '',
    description: '',
    flag: '',
    imageSlider: '',
    know_more: ''
  };

  constructor(
    private navController: NavController,
    private config: ConfigService,
    private loader: LoadingService,
    private toastController: ToastController,
    private nativeStorage: NativeStorage,
  ) {}

  ionViewWillEnter() {
    this.checkData();
  }

  checkData() {
    this.nativeStorage.getItem('user_data').then( data => {
      if(data !== null || data !== '' || typeof(data) !== 'undefined') {
        this.userData = data;
        // console.log(this.userData);
        this.getHomeData(this.userData.token, this.userData.location)
      } else {
        this.navController.navigateRoot('/login');
      }
    }).catch( err => {
      console.log(err);
      this.navController.navigateRoot('/login');
    });
  }

  getHomeData(token, loc_id) {
    this.loader.show();
    this.config.getData(`/home/${loc_id}`, token).then((res:any) => {
        this.loader.hide();
        // console.log(res);
        if(res.success) {
          this.homeData = res.data;
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
