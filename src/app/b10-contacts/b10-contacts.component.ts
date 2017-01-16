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

  }

}
