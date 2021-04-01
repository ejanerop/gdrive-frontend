import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {MatTreeFlatDataSource, MatTreeFlattener, MatTreeNestedDataSource} from '@angular/material/tree';
import {FlatTreeControl, NestedTreeControl} from '@angular/cdk/tree';


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

  treeControl = new NestedTreeControl<FileNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<FileNode>();


  hasChild = (_: number, node: FileNode) => !!node.children && node.children.length > 0;

    token : string | null = 's';

    constructor( private route : ActivatedRoute){
      this.dataSource.data = TREE_DATA;
    }

    ngOnInit(): void {
      this.token = this.route.snapshot.paramMap.get('token');
    }

    getToken() {
      console.log(this.token);

      return this.token;
    }

  }
