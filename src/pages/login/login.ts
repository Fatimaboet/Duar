import { Component } from '@angular/core';
import { NavController, NavParams,  AlertController, LoadingController, Loading } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { Keyboard } from '@ionic-native/keyboard';
import { RegistroUsuarioPage } from '../registro-usuario/registro-usuario';
import { HomePage } from '../home/home';
import { EmailPasswordPage } from '../email-password/email-password';

import { ListProductsPage } from '../list-products/list-products';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
	showFooter: boolean = true;
	loginCredentials = {
		user: '',
		password: ''
	};
	loading: Loading;

	constructor(public navCtrl: NavController, public navParams: NavParams, public http: HttpClient, private auth: AuthServiceProvider, private alertCtrl: AlertController, private loadingCtrl: LoadingController, public keyboard: Keyboard) {
	}
	
	ionViewDidLoad() {
	    this.keyboard.onKeyboardShow().subscribe((value) => { 
	    	this.showFooter = false; 
		})
		this.keyboard.onKeyboardHide().subscribe ((value) => { 
			this.showFooter = true;
		})
	}

	registrar_usuario() {
		this.navCtrl.push(RegistroUsuarioPage);
	}

	public login() {
		this.showLoading()
		this.auth.login(this.loginCredentials).subscribe(allowed => {
		  if (allowed) {        
		    this.navCtrl.setRoot(HomePage);
		  } else {
		    this.showError("Accesso Denegado");
		  }
		},
		  error => {
		    this.showError(error.error);
		  });
	}

	showLoading() {
		this.loading = this.loadingCtrl.create({
		  content: 'Iniciando Sesión...',
		  dismissOnPageChange: true
		});
		this.loading.present();
	}

	showError(text) {
		this.loading.dismiss();

		let alert = this.alertCtrl.create({
		  title: 'Error',
		  subTitle: text,
		  buttons: ['OK']
		});
		alert.present(prompt);
	}

	olvido_password(){
		this.navCtrl.push(EmailPasswordPage);
	}

	listado_productos() {
		this.navCtrl.push(ListProductsPage);
	}
}
