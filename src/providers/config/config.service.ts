import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { ToastController, Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  public yourSiteUrl =  'https://clientpreview.site/cctraveller';
  public Baseurl: string = this.yourSiteUrl + '/api';
  public postLink: string = this.yourSiteUrl + '/public/product_images/';
  public storyLink: string = this.yourSiteUrl + '/public/story_images/';

  constructor(
    private http:HTTP,
    private httpClient: HttpClient,
    public toastController: ToastController,
    public platform: Platform 
    )
    
    { }


// data post function
  postData(Url,payload, token = '') {
    let nativeHeaders;
    if(token === '') {
     nativeHeaders = {
        'Content-Type': 'application/json'
      };
    } else {
      nativeHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
    }
      return new Promise(resolve => {
        if(this.platform.is('ios') || this.platform.is('android')) {
          this.http.setDataSerializer('json');
          this.http.post(this.Baseurl+Url, payload,nativeHeaders).then(data => {
                const d = JSON.parse(data.data);
                resolve(d);
                console.log(data);
              }).catch(error => {
                console.log(error);
              });
        } else {
          this.httpClient.post(this.Baseurl+Url, payload,nativeHeaders).subscribe((data: any) => {
            resolve(data);
          }, (err) => {
            console.log('Error : ' + err);
            // console.log(err);
          });;
        }
      });
  }



  getData(Url,token = '') {
    let nativeHeaders;
    if(token === '') {
     nativeHeaders = {
        'Content-Type': 'application/json'
      };
    } else {
      nativeHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
    }

    return new Promise(resolve => {
      this.http.setDataSerializer('json');
      this.http.get(this.Baseurl+Url, {},nativeHeaders).then(data => {
        const d = JSON.parse(data.data);
            resolve(d);
          }).catch(error => {
            console.log('Error : ' + Url);
            console.log(error);
            console.log(error.error); // error message as string
            console.log(error.headers);
          });
    })
  }

  postFormData(Url,payload, token = '') {
    let nativeHeaders;
    nativeHeaders = {
      enctype: 'multipart/form-data'
    };
    return new Promise(resolve => {
      this.http.post(this.Baseurl+Url,payload, nativeHeaders)
        .then(data => {
          console.log(data)
          const d = JSON.parse(data.data);
          resolve(d);
        }).catch(error => {
          console.log('Error : ' + Url);
          console.log(error);
          console.log(error.error); // error message as string
          console.log(error.headers);
        });
    })
  }





  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      buttons: [
        {
          text: 'Done',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    toast.present();
  }

}

export interface ResObj {
    code: number;
    success: boolean;
    message: string;
    data: any;
}
