import { Component, OnInit } from '@angular/core';
declare var $: any;

@Component({
  selector: 'b10-header',
  templateUrl: './b10-header.component.html',
  styleUrls: ['./b10-header.component.css']
})
export class B10HeaderComponent implements OnInit {

  static paint(color){
    $("#header-color-panel").css("background-color", color);
    $("#header-container").css("color", color);
  }

  constructor() { }

  ngOnInit() {
    B10HeaderComponent.paint("#555555");
  }

}
