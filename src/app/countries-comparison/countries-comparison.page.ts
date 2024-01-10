import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { NavController, ToastController } from '@ionic/angular';
import { ConfigService } from 'src/providers/config/config.service';
import { LoadingService } from 'src/providers/loading/loading.service';

@Component({
  selector: 'app-countries-comparison',
  templateUrl: './countries-comparison.page.html',
  styleUrls: ['./countries-comparison.page.scss'],
})
export class CountriesComparisonPage implements OnInit {

  compData;
  userData: any;

  constructor(
    private navController: NavController,
    private config: ConfigService,
    private loader: LoadingService,
    private toastController: ToastController,
    private nativeStorage: NativeStorage,
    private route: ActivatedRoute
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
          this.getCompData(this.userData.token, this.route.snapshot.params.country_id)

      } else {
        this.navController.navigateRoot('/login');
      }
    }).catch( err => {
      console.log(err);
      this.navController.navigateRoot('/login');
    });
  }

  getCompData(token, compCountId) {
    this.loader.show();
    this.config.getData(`/country/compare?country_id=${compCountId}`, token).then((res:any) => {
        this.loader.hide();
        if(res.success) {
          this.compData = res.data;
        } else {
          this.compData = "";
          this.presentToast(res.message);
        }
    }).catch( err => {
      console.log(err);
    });
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 7000
    });
    toast.present();
  }

}
