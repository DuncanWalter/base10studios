import { Component, OnInit, OnDestroy } from '@angular/core';
import {AppComponent} from "../app.component";
declare var firebase: any;
declare var $: any;

@Component({
  selector: 'b10-header',
  templateUrl: './b10-header.component.html',
  styleUrls: ['./b10-header.component.css']
})
export class B10HeaderComponent implements OnInit, OnDestroy {

  interval;
  firebase: any;

  static paint(color){
    $(".paint").css("background-color", color);
    $(".paint-text").css("color", color);
  }

  logout(){
    firebase.auth().signOut().then(
      // () => {
      //   firebase.User = null;
      // }
    ).catch(

    )
  }

  constructor() { }

  ngOnInit(){

    let createMobileSpacer = () => {
      if(AppComponent.isMobileDevice()){
        $('#mobile-spacer-1').css('height', $('#mobile-header').css('height'));
        $('#mobile-spacer-2').css('height', $('#mobile-footer').css('height'));
      }
    };

    this.interval = setInterval(createMobileSpacer, 30);
    this.firebase = firebase;
    AppComponent.paint("#555555");
    AppComponent.background('/assets/45-degree-fabric-light.png');
  }

  ngOnDestroy(){
    removeEventListener(this.interval);
  }

}
