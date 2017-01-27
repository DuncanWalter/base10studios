import { Component, OnInit, OnDestroy } from '@angular/core';
import {AppComponent} from "../app.component";
import {Router} from "@angular/router";
declare const firebase: any;
declare const $: any;

@Component({
  selector: 'b10-header',
  templateUrl: './b10-header.component.html',
  styleUrls: ['./b10-header.component.css']
})
export class B10HeaderComponent implements OnInit, OnDestroy {

  interval;
  firebase: any;

  navigate = AppComponent.navigate;

  static paint(color){
    $(".paint").css("background-color", color);
    $(".paint-text").css("color", color);
  }

  logout(){
    firebase.auth().signOut().then(

    ).catch(

    )
  }

  constructor(public router: Router) { }

  ngOnInit(){

    let createMobileSpacer = () => {
      if(AppComponent.isMobileDevice()){
        $('#mobile-spacer-1').css('height', $('#mobile-header').css('height'));
        $('#mobile-spacer-2').css('height', $('#mobile-footer').css('height'));
      }
    };

    this.interval = setInterval(createMobileSpacer, 30);
    this.firebase = firebase;
    AppComponent.paint("#4e4e4e");

    let bgs = ['shattered-dark'];

    AppComponent.background('/assets/'+bgs[Math.floor(Math.random()*bgs.length)]+'.png');
  }

  ngOnDestroy(){
    removeEventListener(this.interval);
  }

}
