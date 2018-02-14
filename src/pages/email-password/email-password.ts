import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, Loading } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CodepasswordPage } from '../codepassword/codepassword';

@Component({
  selector: 'page-email-password',
  templateUrl: 'email-password.html',
})
export class EmailPasswordPage {
	loading: Loading;
	createSuccess: boolean = false;
	codigo: any;
	ForgotPassword: FormGroup;
	formErrors = {
		'email': ''
	};
	validationMessages = {
		'email': {
	      'required': 'El correo es requerido.',
	      'email': 'El formato del correo no es correcto.',
	    }
	};

	constructor(public navCtrl: NavController, public navParams: NavParams, public http: HttpClient, private alertCtrl: AlertController, private loadingCtrl: LoadingController, private builder: FormBuilder) {
		this.ForgotPassword = this.builder.group({
	      email: ['', [Validators.required, Validators.email]]
	    });

	    this.ForgotPassword.valueChanges.subscribe(data => this.onValueChanged(data));
	    this.onValueChanged();
	}

	sendPassword(){
		if (this.ForgotPassword.valid) {
	    	this.showLoading();
			this.http.get('http://constructorakien.internow.com.mx/constructoraKienAPI/public/password/cliente/'+this.ForgotPassword.value.email)
    		.toPromise()
    		.then(
    			data => {
    				this.codigo = data;
    				this.createSuccess = true;
    				this.loading.dismiss();
    				this.showPopup("Éxito", 'Código de verificación enviado con éxito');
    			},
    			msg => {
    				this.createSuccess = false;
    				let err = JSON.parse(msg.error);
    				this.loading.dismiss();
    				this.showPopup("Error", err.error);
    			});
	    } else {
	      this.validateAllFormFields(this.ForgotPassword);
	    }
	}

	codepage(){
		this.navCtrl.push(CodepasswordPage, {email: this.ForgotPassword.value.email});
	}

	onValueChanged(data?: any) {
		if (!this.ForgotPassword) { return; }
		const form = this.ForgotPassword;

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
	      content: 'Enviando código...',
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
	            if (this.createSuccess) {
	              this.navCtrl.push(CodepasswordPage, {email: this.ForgotPassword.value.email});
	            }
	          }
	        }
	      ]
	    });
	    alert.present();
	}

}
