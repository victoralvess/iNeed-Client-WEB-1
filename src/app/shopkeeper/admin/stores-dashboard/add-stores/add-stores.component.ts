import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-add-stores',
  templateUrl: './add-stores.component.html',
  styleUrls: ['./add-stores.component.css']
})
export class AddStoresComponent implements OnInit {

  zipCode: String;
  color1: string;
  user: firebase.User;
  selectedCategories: any[];
  files = [];

  color2: string = '#1976D2';

  constructor() {
  }

  ngOnInit() {
  }

  imageFinishedUploading(file) {
    console.log(file, file.file.type);
    if (file.file.type != 'image/jpeg' && file.file.type != 'image/png') {
      return;
    }
    this.files.push(file);
  }

  imageRemoved(file) {
    this.files.splice(this.files.indexOf(file.src), 1);
  }

  uploadStateChange(state: boolean) {
    console.log(JSON.stringify(state));
  }

}
