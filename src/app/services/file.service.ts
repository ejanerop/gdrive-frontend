import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { File } from '../models/file';
import { Permission } from '../models/permission';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  url :string = environment.api_url;

  constructor( private http : HttpClient , private authService : AuthService ) {}

  files() {

    const url = `${this.url}/api/list`;

    let data : any = {api_token : null};

    if(this.authService.token){
      data.api_token = this.authService.token;
    }

    return this.http.post(url , data , {observe : 'response'}).pipe(map( (resp : any) =>{
      return this.createArray(resp.body.files);
    }));

  }

  private createArray( filesObj : object ){

    let files : File[];

    console.log(filesObj);

    if (filesObj == null) { return []; }

    files = this.fileArr(filesObj);

    return files;
  }

  private fileArr( filesObj : object ){

    let files : File[] = [];

    Object.values(filesObj).forEach((body:any) => {
      let file : File = new File(body.id , body.name , body.mimeType);

      file.permissions = this.permArr(body.permissions.permissions);

      if (body.children.length != 0) {
        file.children = this.fileArr(body.children);
      }
      files.push(file);
    });

    return files;

  }

  permArr( permObj : object ) {

    let permissions : Permission[] = [];

    Object.values(permObj).forEach((body:any) => {
      let permission : Permission = new Permission(body.id , body.emailAddress );
      permissions.push(permission);
    });
    return permissions;
  }

}
