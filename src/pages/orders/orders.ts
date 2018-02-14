import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { PedidoPage } from '../pedido/pedido';
import { CartProvider } from '../../providers/cart/cart';

@Component({
  selector: 'page-orders',
  templateUrl: 'orders.html',
})
export class OrdersPage {
	private items: any[];
	public type: string = 'address';
	public itemscart: number;
	public total: number;

  constructor(public navCtrl: NavController, public navParams: NavParams, public cartProvider: CartProvider, public alertCtrl: AlertController) {
  	this.initItem();
  }

  initItem(){
  	this.items = this.cartProvider.getCartContents();
  	this.itemscart = this.cartProvider.getCartCount();
  	let totals = this.cartProvider.getCartTotal();
    this.total = totals.toFixed(2);
  }

  changeQuantity(event,item){
  	this.cartProvider.updateProduct(item, item.cantidad).subscribe(
	    success => {
	      let totals = this.cartProvider.getCartTotal();
        this.total = totals.toFixed(2);
	    },
	    error => {
	      this.showPopup('Error', error);
	    }
	  );
  }

  remove(item){
  	const alert = this.alertCtrl.create({
      title: 'Eliminar Producto',
      message: '¿Desea eliminar <b>'+item.nombre+'</b>?',
      buttons: [
        {
          text: 'CANCELAR',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'SI',
          handler: () => {
            this.cartProvider.removeProduct(item).subscribe(
			    success => {
            let totals = this.cartProvider.getCartTotal();
            this.total = totals.toFixed(2);
            this.itemscart = this.cartProvider.getCartCount();
			    },
			    error => {
			      console.log(error);
			    }
			);
          }
        }
      ]
    });
    alert.present();
  }

  pedir(){   
    if (this.total == 0) {
      this.showPopup('Error','Verifica las cantidades de tu pedido');
    } else {
      this.navCtrl.push(PedidoPage, {dir: this.type});
    }
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
