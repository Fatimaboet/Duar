import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { Geolocation } from '@ionic-native/geolocation';
import { GoogleMaps, Geocoder } from '@ionic-native/google-maps';
import { IonicImageViewerModule } from 'ionic-img-viewer';
import { Keyboard } from '@ionic-native/keyboard';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { PedidoPage } from '../pages/pedido/pedido';
import { RegistroUsuarioPage } from '../pages/registro-usuario/registro-usuario';
import { ListProductsPage } from '../pages/list-products/list-products';
import { ProductsPage } from '../pages/products/products';
import { OrdersPage } from '../pages/orders/orders';
import { EncaminoPage } from '../pages/encamino/encamino';
import { ContrasenaPage } from '../pages/contrasena/contrasena';
import { EmailPasswordPage } from '../pages/email-password/email-password';
import { CodepasswordPage } from '../pages/codepassword/codepassword';
import { TerminosPage } from '../pages/terminos/terminos';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { StorageProvider } from '../providers/storage/storage';
import { CartProvider } from '../providers/cart/cart';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    RegistroUsuarioPage,
    ListProductsPage,
    ProductsPage,
    OrdersPage,
    PedidoPage,
    EncaminoPage,
    ContrasenaPage,
    EmailPasswordPage,
    CodepasswordPage,
    TerminosPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    IonicImageViewerModule,
    IonicModule.forRoot(MyApp, {
      tabsPlacement: 'top',
      backButtonText: ''
    }),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    RegistroUsuarioPage,
    ListProductsPage,
    ProductsPage,
    OrdersPage,
    PedidoPage,
    EncaminoPage,
    ContrasenaPage,
    EmailPasswordPage,
    CodepasswordPage,
    TerminosPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthServiceProvider,
    StorageProvider,
    Keyboard,
    CartProvider,    
    GoogleMaps,
    Geocoder,
    Geolocation
  ]
})
export class AppModule {}
