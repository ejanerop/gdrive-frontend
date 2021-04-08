import { AuthService } from 'src/app/services/auth.service';
import { AfterViewInit, Component, OnInit } from '@angular/core';
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
  permissions : Permission[] = [];
  treeControl = new NestedTreeControl<File>(node => node.children);


  hasChild = (_: number, node: File) => !!node.children && node.children.length > 0;
  visible = (_: number, node: File) => node.visible;

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
      this.initPermission();
    }, error =>{
      this.loading = false;
      this.openSnackBar('Hubo un error en el servidor' , 'Cerrar');
    });
  }

  initPermission() {
    this.findPermission(this.files);
  }

  private findPermission( files : File[] ) {
    files.forEach(file => {
      file.permissions.forEach(permission => {
        if (!this.permissions.some(perm => perm.id == permission.id)) {
          this.permissions.push(permission);
        }
      });
      if (file.hasChild()) {
        this.findPermission(file.children);
      }
    })
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
      this.openSnackBar('Hubo un error en el servidor' , 'Cerrar');
    });
  }

  onEmailChange() {
    this.form.get('email')?.valueChanges.subscribe(email => {
      this.filter(email);
      this.dataSource.data = [];
      this.dataSource.data = this.files;
      this.populateFilesArr(this.files , true);
      if(!this.disabledSubmit) {
        let permission = this.files[0].permissionId(email);
        this.form.get('permission')?.setValue(permission);
      }
    });
  }

  setEmail( permission : Permission ) {
    this.form.get('email')?.setValue(permission.emailAddress);
    this.form.get('email')?.updateValueAndValidity();
  }

  filter( email : string ) {
    if (email == '') {
      this.unHide();
    } else {
      this.filterInner(this.files , email);
    }
    console.log(this.files);

  }

  unHide() {
    this.files.forEach(item=>item.hide(false));
  }


  filterInner( files : File[] , email : string ) {
    files.forEach(item => {
      if (item.hasPermission(email)) {
        item.hide(false);
      }else {
        item.hide(true);
      }
      if (item.hasChild()) {
        this.filterInner(item.children , email);
      }
    });
  }

  copyFilesArr( files : File[]){
    let result : File[] = [];
    for (const file of files.slice(0)) {
      let size = result.push(file);
      if (file.hasChild()) {
        result[size-1].children=this.copyFilesArr(file.children);
      }
    }
    return result;
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
