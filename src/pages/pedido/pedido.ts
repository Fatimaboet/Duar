import {
 GoogleMaps,
 GoogleMap,
 GoogleMapsEvent,
 GoogleMapOptions,
 LatLng,
 Geocoder, 
 GeocoderRequest, 
 GeocoderResult,
} from '@ionic-native/google-maps';
import { Component, ElementRef } from '@angular/core';
import { NavController, Platform, NavParams, AlertController, LoadingController, Loading } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { HttpClient } from '@angular/common/http';
import { CartProvider } from '../../providers/cart/cart';
import { StorageProvider } from '../../providers/storage/storage';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { EncaminoPage } from '../encamino/encamino';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'page-pedido',
  templateUrl: 'pedido.html',
})
export class PedidoPage {
	map: GoogleMap;
	mapElement: HTMLElement;
	loading: Loading;
	loadingG: Loading;
	private items: any[];
	public quantity: any;
	public type: string;
	public total: number;
	mark: any;
	myPosition: any = {};
	address: any;
	refresh: boolean = false;
	ordens: any[] = [];
	Orders = {
	  	direccion: '',
	  	descripcion: '', 
	  	lat: 0,
	  	lng: 0,
	  	usuario_id: this.storage.get('userKien'),
	  	total: '',
	  	productos: '',
	  	token: this.storage.get('tokenKien')
	};
	loginCredentials = {
	    user: '',
	    password: ''
	};

	constructor(public navCtrl: NavController, public http: HttpClient, public platform: Platform, public navParams: NavParams, public cartProvider: CartProvider, public alertCtrl: AlertController, public geocoder: Geocoder, private loadingCtrl: LoadingController, private auth: AuthServiceProvider, public geolocation: Geolocation, public googleMaps: GoogleMaps, public element:ElementRef, public storage: StorageProvider) {
		this.type = navParams.get('dir');
		this.element = element;
		this.initItem();
	}

	initItem(){
	  	this.items = this.cartProvider.getCartContents();
	  	console.log(this.items);
	  	for (var i = 0; i < this.items.length; ++i) {
	  		let cost = parseFloat(this.items[i].costo)*parseFloat(this.items[i].cantidad);
			this.ordens.push({producto_id:this.items[i].id, cantidad: this.items[i].cantidad, precio:cost});
		}
		this.Orders.productos = JSON.stringify(this.ordens);
	  	let totals = this.cartProvider.getCartTotal();
	    this.Orders.total = totals.toFixed(2);
	}

	ngAfterViewInit(){
	    this.element.nativeElement.querySelector("textarea").style.height = "150px";
	}

	ionViewDidEnter() {  
		this.platform.ready().then(()=>{
			if (this.type === 'location') {
				this.getCurrentPosition();
			}
		})
  	}

  	ionViewDidLeave() {
	    if (this.map) {
	      this.map.remove();
	      this.map.setDiv(null);
	    }
	    this.map = null;
	}

	getCurrentPosition(){
		this.showLoadingGeo();
		let optionsGPS = {timeout: 9000, enableHighAccuracy: true};
		this.geolocation.getCurrentPosition(optionsGPS)
		.then(position => {
		  this.myPosition = {
		    latitude: position.coords.latitude,
		    longitude: position.coords.longitude
		  }
		  this.refresh = false;
		  this.loadMap();
		})
		.catch((error) => {
		  this.loadingG.dismiss();
		  this.refresh = true;
		  this.showPopup("Error", 'Active el GPS para encontrar su ubicación');
		})
	}

    loadMap() {
		this.mapElement = document.getElementById('map');
			let mapOptions: GoogleMapOptions = {
			camera: {
			  target: {
			    lat: this.myPosition.latitude,
			    lng: this.myPosition.longitude
			  },
			  zoom: 18,
			  tilt: 30
			}
		};

		this.map = GoogleMaps.create(this.mapElement, mapOptions);
		//setTimeout(function() { this.googleMaps.maps.event.trigger(this.map, 'resize') }, 600);
		this.loadingG.dismiss();

		this.map.one(GoogleMapsEvent.MAP_READY)
		.then(() => {

		    this.refresh = false;

			this.map.addMarker({
			  title: 'Haz click en el mapa para encontrar tu ubicación',
			  icon: 'red',
			  animation: 'DROP',
			  position: {
			    lat: this.myPosition.latitude,
			    lng: this.myPosition.longitude
			  },
			  draggable: true
			})
		  .then(marker => {
		    this.doGeocode(marker);
		    this.mark = marker;
		    this.showPopup('Aviso','Haz click en el mapa para encontrar tu ubicación');
		    marker.on(GoogleMapsEvent.MARKER_DRAG_END).subscribe(() => { 
		        var position = marker.getPosition();
		        this.myPosition.latitude = position.lat;
		        this.myPosition.longitude = position.lng;
		        marker.hideInfoWindow();
		        this.doGeocode(marker);
		    });
		  });

		   this.map.on(GoogleMapsEvent.MAP_CLICK).subscribe((e) => { 
		      let pos = new LatLng(e[0].lat,e[0].lng);
		    this.mark.setPosition(pos);
		    this.myPosition.latitude = e[0].lat;
		    this.myPosition.longitude = e[0].lng;
		    this.mark.hideInfoWindow();
		    this.doGeocode(this.mark);
		    });
		});
    }

    doGeocode(marker){
	    let request: GeocoderRequest = {
	      position: new LatLng(this.myPosition.latitude, this.myPosition.longitude),
	    };

	    this.geocoder.geocode(request).then((results: GeocoderResult) => {
	      this.address = [
	        (results[0].thoroughfare || "") + " " + (results[0].subThoroughfare || ""), 
	        (results[0].subLocality || ""), results[0].locality +" "+ (results[0].postalCode || "")
	      ].join(", ");
	      marker.setTitle(this.address);
	      marker.showInfoWindow();
	    });
	}


	order(){	
		this.showLoading();
		if (this.type === 'location') {
			this.Orders.lat = this.myPosition.latitude;
			this.Orders.lng = this.myPosition.longitude;
			this.Orders.direccion = this.address;
		}
		console.log(this.Orders);
		this.http.post('http://constructorakien.internow.com.mx/constructoraKienAPI/public/pedidos', this.Orders)
        .toPromise()
        .then(
          data => {
          	this.loading.dismiss();
          	this.cartProvider.deleteCar();
          	this.http.get('http://constructorakien.internow.com.mx/onesignal.php')
			.toPromise()
			.then(
				data => {
					
				},
				msg => {
			});
          	this.navCtrl.push(EncaminoPage);
          },
          msg => {
          	this.loading.dismiss();
  			if (msg.status == 400 || msg.status == 401) {
  				this.presentPrompt();
  			} else {
  				let err = JSON.parse(msg.error);
    			this.showPopup("Error", err.error);
  			}
          }
        );
	}

	presentPrompt() {
	  const alert = this.alertCtrl.create({
	    title: 'Validar Sesión',
	    inputs: [
	      {
	        name: 'usuario',
	        placeholder: 'USUARIO',
	        value: this.storage.get('nameKien')
	      },
	      {
	        name: 'password',
	        placeholder: 'CONTRASEÑA',
	        type: 'password'
	      }
	    ],
	    buttons: [
	      {
	        text: 'CANCELAR',
	        role: 'cancel',
	        handler: data => {
	        }
	      },
	      {
	        text: 'ENTRAR',
	        handler: data => {
	        	this.loginCredentials.user = data.usuario;
	        	this.loginCredentials.password = data.password;
	          	this.auth.login(this.loginCredentials).subscribe(allowed => {
			      if (allowed) { 
			      	this.Orders.token = this.storage.get('tokenKien');    
			        return false;
			      } else {
			        this.showPopup("Error","Error Accesso Denegado");
			        return false;
			      }
			    },
			      error => {
			        this.showPopup("Error",error.error);
			        return false;
			    });
	        }
	      }
	    ]
	  });
	  alert.present();
	}

	showLoading() {
	    this.loading = this.loadingCtrl.create({
	      content: 'Enviando Pedido...'
	    });
	    this.loading.present();
	}

	showLoadingGeo() {
		this.loadingG = this.loadingCtrl.create({
	  		content: 'Buscando Ubicación...'
		});
		this.loadingG.present();
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
