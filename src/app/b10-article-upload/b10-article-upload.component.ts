import { Component, OnInit, OnDestroy } from '@angular/core';
import {B10HeaderComponent} from "../b10-header/b10-header.component";
declare var firebase: any;
declare var $: any;

@Component({
  selector: 'app-b10-article-upload',
  templateUrl: './b10-article-upload.component.html',
  styleUrls: ['./b10-article-upload.component.css']
})
export class B10ArticleUploadComponent implements OnInit, OnDestroy {

  // used to manage the page styles
  status;
  height;
  interval;
  hue;
  saturation;

  // article data
  title;
  articles;
  images;
  bgColorLight;
  bgColorMed;
  bgColorDark;
  color;

  constructor() { }

  static toRGBColor(HSVColor): string {

    var rgb = {r:null, g:null, b:null};
    var h = Math.round(HSVColor.h);
    var s = Math.round(HSVColor.s * 255 / 100);
    var v = Math.round(HSVColor.v * 255 / 100);

    if (s == 0) {

      rgb.r = rgb.g = rgb.b = v;

    } else {

      var t1 = v;
      var t2 = (255 - s) * v / 255;
      var t3 = (t1 - t2) * (h % 60) / 60;

      if (h == 360) h = 0;

           if (h < 60 ) { rgb.r = t1; rgb.b = t2; rgb.g = t2 + t3 }
      else if (h < 120) { rgb.g = t1; rgb.b = t2; rgb.r = t1 - t3 }
      else if (h < 180) { rgb.g = t1; rgb.r = t2; rgb.b = t2 + t3 }
      else if (h < 240) { rgb.b = t1; rgb.r = t2; rgb.g = t1 - t3 }
      else if (h < 300) { rgb.b = t1; rgb.g = t2; rgb.r = t2 + t3 }
      else if (h < 360) { rgb.r = t1; rgb.g = t2; rgb.b = t1 - t3 }
      else              { rgb.r = 0 ; rgb.g = 0 ; rgb.b = 0       }

    }

    return "rgba("+Math.round(rgb.r)+","+Math.round(rgb.g)+","+Math.round(rgb.b)+",1)";

  };

  changeHue(hue){
    this.hue = hue || this.hue;
    let color = {h: hue, s: 10 * this.saturation / 100, v: 99};
    this.bgColorLight = B10ArticleUploadComponent.toRGBColor(color);
    color.s = 25 * this.saturation / 100; color.v = 98;
    this.bgColorMed   = B10ArticleUploadComponent.toRGBColor(color);
    color.s = 42 * this.saturation / 100; color.v = 98;
    this.bgColorDark  = B10ArticleUploadComponent.toRGBColor(color);
    color.s = 92 * this.saturation / 100; color.v = 63;
    this.color        = B10ArticleUploadComponent.toRGBColor(color);
    B10HeaderComponent.paint(this.color);
    $('.thumb').css('background-color', this.color);
    $('.value').css('color', this.bgColorDark);
  }

  ngOnInit(){
    let h = $('#upload-panel').css('height');
    this.height = parseFloat(h.substring(0, h.length - 2));
    this.hue = 180;
    this.changeHue(this.hue);

    this.interval = setInterval(() => {
      this.changeHue(this.hue);
    }, 30);
  }

  ngOnDestroy(){
    clearInterval(this.interval);
  }

  uploadArticle(){

    let report = (message, color) => {
      this.status = message;
      B10HeaderComponent.paint(color);
    };

    this.articles = $('#upload-file-art')[0];
    this.images = $('#upload-file-img')[0];

    if(this.articles.files[0] == null){console.log('no article'); return false}
    if(this.images.files[0]   == null){console.log('no image');   return false}
    if(this.title             == null){console.log('no title'); return false}

    let key = firebase.database().ref('articles').push(
      {
        bgColorLight: this.bgColorLight,
        bgColorMed: this.bgColorMed,
        bgColorDark: this.bgColorDark,
        color: this.color,
        title: this.title,
        type: 'Rambling'
      },
      () => {
        firebase.database().ref('articles/' + key + '/article').set('/articles/' + key + ".html");
        firebase.database().ref('articles/' + key + '/image'  ).set('/images/'   + key + ".png" );
      }
    ).key;

    firebase.storage().ref().child('/articles/' + key + '.html').put(this.articles.files[0]).catch(
      (error) => {
        report(error, '#fa2435');
      }
    );

    firebase.storage().ref().child('/images/'   + key + '.png' ).put(this.images.files[0]).then(
      () => {}
    ).catch(
      (error) => {
        report(error, '#fa2435');
      }
    );

  }

}
