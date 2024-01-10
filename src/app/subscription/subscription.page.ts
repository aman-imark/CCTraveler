import { Component, OnInit } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { Stripe } from '@ionic-native/stripe/ngx';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.page.html',
  styleUrls: ['./subscription.page.scss'],
})
export class SubscriptionPage implements OnInit {

  slideOpts = {
    initialSlide: 0,
    speed: 400
  };

  constructor(
    private navCtrl: NavController
  ) { }

  ngOnInit() {
  }

  gotoPage(plan_id, stripe_price_id) {
    let objToSend: NavigationExtras = {
      queryParams: {
        plan_id: plan_id,
        stripe_price_id: stripe_price_id,
      },
  };
    this.navCtrl.navigateForward('/card', objToSend);
  }



}
