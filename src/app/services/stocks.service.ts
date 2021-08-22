import { Injectable } from '@angular/core';
import {webSocket} from "rxjs/webSocket";

@Injectable({
  providedIn: 'root'
})
export class StocksService {

  socket;

  constructor() { }

  openSocketConnection(){
    this.socket = webSocket({url:'ws://stocks.hulqmedia.com/'});
  }

  getStockUpdates(){
    return this.socket;
  }
}
