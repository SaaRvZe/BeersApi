import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor() { }
    
stringifyMap(map: Map<any, any>): string {
    return JSON.stringify(map, this.replacer)
}

parseMapString(mapString: string): Map<any, any> {
    return JSON.parse(mapString, this.reviver)
}

///// support Map JSON.stringify
private replacer(key: any, value: any): any {
if(value instanceof Map) {
  return {
    dataType: 'Map',
    value: Array.from(value.entries()), // or with spread: value: [...value]
  };
} else {
  return value;
}
}

///// Suppoer Map JSON.parse
private reviver(key: any, value: any): any {
if(typeof value === 'object' && value !== null) {
  if (value.dataType === 'Map') {
    return new Map(value.value);
  }
}
return value;
}
}
