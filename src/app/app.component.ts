import { Component } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  static isMobileDevice() {
    return screen.availWidth <= 600;
  }
  static isTabletDevice() {
    return (screen.availWidth >600 && screen.availWidth <= 992);
  }
  static isDesktopDevice() {
    return screen.availWidth > 992;
  }

  static paint(color){
    $(".paint").css("background-color", color);
    $(".paint-text").css("color", color);
  }
  static background(src){
    $(".background").css("background", "#000000 url("+src+") fixed top center");
  }

}
