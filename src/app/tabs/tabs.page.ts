import { Component } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  plan_id;

  constructor(
    private nativeStrg: NativeStorage,
    private navCtrl: NavController,
  ) {}

  ionViewWillEnter() {
    this.getLogedData();
  }

  getLogedData() {
    this.nativeStrg.getItem('user_data').then( d => {
      this.plan_id = d.plan_id;
    }).catch( err => {
      this.navCtrl.navigateRoot('/');
    })
  }

}
