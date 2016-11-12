import { Component, OnInit } from '@angular/core';
import {AppComponent} from "../app.component";

@Component({
  selector: 'app-b10-engine',
  templateUrl: './b10-engine.component.html',
  styleUrls: ['./b10-engine.component.css']
})
export class B10EngineComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    AppComponent.paint('#3333a9');
    AppComponent.background('/assets/cartographer.png');
  }

}
