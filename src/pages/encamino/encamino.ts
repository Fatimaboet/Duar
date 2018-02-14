import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';


@Component({
  selector: 'page-encamino',
  templateUrl: 'encamino.html',
})
export class EncaminoPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EncaminoPage');
  }

  closeModal() {
    this.navCtrl.setRoot(HomePage);
  }
}
