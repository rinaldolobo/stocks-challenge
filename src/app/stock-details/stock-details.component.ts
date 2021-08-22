import {Component, HostListener, Input, OnChanges, OnInit} from '@angular/core';
import {faCaretUp,faCaretDown} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-stock-details',
  templateUrl: './stock-details.component.html',
  styleUrls: ['./stock-details.component.scss']
})
export class StockDetailsComponent implements OnInit, OnChanges{
  faChevronCircleUp = faCaretUp;
  faChevronCircleDown = faCaretDown;
  chartData;
  legend = false;
  xAxis = false;
  yAxis = false;
  showYAxisLabel = false;
  showXAxisLabel = false;
  xAxisLabel = 'Year';
  yAxisLabel = 'Population';
  isMobile = false;
  yMax = 500;
  yMin = 0;
  height = 600;
  high = 0;
  low = 0;

  customColors = [];

  @Input() stockDetails;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges() {
    console.log(this.stockDetails);
    this.isMobile = window.innerWidth<768;
    this.height = window.innerWidth<=768?window.innerHeight*0.4:window.innerHeight-420;
    this.chartData = JSON.parse(JSON.stringify([]));
    this.high = this.stockDetails.stockPriceHistory.reduce((prev, current) => (prev.value > current.value) ? prev : current);
    this.low = this.stockDetails.stockPriceHistory.reduce((prev, current) => (prev.value < current.value) ? prev : current);
    this.yMax = this.high['value'];
    this.yMin = this.low['value'];
    this.chartData = JSON.parse(JSON.stringify([{
      name:this.stockDetails.stockName,
      series:this.stockDetails.stockPriceHistory.sort((x,y)=> {return x.timestamp - y.timestamp})
    }]));
    this.customColors = [
      [{
        name:this.stockDetails.stockName,
        value:'#1fffd3'
      }],
      [{
        name:this.stockDetails.stockName,
        value:'#ff5838'
      }],
      [{
        name:this.stockDetails.stockName,
        value:'#ffffff'
      }]
    ];
  }

  getColor = () => {
    return this.stockDetails.priceDifference>0?this.customColors[0]:this.stockDetails.priceDifference<0?this.customColors[1]:this.customColors[2];
  }


  @HostListener('window:resize')
  resize(){
    this.height = window.innerWidth<=768?window.innerHeight*0.4:window.innerHeight-420;
    this.isMobile = window.innerWidth<768;
  }
}
