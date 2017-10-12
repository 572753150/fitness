import {Component} from "@angular/core";
import {AuthService} from "./auth.service";
import {Chart} from "angular-highcharts";

@Component({

  selector: 'home',
  templateUrl: "./home.component.html",
})


export class HomeComponent{

  decoraterOfChart ={
    unite :{},
    type:{},
  };
  start:any;
  end:Date;
  chart: Chart;
  steps =[
    [new Date('2014-04-23').valueOf(), 3000],
  [new Date('2014-04-24').valueOf(), 6000],
  [new Date('2014-04-25').valueOf(), 12000],
  [new Date('2014-04-26').valueOf(), 8000],
  [new Date('2014-04-27').valueOf(), 8800],
  [new Date('2014-04-28').valueOf(), 9000],
];

  diatance =[
    [new Date('2014-05-24').valueOf(), 2],
    [new Date('2014-05-25').valueOf(), 3],
    [new Date('2014-05-26').valueOf(), 4],
    [new Date('2014-05-27').valueOf(), 1],
    [new Date('2014-05-28').valueOf(), 5],
    [new Date('2014-05-29').valueOf(), 1],
  ];


  sleep =[
    [new Date('2014-05-24').valueOf(), 2],
    [new Date('2014-05-25').valueOf(), 3],
    [new Date('2014-05-26').valueOf(), 4],
    [new Date('2014-05-27').valueOf(), 1],
    [new Date('2014-05-28').valueOf(), 5],
    [new Date('2014-05-29').valueOf(), 1],
  ];

  heartbeat =[
    [new Date('2014-05-24').valueOf(), 88],
    [new Date('2014-05-25').valueOf(), 77],
    [new Date('2014-05-26').valueOf(), 89],
    [new Date('2014-05-27').valueOf(), 90],
    [new Date('2014-05-28').valueOf(), 100],
    [new Date('2014-05-29').valueOf(), 109],
  ];
  Calories=[
    [new Date('2014-05-24').valueOf(), 2000],
    [new Date('2014-05-25').valueOf(), 2100],
    [new Date('2014-05-26').valueOf(), 2150],
    [new Date('2014-05-27').valueOf(), 3000],
    [new Date('2014-05-28').valueOf(), 1000],
    [new Date('2014-05-29').valueOf(), 1090],
  ];

  height =[
    [new Date('2014-05-24').valueOf(), 130],
    [new Date('2014-05-29').valueOf(), 130],
    [new Date('2014-05-30').valueOf(), 130],
    [new Date('2014-06-27').valueOf(), 131],
    [new Date('2014-06-28').valueOf(), 131],
    [new Date('2014-06-29').valueOf(), 131],
  ];

  weight =[
    [new Date('2014-05-24').valueOf(), 134],
    [new Date('2014-05-29').valueOf(), 134],
    [new Date('2014-05-30').valueOf(), 136],
    [new Date('2014-06-27').valueOf(), 134],
    [new Date('2014-06-28').valueOf(), 131],
    [new Date('2014-06-29').valueOf(), 138],
  ];
  constructor(private  auth :AuthService){
    var temp = new Date();
    console.log(temp.getMonth());
    this.start= temp.getFullYear()+'-'+(temp.getMonth()+1)+'-'+temp.getDate();
    console.log(this.start);
  }


  generateChart(type : string,unite :string,data:any){
    console.log(this.start);
    this.decoraterOfChart.unite=unite;
    this.decoraterOfChart.type = type;
    this.chart = new Chart({
      chart: {
        style: {
          fontFamily: "",
          fontSize: '12px',
          fontWeight: 'bold',
          color: '#006cee'
        },
        type: 'line',
        zoomType:'xy',
      },

      title: {
        text: ''
      },
      xAxis:{
        type: 'datetime',
        dateTimeLabelFormats: { // don't display the dummy year
          day: '%e/%b',
          month: '%b %y',
          year: '%Y'
        },
      },
      yAxis:{
        title:{
          text:unite
        },
        labels:{
          formatter:function(){
            return this.value ;
          },
        },

      },
      series: [
        {
          name: type,
          data:data
        },

      ],
      credits: {
        enabled: false
      },

    });





  }
}
