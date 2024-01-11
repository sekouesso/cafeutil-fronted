import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FlexLayoutModule } from '@angular/flex-layout';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BestSellerComponent } from './best-seller/best-seller.component';
import { HomeComponent } from './home/home.component';
import { FullComponent } from './layouts/full/full.component';
import { AppHeaderComponent } from './layouts/full/header/header.component';
import { AppSidebarComponent } from './layouts/full/sidebar/sidebar.component';
import { MaterialModule } from './shared/material-module';
import { SharedModule } from './shared/shared.module';
import { SignupComponent } from './signup/signup.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxUiLoaderConfig, NgxUiLoaderModule, SPINNER } from 'ngx-ui-loader';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoginComponent } from './login/login.component';
import { TokenInterceptorInterceptor } from './interceptors/token-interceptor.interceptor';


const ngxUiLoaderConfig: NgxUiLoaderConfig ={
  text:"Loading...",
  textColor:"#FFFFFF",
  textPosition:"center-center",
  bgsColor:"7b1fa2",
  fgsColor:"7b1fa2",
  fgsType:SPINNER.circle,
  fgsSize:100,
  hasProgressBar:false,
}
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    BestSellerComponent,
    FullComponent,
    AppHeaderComponent,
    AppSidebarComponent,
    SignupComponent,
    ForgotPasswordComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    FlexLayoutModule,
    SharedModule,
    HttpClientModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig)
  ],
  providers: [HttpClientModule,{provide:HTTP_INTERCEPTORS,useClass:TokenInterceptorInterceptor,multi:true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
