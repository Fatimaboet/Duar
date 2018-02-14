import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, Loading } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { ContrasenaPage } from '../contrasena/contrasena';

@Component({
  selector: 'page-codepassword',
  templateUrl: 'codepassword.html',
})
export class CodepasswordPage {
	loading: Loading;
 	CodePassword = {
		code: ''
	}
	public correo:any;
	public id: any;

	constructor(public navCtrl: NavController, public navParams: NavParams, public http: HttpClient, private alertCtrl: AlertController, private loadingCtrl: LoadingController) {
		this.correo = navParams.get('email');
	}

	codePassword(){
		this.showLoading();
		this.http.get('http://constructorakien.internow.com.mx/constructoraKienAPI/public/password/codigo/'+this.CodePassword.code)
		.toPromise()
		.then(
			data => {
				this.id = data;
				this.loading.dismiss();
				this.navCtrl.push(ContrasenaPage, {id_cliente: this.id.cliente_id, token: this.id.token});
			},
			msg => {
				let err = JSON.parse(msg.error);
    			this.loading.dismiss();
    			this.showPopup("Error", err.error);
			});
	}

	solicitar(){
		this.navCtrl.pop();
	}
	
	showLoading() {
	    this.loading = this.loadingCtrl.create({
	      content: 'Verificando código...',
	      dismissOnPageChange: true
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
