import { Component, Inject, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { DOCUMENT } from '@angular/common';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  constructor( @Inject(DOCUMENT) private document: Document ,  private authService : AuthService) { }

  ngOnInit(): void {
  }

  login() {
    this.document.location.href = `${environment.api_url}/login`;
  }

  logout() {
    this.authService.logout().subscribe(resp => console.log(resp));
  }


}
