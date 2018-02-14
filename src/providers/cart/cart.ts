import {Injectable} from '@angular/core';
import {StorageProvider} from '../storage/storage';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class CartProvider {
  cartObj: any = {};

  constructor(public storage: StorageProvider) {
    let item = this.storage.getObject('cartKien');
    if (item) {
      this.cartObj.cart = item.cart;
      this.cartObj.total = item.total;
      this.cartObj.cantidad = item.cantidad;
      this.cartObj.id = item.id;
    } else {
      this.cartObj.cart = [];
      this.cartObj.total = 0;
      this.cartObj.cantidad = 0;
      this.cartObj.id = this.storage.get('userKien');
    }
  }

  addProduct(product, quantity) {
 	  return Observable.create(observer => {
      if(this.cartObj.cart.some(x => x.id === product.id)){
  			observer.error('Este producto ya esta incluido en el pedido');
  			observer.complete();
  		} else{
        product.cantidad = quantity;
  		  this.cartObj.cart.push(product);
  			this.cartObj.cantidad += 1;	
  			this.cartObj.total += parseFloat(product.costo);
  			this.storage.setObject('cartKien', this.cartObj);
  			observer.next(this.cartObj);
  			observer.complete();
  		}
    });
  }

  updateProduct(product, quantity) {
     return Observable.create(observer => {
      if(this.cartObj.cart.some(x => x.id === product.id)){
        product.cantidad = quantity;
        this.cartObj.total = 0;
        if (quantity.indexOf('/') !== -1) {
          const [first, second] = quantity.split('/');
          if (second !== '') {
            let costot = first/second;
            this.cartObj.cart.forEach((elem) => {
              if (elem.id === product.id){
                this.cartObj.total += parseFloat(product.costo)*costot;
              } else{
                var cant = elem.cantidad.toString();
                if (cant.indexOf('/') !== -1) {
                  const [first2, second2] = cant.split('/');
                  if (second2 !== '') {
                    let costot2 = first2/second2;
                    this.cartObj.total += parseFloat(elem.costo)*costot2;
                  }
                } else {
                  this.cartObj.total += parseFloat(elem.costo)*elem.cantidad;
                } 
              }
            });
          }
        } else {
          this.cartObj.cart.forEach((elem) => {
            if (elem.id === product.id){
              this.cartObj.total += parseFloat(product.costo)*quantity;
            } else{
              var cant = elem.cantidad.toString();
              if (cant.indexOf('/') !== -1) {
                const [first2, second2] = cant.split('/');
                if (second2 !== '') {
                  let costot2 = first2/second2;
                  this.cartObj.total += parseFloat(elem.costo)*costot2;
                }
              } else {
                this.cartObj.total += parseFloat(elem.costo)*elem.cantidad;
              } 
            }
          });
        }
        if (isNaN(this.cartObj.total)) {  
          observer.error('Ingrese una cantidad válida');
          observer.complete();
        } else {
          this.storage.setObject('cartKien', this.cartObj);
          observer.next(this.cartObj);
          observer.complete();
        }
      } else{
        observer.error('Este producto no está en el pedido');
        observer.complete();
      }
    });
  }

  getCartContents() {
  	return this.cartObj.cart;
  }

  getCartCount(){
  	return this.cartObj.cantidad;
  }
  
  getCartTotal(){
  	return this.cartObj.total;
  }

  getCartId(){
    return this.cartObj.id;
  }
 
  removeProduct(product) {
    return Observable.create(observer => {
    	let index = this.cartObj.cart.findIndex((item) => item.id === product.id);
      if(index !== -1){
      	this.cartObj.cart.splice(index, 1);
  			this.cartObj.cantidad -= 1;	
        var cant = product.cantidad.toString();
        if (cant.indexOf('/') !== -1) {
          const [first2, second2] = cant.split('/');
          if (second2 !== '') {
            let costot2 = first2/second2;
            this.cartObj.total -= parseFloat(product.costo)*costot2;
          }
        } else {
          this.cartObj.total -= parseFloat(product.costo)*product.cantidad;
        }
       
        if (this.cartObj.cantidad === 0) {
          this.storage.remove('cartKien');
        } else {
          this.storage.setObject('cartKien', this.cartObj);
        }
  			observer.next(this.cartObj);
  			observer.complete();
  		} else{
  			observer.error('Este servicio no esta incluido en el pedido');
  			observer.complete(); 
  		}
    });
  }

  deleteCar(){
    this.cartObj.cart = [];
    this.cartObj.total = 0;
    this.cartObj.cantidad = 0;
    this.cartObj.id = '';
    this.storage.setObject('cartKien',this.cartObj);
  }
}

