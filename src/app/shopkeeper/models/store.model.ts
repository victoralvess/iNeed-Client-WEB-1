export interface Store {
    /*private _id: string;
    private _name: string;
    private _address: string;
    private _checked: boolean = false;*/
    id: string;
    name: string;
    address: string;
    checked: boolean;
/*
    constructor(id : string, name : string, address : string) {
      this._id = id;
      this._name = name;
      this._address = address;
    }

    get id() : string {
      return this._id;
    }

    get name() : string {
      return this._name;
    }

    get address() : string {
        return this._address;
    }

    get checked() : boolean {
      return this._checked;
    }

    set checked(isChecked) {
      this._checked = isChecked;
    }*/
}
