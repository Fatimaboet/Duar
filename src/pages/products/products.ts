import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { OrdersPage } from '../orders/orders';
import { CartProvider } from '../../providers/cart/cart';
import {StorageProvider} from '../../providers/storage/storage';
import { ImageViewerController } from 'ionic-img-viewer';

@Component({
  selector: 'page-products',
  templateUrl: 'products.html',
})
export class ProductsPage {
	private items: any;
  public ordens: any[];
  public itemscart: number;
  _imageViewerCtrl: ImageViewerController;

  constructor(public navCtrl: NavController, public navParams: NavParams, public cartProvider: CartProvider, imageViewerCtrl: ImageViewerController, public storage: StorageProvider) {
  	this._imageViewerCtrl = imageViewerCtrl;
    this.items = navParams.get('productos'); 
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductsPage');
  }

  ionViewWillEnter() {
    this.itemscart = this.cartProvider.getCartCount();
    let itemcart = this.cartProvider.getCartContents();
    this.items.map((elem1) => {
      elem1.check = false;
      itemcart.forEach((elem2) => {
        if (elem2.id === elem1.id)
          elem1.check = true;
      });
      return elem1;
    });
  }

  presentImage(myImage) {
    const imageViewer = this._imageViewerCtrl.create(myImage);
    imageViewer.present();
  }

  changeproduct(event,item){
    if (event.value) {
      this.cartProvider.addProduct(item, 1).subscribe(
        success => {
          this.itemscart = this.cartProvider.getCartCount();
        },
        error => {
          console.log(error);
        }
      );
    } else {
      this.cartProvider.removeProduct(item).subscribe(
        success => {
          this.itemscart = this.cartProvider.getCartCount();
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  order(){
    this.navCtrl.push(OrdersPage);
  }
}
