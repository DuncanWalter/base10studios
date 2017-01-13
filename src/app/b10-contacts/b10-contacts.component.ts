import { Component, OnInit } from '@angular/core';
import {B10HeaderComponent} from "../b10-header/b10-header.component";
declare const $ : any;

@Component({
  selector: 'app-b10-contacts',
  templateUrl: './b10-contacts.component.html',
  styleUrls: ['./b10-contacts.component.css']
})
export class B10ContactsComponent implements OnInit {

  constructor() { }

  ngOnInit(){
    B10HeaderComponent.paint("#4e4e4e");

    let e = $("#eli");
    let d = $("#duncan");

    // e.css("height", d.css("height"));

  }

  // focus(element){
  //   console.dir(element);

  //   if(element == "duncan"){
  //     d.css("animation", "grow 2.5s");
  //     d.css("width", "65%");
  //     e.css("animation", "shrink 2.5s");
  //     e.css("width", "35%");
  //   } else {
  //     e.css("animation", "grow 2.5s");
  //     e.css("width", "65%");
  //     d.css("animation", "shrink 2.5s");
  //     d.css("width", "35%");
  //   }
  // }

}
