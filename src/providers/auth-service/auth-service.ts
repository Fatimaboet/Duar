import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {StorageProvider} from '../storage/storage';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';


export class User {
  name: string;
  user: string;
 
  constructor(name: string, user: string) {
    this.name = name;
    this.user = user;
  }
}

@Injectable()
export class AuthServiceProvider {

  currentUser: User;
  usuario: any;

  constructor(public http: HttpClient, public storage: StorageProvider) {}
 
  public login(credentials) {
    if (credentials.user === null || credentials.password === null) {
      return Observable.throw("Please insert credentials");
    } else {
      return Observable.create(observer => {
        this.http.post('http://constructorakien.internow.com.mx/constructoraKienAPI/public/login/app', credentials)
        .toPromise()
        .then(
          data => {
            this.usuario = data;
            this.storage.set('tokenKien',this.usuario.token);
            this.storage.set('userKien',this.usuario.user.id);
            this.storage.set('nameKien',this.usuario.user.user);
            this.currentUser = new User(this.usuario.user.nombre, this.usuario.user.user);
            observer.next(true);
            observer.complete();
          },
          msg => {
            observer.error(JSON.parse(msg.error));
            observer.complete();
          }); 
      });
    }
  }

  public register(credentials) {
    if (credentials.name === null || credentials.phone === null || credentials.email === null || credentials.username === null || credentials.password === null || credentials.rpassword === null) {
      return Observable.throw("Please insert credentials");
    } else {
      return Observable.create(observer => {
      	this.http.post('http://constructorakien.internow.com.mx/constructoraKienAPI/public/clientes', credentials)
    		.toPromise()
    		.then(
    			data => {
    				observer.next(data);
    				observer.complete();
    			},
    			msg => {
    				observer.error(JSON.parse(msg.error));
    				observer.complete();
    			});
      });
    }
  }
 
  public getUserInfo() : User {
    return this.currentUser;
  }
 
  public logout() {
    return Observable.create(observer => {
      this.currentUser = null;
      observer.next(true);
      observer.complete();
    });
  }
}