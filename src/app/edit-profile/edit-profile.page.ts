import { Component, OnInit, ViewChild } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { NavController, ToastController } from '@ionic/angular';
import { ConfigService } from 'src/providers/config/config.service';
import { EventServiceService } from 'src/providers/event/event-service.service';
import { LoadingService } from 'src/providers/loading/loading.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {

  userData: any;
  img = '/assets/dummy-user-img.jpg';
  locationList;

  constructor(
    public navController: NavController,
    public config: ConfigService,
    public loader: LoadingService,
    public toastController: ToastController,
    public nativeStorage: NativeStorage,
    public eventService: EventServiceService,
    private camera: Camera
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
        this.img = data?.profile_pic;
        this.getLoc(data?.token);
      } else {
        this.navController.navigateRoot('/login');
      }
    }).catch( err => {
      console.log(err);
      this.navController.navigateRoot('/login');
    });
  }


  updateProfile(formData) {
    this.loader.show();
    formData.value.profile_pic = this.img;
    this.config.postData('/profileUpdate', formData.value, this.userData?.token).then((res:any) => {
        this.loader.hide();
        if(res.success) {
          // event publish
          this.eventService.publish( res.data);
          // native storage
          this.nativeStorage.setItem('user_data', res.data);
          this.navController.navigateBack('/my-profile');
        } else {
          this.presentToast(res.message);
        }
    }).catch( err => {
      console.log(err);
    });
  }

  getLoc(token) {
    this.loader.show();
    this.config.getData('/location/list', token).then((res:any) => {
        this.loader.hide();
        console.log(res.data);
        if(res.success) {
          this.locationList = res.data;
        } else {
          this.presentToast(res.message);
        }
    }).catch( err => {
      console.log(err);
    });
  }

  takeSnap() {
    const cameraOptions: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    this.camera.getPicture(cameraOptions).then((imageData) => {
      const base64Image = 'data:image/jpeg;base64,' + imageData;
      this.img = base64Image;
      }, (err) => {
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
