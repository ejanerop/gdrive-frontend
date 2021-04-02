import { Component, OnInit } from '@angular/core';
import { MatTreeNestedDataSource} from '@angular/material/tree';
import { NestedTreeControl} from '@angular/cdk/tree';
import { AuthService } from 'src/app/services/auth.service';
import { FileService } from 'src/app/services/file.service';
import { File } from 'src/app/models/file';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  treeControl = new NestedTreeControl<File>(node => node.children);
  dataSource = new MatTreeNestedDataSource<File>();
  files : File[] = [];
  allFiles : File[] = [];
  loading : boolean = false;
  form : FormGroup = new FormGroup({});


  hasChild = (_: number, node: File) => !!node.children && node.children.length > 0;


  constructor( private authService : AuthService , private fileService : FileService , private fb : FormBuilder ){
    this.dataSource.data = [];
    this.form = this.fb.group({
      email : ['' , Validators.required]
    });
  }

  ngOnInit(): void {
    console.log(this.authService.token);
    this.loading = true;
    this.fileService.files().subscribe(( resp : File[] )=>{
      console.log(resp);
      this.files = resp;
      this.dataSource.data = this.files;
      this.allFiles = this.files;
      this.loading = false;
      this.onEmailChange();
    }, error =>{
      this.loading = false;
      console.log(error);
    });

  }

  isFolder( node : any ) : boolean {
    return node.mimeType == 'application/vnd.google-apps.folder';
  }

  unshare() {
    console.log(this.form.value);

  }

  onEmailChange() {
    this.form.get('email')?.valueChanges.subscribe(email => {
      this.filter(email);
      this.dataSource.data = [];
      this.dataSource.data = this.files;
    });
  }

  filter( email : string ) {
    if (email == '') {
      this.files = this.allFiles;
    } else {
      this.files = this.allFiles.filter(item => {
        if (item.hasPermission(email)) {
          return true;
        } else {
          return false;
        }
      });
    }
    console.log(this.files);

  }



}
