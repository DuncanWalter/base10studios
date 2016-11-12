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

    let rgb = {r:null, g:null, b:null};
    let h = Math.round(HSVColor.h);
    let s = Math.round(HSVColor.s * 255 / 100);
    let v = Math.round(HSVColor.v * 255 / 100);

    if (s == 0) {

      rgb.r = rgb.g = rgb.b = v;

    } else {

      let t1 = v;
      let t2 = (255 - s) * v / 255;
      let t3 = (t1 - t2) * (h % 60) / 60;

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

  changeHue(){
    let sat = this.saturation;
    let color = {h: this.hue, s: 10 * sat / 100, v: 99 / 400 * (parseInt(sat) + 300)};
    this.bgColorLight = B10ArticleUploadComponent.toRGBColor(color);
    color.s = 25 * (sat / 100);
    color.v = 98 / 300 * (parseInt(sat) + 200);
    this.bgColorMed   = B10ArticleUploadComponent.toRGBColor(color);
    color.s = 42 * (sat / 100);
    color.v = 98 / 200 * (parseInt(sat) + 100);
    this.bgColorDark  = B10ArticleUploadComponent.toRGBColor(color);
    color.s = 92 * (parseInt(sat) / 100);
    color.v = 63 / 175 * (parseInt(sat) + 75 );
    this.color        = B10ArticleUploadComponent.toRGBColor(color);

    B10HeaderComponent.paint(this.color);
    $('.thumb').css('background-color', this.color);
    $('.value').css('color', this.bgColorDark);
  }

  ngOnInit(){
    let h = $('#upload-panel').css('height');
    this.height = parseFloat(h.substring(0, h.length - 2));
    this.hue = 180;
    this.saturation = 100;
    this.changeHue();

    this.interval = setInterval(() => {
      this.changeHue();
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

    if(firebase.auth().currentUser == null){console.log('no auth'); return false;}
    if(this.articles.files[0] == null){console.log('no article'); return false;}
    if(this.images.files[0]   == null){console.log('no image');   return false;}
    if(this.title             == null){console.log('no title'); return false;}

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

    firebase.storage().ref().child('/articles/' + key + '.html').put(this.articles.files[0]);

    firebase.storage().ref().child('/images/'   + key + '.png' ).put(this.images.files[0]);

  }

}
