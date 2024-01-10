import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { ConfigService } from 'src/providers/config/config.service';
import { LoadingService } from 'src/providers/loading/loading.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

  constructor(
    public config: ConfigService,
    public loader: LoadingService,
    public toastController: ToastController
   ) { }

  ngOnInit() {
  }

  forgotPassword(formData) {
    this.loader.show();
    console.log(formData);
    this.config.postData('/forgot-password', formData.value).then((res:any) => {
        this.loader.hide();
        this.presentToast(res.message);
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
