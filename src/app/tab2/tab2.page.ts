import { Component } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { NavController, ToastController } from '@ionic/angular';
import { ConfigService } from 'src/providers/config/config.service';
// import { EventServiceService } from 'src/providers/event/event-service.service';
import { LoadingService } from 'src/providers/loading/loading.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  countryData;
  userData: any;
  key = '';

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
        this.getCountry(this.userData.token)
      } else {
        this.navController.navigateRoot('/login');
      }
    }).catch( err => {
      console.log(err);
      this.navController.navigateRoot('/login');
    });
  }

  getCountry(token) {
    this.loader.show();
    this.config.getData(`/country?key=`, token).then((res:any) => {
        this.loader.hide();
        if(res.success) {
          this.countryData = res.data;
        } else {
          this.presentToast(res.message);
        }
    }).catch( err => {
      console.log(err);
    });
  }


  searchKey(event) {
    let val = event.target.value
    if(val.length >=3) {
      this.loader.show();
      this.config.getData(`/country?key=${val}`, this.userData.token).then((res:any) => {
          this.loader.hide();
          if(res.success) {
            this.countryData = res.data;
          } else {
            this.presentToast(res.message);
          }
      }).catch( err => {
        console.log(err);
      });
    }
  }


  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 7000
    });
    toast.present();
  }

}
