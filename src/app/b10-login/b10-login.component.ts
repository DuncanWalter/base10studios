import { Component, OnInit } from '@angular/core';
import {B10HeaderComponent} from "../b10-header/b10-header.component";
declare var firebase: any;

@Component({
  selector: 'app-b10-login',
  templateUrl: './b10-login.component.html',
  styleUrls: ['./b10-login.component.css']
})
export class B10LoginComponent implements OnInit {

  status: string;
  statusColor: string;

  email: string;
  password: string;

  constructor(){

  }

  login(){

    firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(
      () => {
        this.statusColor = "#12fa56";
        B10HeaderComponent.paint("#12fa56");
        this.status = "AND THERE WAS MUCH REJOICING!!!";
      },
      () => {
        this.statusColor = "#fa1256";
        B10HeaderComponent.paint("#fa1256");
        this.status = "Perhaps a different wand?";
      }
    );
  }

  signUp(){

    firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then(
      () => {
        this.statusColor = "#12fa56";
        B10HeaderComponent.paint("#12fa56");
        this.status = "AND THERE WAS MUCH REJOICING!!!";
      },
      () => {
        this.statusColor = "#fa1256";
        B10HeaderComponent.paint("#fa1256");
        this.status = "Perhaps a different wand?";
      }
    );
  }

  ngOnInit() {

    this.email = "";
    this.password = "";

    B10HeaderComponent.paint("#555555");

    this.status = "We send no emails. Rest easy.";
    this.statusColor = "#a9a9a9";

  }

}
