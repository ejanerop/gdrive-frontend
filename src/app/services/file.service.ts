import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  url :string = environment.api_url;

  constructor( private http : HttpClient , private authService : AuthService ) {}

  files() {

    const url = `${this.url}/list`;

    let data : any = null;

    data.api_token = this.authService.token;

    return this.http.post(url , data , {observe : 'response'});

  }
}
