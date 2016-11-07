import { Component, OnInit } from '@angular/core';
declare var firebase: any;
declare var $: any;

@Component({
  selector: 'b10-header',
  templateUrl: './b10-header.component.html',
  styleUrls: ['./b10-header.component.css']
})
export class B10HeaderComponent implements OnInit {

  firebase: any;

  static paint(color){
    $("#header-color-panel").css("background-color", color);
    $("#header-container").css("color", color);
  }

  logout(){
    firebase.auth().signOut().then(
      () => {
        firebase.User = null;
      }
    )
  }

  constructor() { }

  ngOnInit(){
    this.firebase = firebase;
    B10HeaderComponent.paint("#555555");
  }

}
