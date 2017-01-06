import { Component, OnInit } from '@angular/core';
import {AppComponent} from "../app.component";
declare var $: any;

@Component({
  selector: 'app-b10-engine',
  templateUrl: './b10-engine.component.html',
  styleUrls: ['./b10-engine.component.css']
})
export class B10EngineComponent implements OnInit {

  units;

  constructor() { }

  ngOnInit() {

    AppComponent.background('/assets/shattered-dark.png');
    AppComponent.paint('#2323f3');

    setInterval(()=>{
      $("#scroll-container::-webkit-scrollbar-thumb").css("background-color", "rgba(0, 0, 0, 0.26)");
      $("::-webkit-scrollbar-thumb").css("background-color", "rgba(0, 0, 0, 0.16)");
      $("::-webkit-scrollbar-track").css("background-color", "rgba(0, 0, 0, 0.16)");
      $("::-webkit-scrollbar").css("width", "73px");
    }, 32);

    this.units = [
      {NAM: "Lng", HPS: 10,  HRD: 4,  STR: 5,  AGI: 5, SKL: 5, DUR: null, DPS: null, RAT: null, TAC: null, GRP: null, SIZ: 0.7, SPD: 3.4, RNG: 0, DLY: 0.6},
      {NAM: "Rch", HPS: 40, HRD: 13, STR: 16,  AGI: 3, SKL: 3, DUR: null, DPS: null, RAT: null, TAC: null, GRP: null, SIZ: 0.9, SPD: 2.2, RNG: 3, DLY: 1.5},
      {NAM: "Hyd", HPS: 25, HRD: 5,  STR: 12,  AGI: 5, SKL: 6, DUR: null, DPS: null, RAT: null, TAC: null, GRP: null, SIZ: 1.1, SPD: 2.5, RNG: 6, DLY: 0.7},
      {NAM: "Ult", HPS: 170, HRD: 15, STR: 18, AGI: 2, SKL: 2, DUR: null, DPS: null, RAT: null, TAC: null, GRP: null, SIZ: 2.1, SPD: 3.1, RNG: 1, DLY: 0.9},
      {NAM: "Lng",  HPS: 7,  HRD: 2,  STR: 5,  AGI: 7, SKL: 5, DUR: null, DPS: null, RAT: null, TAC: null, GRP: null, SIZ: 0.7, SPD: 3.4, RNG: 0, DLY: 0.6},
      {NAM: "Rch",  HPS: 16, HRD: 10, STR: 7,  AGI: 3, SKL: 3, DUR: null, DPS: null, RAT: null, TAC: null, GRP: null, SIZ: 0.9, SPD: 2.2, RNG: 3, DLY: 1.5},
      {NAM: "Hyd",  HPS: 13, HRD: 3,  STR: 5,  AGI: 4, SKL: 6, DUR: null, DPS: null, RAT: null, TAC: null, GRP: null, SIZ: 1.1, SPD: 2.5, RNG: 6, DLY: 0.7},
      {NAM: "Ult",  HPS: 45, HRD: 15, STR: 17, AGI: 2, SKL: 2, DUR: null, DPS: null, RAT: null, TAC: null, GRP: null, SIZ: 2.1, SPD: 3.1, RNG: 1, DLY: 0.9},
      {NAM: "Lng",  HPS: 7,  HRD: 2,  STR: 5,  AGI: 7, SKL: 5, DUR: null, DPS: null, RAT: null, TAC: null, GRP: null, SIZ: 0.7, SPD: 3.4, RNG: 0, DLY: 0.6},
      {NAM: "Rch",  HPS: 16, HRD: 10, STR: 7,  AGI: 3, SKL: 3, DUR: null, DPS: null, RAT: null, TAC: null, GRP: null, SIZ: 0.9, SPD: 2.2, RNG: 3, DLY: 1.5},
      {NAM: "Hyd",  HPS: 13, HRD: 3,  STR: 5,  AGI: 4, SKL: 6, DUR: null, DPS: null, RAT: null, TAC: null, GRP: null, SIZ: 1.1, SPD: 2.5, RNG: 6, DLY: 0.7},
      {NAM: "Ult",  HPS: 45, HRD: 15, STR: 17, AGI: 2, SKL: 2, DUR: null, DPS: null, RAT: null, TAC: null, GRP: null, SIZ: 2.1, SPD: 3.1, RNG: 1, DLY: 0.9}
    ]

  }

}
