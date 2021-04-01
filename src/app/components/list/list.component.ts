import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {MatTreeFlatDataSource, MatTreeFlattener, MatTreeNestedDataSource} from '@angular/material/tree';
import {FlatTreeControl, NestedTreeControl} from '@angular/cdk/tree';
import { AuthService } from 'src/app/services/auth.service';
import { FileService } from 'src/app/services/file.service';
import { File } from 'src/app/models/file';


interface FileNode {
  name: string;
  children?: FileNode[];
}

const TREE_DATA: FileNode[] = [
  {
    name: 'Fruit',
    children: [
      {name: 'Apple'},
      {name: 'Banana'},
      {name: 'Fruit loops'},
    ]
  }, {
    name: 'Vegetables',
    children: [
      {
        name: 'Green',
        children: [
          {name: 'Broccoli'},
          {name: 'Brussels sprouts'},
        ]
      }, {
        name: 'Orange',
        children: [
          {name: 'Pumpkins'},
          {name: 'Carrots'},
        ]
      },
    ]
  },
];


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  treeControl = new NestedTreeControl<File>(node => node.children);
  dataSource = new MatTreeNestedDataSource<File>();


  hasChild = (_: number, node: File) => !!node.children && node.children.length > 0;


    constructor( private authService : AuthService , private fileService : FileService ){
      this.dataSource.data = [];
    }

    ngOnInit(): void {
      console.log(this.authService.token);
      this.fileService.files().subscribe(( resp : any )=>{
        console.log(resp);
        this.dataSource.data = resp;
      });

    }


  }
