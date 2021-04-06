import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { File } from 'src/app/models/file';
import { FileService } from 'src/app/services/file.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTreeNestedDataSource} from '@angular/material/tree';
import { NestedTreeControl} from '@angular/cdk/tree';
import { ValidatorsService } from 'src/app/services/validators.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Permission } from 'src/app/models/permission';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  allFiles : File[] = [];
  dataSource = new MatTreeNestedDataSource<File>();
  files : File[] = [];
  form : FormGroup = new FormGroup({});
  loading : boolean = false;
  treeControl = new NestedTreeControl<File>(node => node.children);


  hasChild = (_: number, node: File) => !!node.children && node.children.length > 0;

  constructor(
    private authService : AuthService ,
    private fileService : FileService ,
    private fb : FormBuilder ,
    private validators : ValidatorsService,
    private _snackBar: MatSnackBar
  ){
    this.dataSource.data = [];
    this.form = this.fb.group({
      email : ['' , [Validators.required , Validators.pattern('[a-z0-9._%+-]+@gmail.com') , this.validators.ownerEmail ]],
      permission : [''],
      files : this.fb.array([])
    });
  }

  ngOnInit(): void {
    console.log(this.authService.token);
    this.initFiles();
  }

  initFiles() {
    this.loading = true;
    this.form.reset();
    this.form.get('email')?.markAsPristine();
    this.fileService.files().subscribe(( resp : File[] )=>{
      this.files    = [];
      this.allFiles = [];
      this.files = resp;
      this.dataSource.data = this.files;
      this.allFiles = this.files;
      this.loading = false;
      this.onEmailChange();
    }, error =>{
      this.loading = false;
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

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  isFolder( node : any ) : boolean {
    return node.mimeType == 'application/vnd.google-apps.folder';
  }

  unshare() {
    console.log(this.form.value);

    if (this.form.invalid) {
      this.form.get('email')?.markAsTouched();
      return;
    }

    this.fileService.unshare(this.form.value).subscribe((resp:any) => {
      console.log(resp);
      this.openSnackBar('Permisos revocados con éxito' , 'Cerrar');
      this.initFiles();
    }, error =>{
      console.error(error);
      this.openSnackBar('Permisos revocados con éxito' , 'Cerrar');
    });
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

  setEmail( permission : Permission ) {
    this.form.get('email')?.setValue(permission.emailAddress);
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
      if (file.hasPermissionOnlyRoot(this.form.get('email')?.value)) {
        arr.push(new FormControl(file.id));
      }
    }
  }





}
