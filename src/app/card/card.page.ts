import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Stripe } from '@ionic-native/stripe/ngx';
import { NavController, ToastController } from '@ionic/angular';
import { ConfigService } from 'src/providers/config/config.service';
import { EventServiceService } from 'src/providers/event/event-service.service';
import { LoadingService } from 'src/providers/loading/loading.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.page.html',
  styleUrls: ['./card.page.scss'],
})
export class CardPage implements OnInit {

  my_publishable_key = 'pk_live_51J9msiBzW7VGEAzFDlMCgROGGejVpQ4cSeX9kSJCqOXGmuiSDLTepow3EMipwu19aDQOZc8VYHflvT2Y5wnv7Wwq00YeZQbqxB';
  token;
  currentYear;
  futureYear;
  plan_id;
  stripe_plan_id;

  constructor(
    private stripe: Stripe,
    private config: ConfigService,
    private loader: LoadingService,
    private navCtrl: NavController,
    private toastCtlr: ToastController,
    public actRoute: ActivatedRoute,
    public eventService: EventServiceService,
    private nativeStrg: NativeStorage) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    let currYear = new Date();
    this.currentYear = currYear.getFullYear();

    let futYear = new Date(new Date().setFullYear(new Date().getFullYear() + 20));
    this.futureYear = futYear.getFullYear();
    this.getLogedData();
  }

  getLogedData() {
    this.nativeStrg.getItem('user_data').then( d => {
      this.token = d.token;
      this.actRoute.queryParams.subscribe( result => {
        // let res = JSON.parse(result);
        this.plan_id = result.plan_id;
       this.stripe_plan_id = result.stripe_price_id
      });
    }).catch( err => {
      this.navCtrl.navigateRoot('/login');
    })
  }

  moveFocus(currentElement, nextElement) {
    if(currentElement.target.value.length == 4){
      nextElement.el.setFocus()
      // console.log();
    }
  }

  pay(form) {
    const number = form.value.card1+form.value.card2+form.value.card3+form.value.card4;
    const cvc = form.value.CCV;
    const expMonth = new Date(form.value.valid_thru).getMonth();
    const expYear = new Date(form.value.valid_thru).getFullYear();
    let card = {
      number: number,
      expMonth: ("0" + (expMonth + 1)).slice(-2),
      expYear: expYear,
      cvc: cvc,
      name: form.value.card_holder_name
     }
     this.stripePayment(card);
  }

  stripePayment(card) {
    this.loader.show();
    this.stripe.setPublishableKey(this.my_publishable_key);
    // console.log(card);
    this.stripe.createCardToken(card)
       .then(token => {
        let payload = {
          'token': token.id
        }
            this.config.postData('/card/add',payload, this.token).then((response: any) => {
              this.loader.hide();
              if(response?.success) {
                this.subscribe(this.plan_id, this.stripe_plan_id);
              } else {
                // print error message
                this.presentToast(response?.message)
              }
            }).catch( err => {
              this.loader.hide();
              console.log(err);
            });
       }).catch(error => {
         this.loader.hide();
         console.log(error);
         this.presentToast(error);
       });
  }

  subscribe(plan_id,stripe_sub_id) {
    let payload = {
      'plan_id': plan_id,
      'stripe_sub_id': stripe_sub_id
    }
    this.config.postData('/subscription/charge',payload, this.token).then((response: any) => {
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


  async presentToast(message) {
    const toast = await this.toastCtlr.create({
      message: message,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

}
