import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { ConfigService } from 'src/providers/config/config.service';
import { EventServiceService } from 'src/providers/event/event-service.service';
import { LoadingService } from 'src/providers/loading/loading.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HTTP } from '@ionic-native/http/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Stripe } from '@ionic-native/stripe/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';


import { Facebook } from '@ionic-native/facebook/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';

// import { WebView } from '@ionic-native/ionic-webview/ngx';


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule],
  providers: [
    HTTP,
    NativeStorage,
    Camera,
    HttpClient,
    Stripe,
    SplashScreen,
    StatusBar,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    ConfigService,
    LoadingService,
    EventServiceService,
    Facebook,
    GooglePlus,
    // WebView
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
