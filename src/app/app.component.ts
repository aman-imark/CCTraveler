import { Component } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { NavController, Platform } from '@ionic/angular';
import { EventServiceService } from 'src/providers/event/event-service.service';
import { SplashScreen } from '@ionic-native/splash-screen/ngx'
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { ConfigService } from 'src/providers/config/config.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  isLogged: boolean;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private nativeStrg: NativeStorage,
    private navCtrl: NavController,
    private eventsrc: EventServiceService,
    public config: ConfigService,
    ) 
    
    
    {
        this.initializeApp();
    }

  initializeApp() {
    this.platform.ready().then(() => {
        this.statusBar.overlaysWebView(false);
        this.statusBar.backgroundColorByHexString('#2B82D5')
        this.statusBar.styleBlackTranslucent();

        this.splashScreen.hide();
        this.eventPublish();
        this.checkLogin();
    });
  }

  eventPublish() {
    this.eventsrc.currentEvent.subscribe(data => {
        this.isLogged = true;
    });
  }

  checkLogin() {
    // console.log('MAin '+this.nativeStrg.getItem('user_data'));
    this.nativeStrg.getItem('user_data').then( result => {
        this.isLogged = true
        if(!result.is_subscribed) {
          this.navCtrl.navigateRoot('subscription');
        } else {
          this.navCtrl.navigateRoot('home/tabs/tab1');
        }
    }).catch( err => {
      this.isLogged = false;
      this.navCtrl.navigateRoot('/');
    });
  }
}
