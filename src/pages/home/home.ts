import {Component, ElementRef, ViewChild} from "@angular/core";
import {ToastController} from "ionic-angular";
import {Geolocation, Geoposition} from "@ionic-native/geolocation";
import {LaunchNavigator} from "@ionic-native/launch-navigator";

declare let google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  map: any;
  @ViewChild('mapa') mapElement: ElementRef;
  devicePosition: Geoposition;
  failure: string = '';

  constructor(public toastCtrl: ToastController, public geolocation: Geolocation, public launchNavigator: LaunchNavigator) {

  }

  ionViewDidLoad() {
    this.geolocation.getCurrentPosition().then((position) => {
      console.log(position);
      this.devicePosition = position;

      this.loadMap();
    }, (err) => {
      this.failure = err.message;
      this.toastMessage(err.message);
    });
  }

  private loadMap() {
    let latLng = new google.maps.LatLng(this.devicePosition.coords.latitude, this.devicePosition.coords.longitude);

    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    let marker = new google.maps.Marker({
      position: latLng,
      map: this.map,
      title: 'Clique para Ir'
    });

    let self = this;

    marker.addListener('click', event => {
      self.irParaPonto(event)
    } );

    marker.setMap(this.map);
  }

  public irParaPonto(event: any) {
    this.launchNavigator.navigate([event.latLng.lat(), event.latLng.lng()])
      .then(
        () => {
          this.toastMessage('Navegador Iniciado');
        },
        error => {
          this.toastMessage(error);
        }
      );
  }

  toastMessage = (message: string) => {
    this.toastCtrl.create({
      message: message,
      duration: 3000
    }).present();
  }
}
