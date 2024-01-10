import { Component, OnInit } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.page.html',
  styleUrls: ['./my-profile.page.scss'],
})
export class MyProfilePage implements OnInit {

  userData: any;

  constructor(
    private nativeStorage: NativeStorage,
    private navController:  NavController
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

}
