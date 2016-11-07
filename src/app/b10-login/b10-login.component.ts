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
        this.statusColor = "#08a719";
        B10HeaderComponent.paint("#08a719");
        this.status = "Welcome back, friend";
        firebase.User = firebase.User || "oneOneBlueHumanCreatureToken";
      },
      (error) => {
        this.statusColor = "#fa1256";
        B10HeaderComponent.paint("#fa1256");
        this.status = "Please double check your credentials; we didn't find anything";
      }
    );
  }

  signUp(){

    firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then(
      () => {
        this.statusColor = "#08a719";
        B10HeaderComponent.paint("#08a719");
        this.status = "Welcome to the fold, friend";
      },
      () => {
        this.statusColor = "#fa1256";
        B10HeaderComponent.paint("#fa1256");
        this.status = "We're not saying we don't want you, but...";
      }
    );
  }

  ngOnInit() {

    this.email = "";
    this.password = "";

    B10HeaderComponent.paint("#555555");

    this.status = "We send no emails; Rest easy";
    this.statusColor = "#a9a9a9";

  }

}
