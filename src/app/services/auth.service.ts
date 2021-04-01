import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from "rxjs/operators";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  api_token : string | null = '';
  url = environment.api_url;

  constructor( private http : HttpClient ) {

    this.loadToken();

  }

  login(){

    const url = `${this.url}/login`;

    return this.http.get(url, {observe: 'response'});

  }

  logout() {

    const url = `${this.url}/logout/ya29.a0AfH6SMCUrBltIueJh80J1mx2VD3cqdnDoZz3l4nUWnrxwctCJbyHjghnSfpZn0-q3FhzgKGZyLefQ7Vf9BMgAXZF9MjFg2hixpnSFbPs04CRa9vKWZAgi6ya11tlRMBxgfkc_kDfTZtu5hlKhNZPU_PUcecH`;

    const token = this.api_token;
    return this.http.get(url, {observe: 'response'}).pipe( map( (resp : any) => {
      this.removeToken();
      return resp;
    })
    );

  }

  private saveToken( idToken: string ) {

    this.api_token = idToken;
    localStorage.setItem('token', idToken);

    let hoy = new Date();
    hoy.setSeconds( 3600 );

    localStorage.setItem('expira', hoy.getTime().toString() );

  }

  removeToken() {

    localStorage.removeItem('token');
    localStorage.removeItem('expira');

  }

  loadToken() {

    if ( localStorage.getItem('token') == null ) {
      this.api_token = '';
    } else {
      this.api_token = localStorage.getItem('token');
    }

    return this.api_token;

  }

  get token() {

    return this.api_token;

  }

  isAuth() {

    if ( this.api_token != null && this.api_token.length < 2  ) {
      return false;
    }

    const expira = Number(localStorage.getItem('expira'));
    const expiraDate = new Date();
    expiraDate.setTime(expira);

    if ( expiraDate > new Date() ) {
      return true;
    } else {
      return false;
    }

  }

}
