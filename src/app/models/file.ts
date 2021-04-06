import { Permission } from "./permission";


export class File {

  id : string;
  name : string;
  mimeType : string;
  permissions : Permission[];
  children : File[];

  constructor( id : string , name :string , mimeType : string ) {

    this.id = id;
    this.name = name;
    this.mimeType = mimeType;
    this.permissions = [];
    this.children = [];

  }

  permissionId( email : string ) : string {
    let permission = this.permissions.find(perm => perm.emailAddress == email);
    if (permission) {
      return permission.id;
    }else if (this.hasChild()) {
      let id = '';
      for (const child of this.children) {
        if (child.hasPermission(email)) {
          id = child.permissionId(email);
        }
      }
      return id;
    }else {
      return '';
    }
  }

  hasPermission( email : string ) {
    let hasPermission = this.permissions.some((permission) => permission.includes(email));

    if (this.children.length != 0) {
      hasPermission = this.children.some(file => file.hasPermission(email));
    }

    return hasPermission;
  }

  hasChild() {
    return this.children.length != 0;
  }

}
