import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, Loading, ToastController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { LoginPage } from '../login/login';
import { ProductsPage } from '../products/products';
import { StorageProvider } from '../../providers/storage/storage';
import { CartProvider } from '../../providers/cart/cart';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  private items: any;
  public itemdata: any;
  public itemscart: number;
  loading: Loading;

  constructor(public navCtrl: NavController,public http: HttpClient, private alertCtrl: AlertController, private loadingCtrl: LoadingController, public cartProvider: CartProvider, public storage: StorageProvider, private toastCtrl: ToastController) {
  	this.initCategories();
    //this.presentToast();
  }

  logout(){
    this.storage.set('tokenKien','');
    this.storage.set('userKien','');
    this.storage.set('nameKien','');
  	this.navCtrl.setRoot(LoginPage);
  }

 	initCategories() {
   	this.showLoading();
    this.http.get('http://constructorakien.internow.com.mx/constructoraKienAPI/public/categorias/productos')
    .toPromise()
    .then(
    data => {
      this.itemdata = data;
      this.items = this.itemdata.categorias;
      this.loading.dismiss();
    },
    msg => {
      this.loading.dismiss();
      let err = JSON.parse(msg.error);
      this.showPopup('Aviso', err.error);
    });
    let id1 = this.storage.get('userKien');
    let id2 = this.cartProvider.getCartId();
    if (id1 != id2) {
      this.cartProvider.deleteCar();
    }
	}

  products(item){
    if (item.productos != '') {
      this.navCtrl.push(ProductsPage, {productos: item.productos});
    } else {
      this.showPopup('Aviso','Por el momento no hay productos disponibles en esta categoría.');
    } 
  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    setTimeout(() => {
      console.log('Async operation has ended');
      this.initCategories();
      refresher.complete();
    }, 2000);
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Cargando Categorías...'
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

  presentToast() {
    let toast = this.toastCtrl.create({
      message: 'Haz click en el mapa para encontrar tu ubicación',
      position: 'top',
      showCloseButton: true,
      closeButtonText: 'OK'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }
}
