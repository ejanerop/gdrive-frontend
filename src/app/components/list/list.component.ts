import { Component, OnInit } from '@angular/core';
import { MatTreeNestedDataSource} from '@angular/material/tree';
import { NestedTreeControl} from '@angular/cdk/tree';
import { AuthService } from 'src/app/services/auth.service';
import { FileService } from 'src/app/services/file.service';
import { File } from 'src/app/models/file';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ValidatorsService } from 'src/app/services/validators.service';

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


  constructor( private authService : AuthService , private fileService : FileService , private fb : FormBuilder , validators : ValidatorsService ){
    this.dataSource.data = [];
    this.form = this.fb.group({
      email : ['' , [Validators.required , Validators.pattern('[a-z0-9._%+-]+@gmail.com') , validators.ownerEmail ]],
      permission : [''],
      files : this.fb.array([])
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

  get invalidEmail() {
    return this.form.get('email')?.invalid;
  }

  get disabledSubmit() {
    return this.invalidEmail || this.files.length === 0;
  }

  get emailError() {
    if (this.form.get('email')?.hasError('owner_email')) {
      return 'Ese es el email del dueño.';
    }else {
      return 'Escribe una dirección Gmail válida.';
    }
  }



  isFolder( node : any ) : boolean {
    return node.mimeType == 'application/vnd.google-apps.folder';
  }

  unshare() {
    console.log(this.form);

  }

  onEmailChange() {
    this.form.get('email')?.valueChanges.subscribe(email => {
      this.filter(email);
      this.dataSource.data = [];
      this.dataSource.data = this.files;
      //this.treeControl.expandAll();
      this.populateFilesArr(this.files , true);
      if(!this.disabledSubmit) {
        let permission = this.files[0].permissionId(email);
        this.form.get('permission')?.setValue(permission);
      }
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

  populateFilesArr( files : File[] , root : boolean )
  {
    let arr = this.form.controls['files'] as FormArray;

    if (root) {arr.clear();}

    for ( const file of files ) {
      if(file.hasChild()){
        this.populateFilesArr(file.children , false);
      }
      if (file.hasPermission(this.form.get('email')?.value)) {
        arr.push(new FormControl(file.id));
      }
    }
  }





}
