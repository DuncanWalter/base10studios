import { Component } from '@angular/core';
import {Router} from "@angular/router";
declare const $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  cursor;

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
    let background = $(".background");
    background.css("background", "#000000 url("+src+")");
    background.css("position", "relative");
    background.css("transition", "0.2s");
    background.css("transition-timing-device", "linear");
  }
  static navigate(router: Router, path: string, scrollToTop?: boolean){
    $('.exitable').addClass('exit');
    if(scrollToTop != false){
      $("html, body").animate({ scrollTop: 0 }, "slow");
    }
    setTimeout(()=>{
      router.navigateByUrl(path).then(()=>{
        $('.exitable.exit').removeClass('exit');
      });
    }, 700);
  }

  ngOnInit(){

    this.cursor = {x:0,y:0};

    let c = this.cursor;

    $(document).mousemove((e)=>{
      c.x = e.pageX;
      c.y = e.pageY;
    });
    $(document).bind('mousewheel', (e)=>{
      c.x = e.pageX;
      c.y = e.pageY;
    });

    setInterval(()=>{
      let background = $(".background");
      background.css("left",   (-this.cursor.x / screen.availWidth  - 0.5) * 1.45 + "rem");
      background.css("right",  (+this.cursor.x / screen.availWidth  - 0.5) * 1.45 + "rem");
      background.css("top",    (-this.cursor.y / screen.availHeight - 0.5) * 1.81 + "rem");
      background.css("bottom", (+this.cursor.y / screen.availHeight - 0.5) * 1.81 + "rem");
    },30);

  }

}
