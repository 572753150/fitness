import {Component, OnInit} from "@angular/core";
import {AuthService} from "./auth.service";
import {Chart} from "angular-highcharts";
import {HomeService} from "./home.service";
import * as io from 'socket.io-client';

@Component({

  selector: 'home',
  templateUrl: "./home.component.html",
  providers: [HomeService]
})


export class HomeComponent{

  provider;
  data;
  decoraterOfChart = {
    unite: {},
    type: {},
  };
  start: any;
  end: any;
  chart: Chart;
  weightChart: Chart;
  weightStart;


  sleep: String;
  steps: String;
  heartbeats: String;
  distance: String;
  calories: String;


  socket;

  constructor(private auth: AuthService) {
    this.provider = this.auth.provider;
    // this.socket= io('http://localhost:3000');



    var now = new Date();
    var before = new Date(now.getTime() - 1000 * 60 * 60 * 24 * 6);// at least 7 days
    var nowString = this.transferDateToString(now);
    this.end = this.transferDateToString(now);
    this.start = this.transferDateToString(before);
    this.weightStart = this.transferDateToString(new Date(now.getTime() - 1000 * 60 * 60 * 24 * 31));


    if (this.provider === 'fitbit') {
      this.auth.getFitbitUserData().subscribe(res => {
        console.log(res);
        this.steps = res.summary.steps;
        this.calories = res.summary.caloriesOut;
        this.distance = res.summary.distances[0].distance;
        this.heartbeats = res.summary.restingHeartRate ? res.summary.restingHeartRate : "no data"
      });

      this.auth.getFitbitFixedRangeOfData(nowString, nowString, "sleep").subscribe(res => {
        if (res.sleep.length == 0) {
          this.sleep = "no data";
        } else {
          this.sleep = parseFloat((parseInt(res.sleep[0].duration) / (1000 * 60 * 60)).toFixed(1)) + "";
        }
      });
      this.generateFitbitWeightChart();
    }


    if (this.provider === 'jawbone') {
      this.auth.getJawboneUserDate("moves").subscribe(res => {

        if (res.length == 0) {

        } else {
          console.log(res[0]);

          var detail = res[0].details;
          this.steps = detail.steps;
          this.distance = detail.km;
          this.calories = parseInt(detail.wo_calories + detail.bg_calories + detail.bmr_day) + "";
        }

      });

      this.auth.getJawboneUserDate("sleeps").subscribe(res => {

        if (res.length == 0) {

        } else {
          console.log(res[0])

          var detail = res[0].details;
          this.sleep = parseFloat((detail.duration / 3600) + "").toFixed(1) + "";
        }

      })


      this.auth.getJawboneUserDate("heartrates").subscribe(res => {

        if (res.length == 0) {
          this.heartbeats = "no data"
        } else {
          this.heartbeats = res[0].details.resting_heartrate;
        }

      })

      var transferStart = new Date(this.weightStart.replace(/-/g,'/')).valueOf()/1000;
      var transferEnd =transferStart +  60 * 60 * 24 *32;
      this.auth.getJawboneFixedRangeOfData(transferStart+"",transferEnd+"",'body_events').subscribe(res=>{
        console.log(res);
        var  arr=[];
        res.forEach(item=>{
          var str = this.transferJawboneDateString(item);
          arr.push([new Date(str).valueOf(),item.weight])
        })


        console.log(arr);
        this.formateWeightChart(arr);
      })

    }


  }

  uu;


  transferDateToString(date: Date) {
    var dateString = date.getFullYear() + '-';


    if (date.getMonth() + 1 < 10) {
      dateString = dateString + "0" + (date.getMonth() + 1) + '-';
    } else {
      dateString = dateString + (date.getMonth() + 1) + '-';
    }
    if (date.getDate() < 10) {
      dateString = dateString + "0" + date.getDate();
    } else {
      dateString = dateString + date.getDate();
    }
    console.log(dateString);
    return dateString;
  }


  transferResDataDateFormate(obj, type: string) {
    var attr = "activities-" + type;
    var arr = [];
    obj[attr].forEach(item => {
      if (type === "heart") {
        arr.push([new Date(item.dateTime).valueOf(), parseFloat(parseFloat(item.value.restingHeartRate).toFixed(1))])
      } else {
        arr.push([new Date(item.dateTime).valueOf(), parseFloat(parseFloat(item.value).toFixed(1))])
      }
    })

    return arr;
  }


  transferSleepData(data) {
    var arr = [];

    data["sleep"].forEach(item => {
      arr.push([new Date(item.dateOfSleep).valueOf(), parseFloat((parseInt(item.duration) / (1000 * 60 * 60)).toFixed(1))]);
    });
    return arr;
  }

  generateFitbitWeightChart() {
    this.auth.getFitbitFixedRangeOfData(this.start, "1m", "weight").subscribe(res => {
      console.log(res)
      var arr = [];
      res.weight.forEach(item => {
        arr.push([new Date(item.date).valueOf(), parseFloat(parseFloat(item.weight).toFixed(1))])
      })
      this.formateWeightChart(arr);


    })
  }

  formateWeightChart(arr){
    this.weightChart = new Chart({
      chart: {
        style: {
          fontFamily: "",
          fontSize: '12px',
          fontWeight: 'bold',
          color: '#006cee'
        },
        type: 'line',
        zoomType: 'xy',
      },

      title: {
        text: 'Weight Logs'
      },
      xAxis: {
        type: 'datetime',
        dateTimeLabelFormats: { // don't display the dummy year
          day: '%e/%b',
          month: '%b %y',
          year: '%Y'
        },
        title: {
          text: "date"
        },
      },
      yAxis: {
        title: {
          text: "kg"
        },
        labels: {
          formatter: function () {
            return this.value;
          },
        },

      },
      series: [
        {
          name: "Weight log",
          data: arr
        },

      ],
      plotOptions: {
        series: {
          dataLabels: {
            enabled: true,
            format: '{point.y}'
          }
        }
      },
      credits: {
        enabled: false
      },

      legend: {
        enabled: false
      },

    });

  }


  generateChart(type: string, unite: string) {


    if (this.provider === 'jawbone') {
      var temp;
      if (type === 'steps' || 'calories' || 'distance') {
         temp= "moves"
      }
      if(type==='sleep'){
        temp ='sleeps';
      }
      var transferStart = this.start;
      var transferEnd = this.end;
      transferStart = new Date(transferStart.replace(/-/g, '/')).getTime() / 1000;
      transferEnd = (new Date(transferEnd.replace(/-/g, '/')).getTime() + 1000 * 60 * 60 * 24  ) / 1000;
      this.auth.getJawboneFixedRangeOfData(transferStart, transferEnd, temp).subscribe(res => {

        console.log(res);
        var arr = [];
        switch (type) {
          case 'steps':
            res.forEach(item => {
              var str = this.transferJawboneDateString(item);
              arr.push([new Date(str).valueOf(),item.details.steps]);
            })
            break;
          case 'calories':
              res.forEach(item => {
                var str = this.transferJawboneDateString(item);
                arr.push([new Date(str).valueOf(),parseInt(item.details.wo_calories+item.details.bg_calories+item.details.bmr_day)]);
              })

            break;
          case 'distance':
              res.forEach(item => {
                var str = this.transferJawboneDateString(item);
                arr.push([new Date(str).valueOf(),parseFloat(item.details.km.toFixed(1))]);
              })

            break;
          case 'sleep':
            res.forEach(item => {
              var str = this.transferJawboneDateString(item);
              arr.push([new Date(str).valueOf(),parseFloat((item.details.duration/3600).toFixed(1))]);
            })

            break;

        }
        this.data = arr;

        console.log(arr);
        this.formatChar(unite,type,arr);
      });
    } else if (this.provider === 'fitbit') {
      this.auth.getFitbitFixedRangeOfData(this.start, this.end, type).subscribe(res => {

        if (type === 'sleep') {
          this.data = this.transferSleepData(res);
        } else {
          this.data = this.transferResDataDateFormate(res, type);
        }

        console.log(this.data);
      this.formatChar(unite,type,this.data);

      });
    }




  }


  transferJawboneDateString(item){
    var dateArr = (item.date+'').split('');
    var str='';
    for(var i =0; i<dateArr.length;i++){
      str+= dateArr[i];
      if(i==3){
        str+='-';
      }
      if(i==5){
        str+='-';
      }

    }
    return str;
  }


  formatChar(unite,type,data){

    this.decoraterOfChart.unite = unite;
    this.decoraterOfChart.type = type;
    this.chart = new Chart({
      chart: {
        style: {
          fontFamily: "",
          fontSize: '12px',
          fontWeight: 'bold',
          color: '#006cee'
        },
        type: 'column',
      },

      title: {
        text: ""
      },
      xAxis: {
        type: 'datetime',
        dateTimeLabelFormats: { // don't display the dummy year
          day: '%e/%b',
          month: '%b %y',
          year: '%Y'
        },
        title: {
          text: "date"
        },
      },
      yAxis: {
        title: {
          text: unite
        },
        labels: {
          formatter: function () {
            return this.value;
          },
        },

      },
      series: [
        {
          name: type,
          data: data
        },

      ],

      plotOptions: {
        series: {
          dataLabels: {
            enabled: true,
            format: '{point.y}'
          }
        }
      },


      credits: {
        enabled: false
      },
      legend: {
        enabled: false
      },

    });
  }
}
