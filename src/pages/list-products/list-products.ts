import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, Loading } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';


@Component({
  selector: 'page-list-products',
  templateUrl: 'list-products.html',
})
export class ListProductsPage {
  private items: any;
  public itemdata: any;
  private products: any;
  myInput: string = '';
  loading: Loading;

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: HttpClient, private alertCtrl: AlertController, private loadingCtrl: LoadingController) {
  	this.initializeItems();
  }

  initializeItems() {
    this.showLoading();
    this.http.get('http://constructorakien.internow.com.mx/constructoraKienAPI/public/productos/habilitados/categoria')
    .toPromise()
    .then(
    data => {
      this.loading.dismiss();
      this.itemdata = data;
      this.items = this.itemdata.productos;
      this.products = this.itemdata.productos;
    },
    msg => {
      this.loading.dismiss();
      let err = JSON.parse(msg.error);
      this.showPopup('Aviso', err.error);
    });
  }

  onInput(ev: any) {
    this.items = this.products; 
    let val = ev.target.value;

    if (val && val.trim() != '') {
      this.items = this.items.filter((item) => {
        return item.nombre.toLowerCase().indexOf(val.toLowerCase()) > -1;
      })
    }
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Cargando Productos...'
    });
    this.loading.present();
  }
 
  showPopup(title, text) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: text,
      buttons: [
        {
          text: 'OK',
          handler: data => {
           
          }
        }
      ]
    });
    alert.present();
  }
}
