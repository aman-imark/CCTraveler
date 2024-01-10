// import { resolveForwardRef } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { NavController, ToastController } from '@ionic/angular';
import { ConfigService } from 'src/providers/config/config.service';
import { EventServiceService } from 'src/providers/event/event-service.service';
import { LoadingService } from 'src/providers/loading/loading.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  location;


  constructor(
    public nav: NavController,
    public config: ConfigService,
    public loader: LoadingService,
    public toastController: ToastController,
    public nativeStorage: NativeStorage,
    public eventService: EventServiceService
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getLocation();
  }

  getLocation() {
    this.loader.show();
    this.config.getData('/location/list').then((res:any) => {
       this.loader.hide();
        if(res.success) {
          this.location = res.data;
        } else {
          this.presentToast(res.message);
        }
    }).catch( err => {
      console.log(err);
    })
  }

  register(formData) {
    this.loader.show();
    this.config.postData('/register', formData.value).then((res:any) => {
     console.log('Signup '+ res);
        this.loader.hide();
        if(res.success) {
          // event publish
          this.eventService.publish( res.data);
          // native storage
          this.nativeStorage.setItem('user_data', res.data);
          this.nav.navigateRoot('subscription');
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
