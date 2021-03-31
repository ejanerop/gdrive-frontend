import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  token : string | null = 's';

  constructor( private route : ActivatedRoute){
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token');
  }

  getToken() {
    console.log(this.token);

    return this.token;
  }

}
