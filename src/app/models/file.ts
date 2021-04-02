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

  hasPermission( email : string ) {
    return this.permissions.find((permission) => permission.includes(email)) != undefined ? true : false;
  }


}
