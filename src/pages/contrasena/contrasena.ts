import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, Loading } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-contrasena',
  templateUrl: 'contrasena.html',
})
export class ContrasenaPage {
	loading: Loading;
	updateSuccess: boolean = false;
	id_cliente: number;
	UpdatePassword: FormGroup;
	formErrors = {
		'password': '',
		'rpassword': '',
		'token': ''
	};
	validationMessages = {
		'password': {
		  'required': 'La contraseña es requerida.',
		  'minlength': 'La contraseña debe contener un mínimo de 8 caracteres.'
		},
		'rpassword': {
		  'required': 'El confirmar contraseña es requerido.',
		  'minlength': 'La contraseña debe contener un mínimo de 8 caracteres.'
		}
	};

	constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, public http: HttpClient, private loadingCtrl: LoadingController, private builder: FormBuilder) {
		this.id_cliente = navParams.get('id_cliente');
		this.UpdatePassword = this.builder.group({
	      password: ['', [Validators.required, Validators.minLength(8)]],
	      rpassword: ['', [Validators.required, Validators.minLength(8)]],
	      token: [navParams.get('token')]
	    });

	    this.UpdatePassword.valueChanges.subscribe(data => this.onValueChanged(data));
	    this.onValueChanged();
	}

	updatePassword(){
		if (this.UpdatePassword.valid) {
	    	if (this.UpdatePassword.value.password !== this.UpdatePassword.value.rpassword) {
		      this.showPopup("Error", "Contraseñas no coinciden.")
		    } else {
				this.showLoading();
				this.http.put('http://constructorakien.internow.com.mx/constructoraKienAPI/public/usuarios/'+this.id_cliente, this.UpdatePassword.value)
	    		.toPromise()
	    		.then(
	    			data => {
	    				this.loading.dismiss();
	    				this.navCtrl.setRoot(LoginPage);
	    			},
	    			msg => {
	    				let err = JSON.parse(msg.error);
	    				this.loading.dismiss();
	    				this.showPopup("Error", err.error);
	    			});
		    }
	    } else {
	      this.validateAllFormFields(this.UpdatePassword);
	    }
	}
	
	onValueChanged(data?: any) {
		if (!this.UpdatePassword) { return; }
		const form = this.UpdatePassword;

		for (const field in this.formErrors) { 
		  const control = form.get(field);
		  this.formErrors[field] = '';
		  if (control && control.dirty && !control.valid) {
		    const messages = this.validationMessages[field];
		    for (const key in control.errors) {
		      this.formErrors[field] += messages[key] + ' ';
		    }
		  } 
		}
	}

	validateAllFormFields(formGroup: FormGroup) {
		Object.keys(formGroup.controls).forEach(field => {
		  const control = formGroup.get(field);
		  if (control instanceof FormControl) {
		    control.markAsDirty({ onlySelf:true });
		    this.onValueChanged();
		  } else if (control instanceof FormGroup) {
		    this.validateAllFormFields(control);
		  }
		});
	}

	showLoading() {
	    this.loading = this.loadingCtrl.create({
	      content: 'Actualizando contraseña...',
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
	            if (this.updateSuccess) {
	              this.navCtrl.popToRoot();
	            }
	          }
	        }
	      ]
	    });
	    alert.present();
	}

}
