import { Pipe, PipeTransform } from '@angular/core';
import * as Fuse from 'fuse.js';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(list: any, query: string): any {
  	if(!list || !query) {
  		return list;
  	} 
		
		query = query.trim().replace(/\s\s+/g, " ");

  	let options = {
		  shouldSort: true,
		  tokenize: true,
		  threshold: 0.5,
		  location: 0,
		  distance: 100,
		  maxPatternLength: 40,
		  minMatchCharLength: 3,
		  keys: [
		    "name"
			]
		};
		let fuse = new Fuse(list, options);
		return fuse.search(query);
  }

}
