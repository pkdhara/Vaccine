import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  today;
  todaySession = [];
  tommorrow;
  tommorrowSession = [];
  dayAfterTommorrow;
  dayAfterSession = [];
  tone = new Audio();
  noOfReq: number;
  reqFailed: number;
  pin = "";
  error = "";
  result = null;
  age = "18";
  constructor(private http: HttpClient) {
    this.today = moment().format('DD-MM-YYYY');
    this.tommorrow = moment().add(1, 'days').format('DD-MM-YYYY');
    this.dayAfterTommorrow = moment().add(2, 'days').format('DD-MM-YYYY');
    this.tone.src = "../assets/tone.wav";
    this.noOfReq = 0;
    this.reqFailed = 0;
  }
  ngOnInit(): void {
    this.getStatus();
    setInterval(() => {
      this.getStatus();
    }, 3000);
  }
  title = 'Vaccine';

  getStatus() {
    if (this.pin.length == 6) {
      this.error = "";
      this.noOfReq++;
      this.http.get(`https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode=${this.pin}&date=${this.today}`)
        .subscribe(res => {
          this.result = [];
          if (res['centers'] && res['centers'].length > 0) {
            res['centers'].forEach(element => {
              let name = element['name'];
              let address = element['address'];
              let dist = element['district_name'];
              let todaySession = [0, 0];
              let tommorrowSession = [0, 0];
              let dayAfterSession = [0, 0];
              if (element['sessions'] && element['sessions'].length > 0) {
                element['sessions'].forEach(e => {
                  if (e['date'] === this.today) {
                    if (e['min_age_limit'] == 18 && (this.age == '18' || this.age == '-1')) {
                      todaySession[0] = e['available_capacity'];
                      // if (e['available_capacity'] && e['available_capacity'] > 0) {
                      //   this.playSound();
                      // }
                    }
                    if (e['min_age_limit'] == 45 && (this.age == '45' || this.age == '-1')) {
                      todaySession[1] = e['available_capacity'];
                      // if (e['available_capacity'] && e['available_capacity'] > 0) {
                      //   this.playSound();
                      // }
                    }
                  }
                  if (e['date'] === this.tommorrow) {
                    if (e['min_age_limit'] == 18 && (this.age == '18' || this.age == '-1')) {
                      tommorrowSession[0] = e['available_capacity'];
                      if (e['available_capacity'] && e['available_capacity'] > 0) {
                        this.playSound();
                      }
                    }
                    if (e['min_age_limit'] == 45 && (this.age == '45' || this.age == '-1')) {
                      tommorrowSession[1] = e['available_capacity'];
                      if (e['available_capacity'] && e['available_capacity'] > 0) {
                        this.playSound();
                      }
                    }
                    
                  }
                  if (e['date'] === this.dayAfterTommorrow) {
                    if (e['min_age_limit'] == 18 && (this.age == '18' || this.age == '-1')) {
                      dayAfterSession[0] = e['available_capacity'];
                      if (e['available_capacity'] && e['available_capacity'] > 0) {
                        this.playSound();
                      }
                    }
                    if (e['min_age_limit'] == 45 && (this.age == '45' || this.age == '-1')) {
                      dayAfterSession[1] = e['available_capacity'];
                      if (e['available_capacity'] && e['available_capacity'] > 0) {
                        this.playSound();
                      }
                    }
                    
                  }
                });
              }
              this.result.push({
                name: name,
                address: address,
                dist: dist,
                todaySession: todaySession,
                tommorrowSession: tommorrowSession,
                dayAfterSession: dayAfterSession
              });
            });
          }
        }, err => {
          console.log(err);
          this.reqFailed++;
          this.error = err.error.error;
        });
    }
  }

  playSound() {
    this.tone.load();
    this.tone.play();
  }
}
