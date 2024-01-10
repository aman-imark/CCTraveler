import { Component, OnInit } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { NavController, ToastController } from '@ionic/angular';
import { ConfigService } from 'src/providers/config/config.service';
import { EventServiceService } from 'src/providers/event/event-service.service';
import { LoadingService } from 'src/providers/loading/loading.service';

@Component({
  selector: 'app-account-setting',
  templateUrl: './account-setting.page.html',
  styleUrls: ['./account-setting.page.scss'],
})
export class AccountSettingPage implements OnInit {

  slideOpts = {
    initialSlide: 1,
    slidesPerView: 1.2,
  };

  userData;
  history;
  token;

  constructor(
    private nativeStrg: NativeStorage,
    private navCtrl: NavController,
    private config: ConfigService,
    private loader: LoadingService,
    public eventService: EventServiceService,
    private toastController: ToastController,
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getLogedData();
  }

  getLogedData() {
    this.nativeStrg.getItem('user_data').then( d => {
      this.userData = d;
      this.token = this.userData.token;
      this.getHistory(this.userData.token)
    }).catch( err => {
      this.navCtrl.navigateRoot('/');
    })
  }

  getHistory(token) {
    this.loader.show();
    this.config.getData('/user/sub/list', token).then((res:any) => {
        this.loader.hide();
        if(res.success) {
          this.history = res.data;
        } else {
          this.history = [];
          this.presentToast(res.message);
        }
    }).catch( err => {
      console.log(err);
    });
  }

  upgardPlan(plan_id, stripe_plan_id, sub_id) {
    let payload = {
      'plan_id': plan_id,
      'stripe_sub_id': stripe_plan_id,
      'sub_id': sub_id
    }
    this.config.postData('/subscription/update',payload, this.token).then((response: any) => {
      this.loader.hide();
      if(response?.success) {
        this.presentToast(response?.message);
        // event publish
        this.eventService.publish( response.data);
        // native storage
        this.nativeStrg.setItem('user_data', response.data);

        this.navCtrl.navigateRoot('/home/tabs/tab1');
      } else {
        // print error message
        this.presentToast(response?.message)
      }
    }).catch( err => {
      this.loader.hide();
      console.log(err);
    });
  }

  activatePlan(plan_id, stripe_plan_id) {
    let objToSend: NavigationExtras = {
      queryParams: {
        plan_id: plan_id,
        stripe_price_id: stripe_plan_id,
      },
    };
    this.navCtrl.navigateForward('/card', objToSend);
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 7000
    });
    toast.present();
  }



}
