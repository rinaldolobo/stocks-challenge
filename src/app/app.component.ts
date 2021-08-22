import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {StocksService} from "./services/stocks.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit,OnDestroy{
  stocksData = [];
  activeStock;
  updateInterval;
  isMobile = false;

  constructor(private stockService: StocksService) {}

  ngOnInit() {
    this.isMobile = window.innerWidth<768;
    this.getStocksData();
    this.updateReadableTime();
    window.onbeforeunload = () => this.ngOnDestroy();
  }

  getStocksData(){
    this.stockService.openSocketConnection();
    this.stockService.getStockUpdates().subscribe(res=>{
      this.updateStocksData(res);
    }, error=>{
      console.log(error);
    })
  }

  setActiveStock(){
    if(!this.activeStock){
      this.activeStock = JSON.parse(JSON.stringify(this.stocksData[0]));
    }
    else {
      let temp = this.stocksData.find(obj=>{
        return obj['stockName'] === this.activeStock['stockName']
      })
      if(temp) {
        this.activeStock = JSON.parse(JSON.stringify(temp));
      }
    }
  }

  updateReadableTime(){
    this.updateInterval = setInterval(()=>{
      this.stocksData.forEach(stock=>{
        stock['readableUpdatedTime'] = this.readableTimeDifference(stock['updatedTimestamp']);
      });
      this.stocksData = [...this.stocksData];
    },60)
  }

  updateStocksData(data){
    let time = new Date().getTime();
    data.forEach(newStock => {
      let currentIndex = this.stocksData.findIndex((oldStock)=>{
        return oldStock['stockName'] == newStock[0];
      });

      let stock = {
        stockName:newStock[0],
        stockCurrentPrice:parseFloat(newStock[1].toFixed(2)),
        stockPriceHistory:[],
        priceDifference:0,
      }

      if(currentIndex===-1){
        stock['stockPriceHistory'].push({
          name:time,
          timestamp:time,
          difference:0,
          relativeDifference:0,
          value:stock['stockCurrentPrice']
        });
        stock['updatedTimestamp'] = time;
        stock['readableUpdatedTime'] = this.readableTimeDifference(time);
        stock['relativeDifference'] = 0;
        stock['historyUpdatedTimestamp'] = time;
        stock['createdTimestamp'] = time;
        this.stocksData.push(stock);
      }
      else{
        this.stocksData[currentIndex]['relativeDifference'] = parseFloat((this.relativeDiff(this.stocksData[currentIndex]['stockCurrentPrice'],parseFloat(newStock[1])).toFixed(2)));
        this.stocksData[currentIndex]['priceDifference'] = parseFloat((parseFloat(newStock[1]) - this.stocksData[currentIndex]['stockCurrentPrice']).toFixed(2));
        this.stocksData[currentIndex]['stockPriceHistory'].push({
          name:time,
          timestamp:time,
          difference:this.stocksData[currentIndex]['priceDifference'],
          relativeDifference:this.stocksData[currentIndex]['relativeDifference'],
          value:stock['stockCurrentPrice']
        });
        this.stocksData[currentIndex]['historyUpdatedTimestamp']  = time;
        this.stocksData[currentIndex]['updatedTimestamp'] = time;
        this.stocksData[currentIndex]['readableUpdatedTime'] = this.readableTimeDifference(time);
        this.stocksData[currentIndex]['stockCurrentPrice'] = stock['stockCurrentPrice'];
      }
    });
    this.stocksData = [...this.stocksData];
    this.setActiveStock();
  }

  readableTimeDifference(time) {
    let date1 = new Date(time)
    let date2 = new Date();
    let difference = date2.getTime() - date1.getTime();

    let daysDifference = Math.floor(difference/1000/60/60/24);
    difference -= daysDifference*1000*60*60*24

    let hoursDifference = Math.floor(difference/1000/60/60);
    difference -= hoursDifference*1000*60*60

    let minutesDifference = Math.floor(difference/1000/60);
    difference -= minutesDifference*1000*60

    let secondsDifference = Math.floor(difference/1000);

    return (daysDifference>0?(daysDifference+' days ago'):(hoursDifference>0?(hoursDifference+' hours ago'):(minutesDifference>0?(minutesDifference+'mins ago'):secondsDifference==0?('just now'):(secondsDifference+' secs ago'))));
  }

  relativeDiff(a, b) {
    return  100 * Math.abs( ( a - b ) / ( (a+b)/2 ) );
  }

  ngOnDestroy() {
    this.stockService.getStockUpdates().complete();
    clearInterval(this.updateInterval);
  }

  @HostListener('window:resize')
  resize(){
    this.isMobile = window.innerWidth<768;
  }
}
