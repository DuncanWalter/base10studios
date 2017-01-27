import { Component, OnInit, OnDestroy } from '@angular/core';
import {B10HeaderComponent} from "../b10-header/b10-header.component";
import {AppComponent} from "../app.component";
declare const firebase: any;
declare const $: any;

let computerScience : any = {}; //'ComSci';
computerScience.title = 'Computer Science';
computerScience.path = 'ComSci';
computerScience.type = 'Rambling';
computerScience.color = "rgba(44,36,143,1)";
computerScience.bgColorLight = "rgba(222,220,240,1)";
computerScience.bgColorDark = "rgba(154,149,226,1)";
computerScience.bgColorMed = "rgba(189,186,234,1)";

let glooKit : any = {}; //'GlooKit';
glooKit.title = 'Gloo Kit';
glooKit.path = 'GlooKit';
glooKit.type = 'Project';
glooKit.color = "rgba(148,76,31,1)";
glooKit.bgColorLight = "rgba(244,231,223,1)";
glooKit.bgColorDark = "rgba(232,180,148,1)";
glooKit.bgColorMed = "rgba(238,206,187,1)";

let javaScript : any = {}; //'JavaScript';
javaScript.title = 'In Praise of JavaScript';
javaScript.path = 'JavaScript';
javaScript.type = 'Rambling';
javaScript.color = "rgba(13,87,161,1)";
javaScript.bgColorLight = "rgba(226,239,252,1)";
javaScript.bgColorDark = "rgba(145,198,250,1)";
javaScript.bgColorMed = "rgba(187,219,250,1)";

let base10 : any = {}; //'Base10';
base10.title = 'Base 10 Studios';
base10.path = 'Base10';
base10.type = 'About';
base10.color = "rgba(13,87,161,1)";
base10.bgColorLight = "rgba(226,239,252,1)";
base10.bgColorDark = "rgba(145,198,250,1)";
base10.bgColorMed = "rgba(187,219,250,1)";

let calculus : any = {}; //'Calculus';
calculus.title = 'In Fear of Calculus';
calculus.path = 'Calculus';
calculus.type = 'Rambling';
calculus.color = "rgba(83,83,83,1)";
calculus.bgColorLight = "rgba(239,239,239,1)";
calculus.bgColorDark = "rgba(196,196,196,1)";
calculus.bgColorMed = "rgba(215,215,215,1)";

export let articleTree = (()=>{
  if(AppComponent.isDesktopDevice()){
    return [[glooKit, base10],[computerScience,calculus, javaScript]];
  }
  if(AppComponent.isTabletDevice()){
    return [[glooKit, base10],[computerScience],[calculus, javaScript]];
  }
  if(AppComponent.isMobileDevice()){
    return [[glooKit],[ base10],[computerScience],[calculus], [javaScript]];
  }
})();

@Component({
  selector: 'app-b10-article-panels',
  templateUrl: './b10-article-panels.component.html',
  styleUrls: ['./b10-article-panels.component.css']
})
export class B10ArticlePanelsComponent implements OnInit {


  articles;

  ngOnInit(){

    B10HeaderComponent.paint("#4e4e4e");
    this.articles = articleTree;

    // let index = 0;
    // articleTree.forEach((row)=>{
    //   let delay = index * 160;
    //   this.articles.push([]);
    //   row.forEach((article)=>{
    //     let d = (()=>{return index})();
    //     setTimeout(()=>{this.articles[d].push(article)},delay);
    //     delay += 160;
    //   });
    //   index++;
    // });

  }



}
// interval;
// rowCount = 0;
// articles = [];
// layout = [];
// tracked = 0;
//
// packArticles = (() => {
//   let n = this.rowCount;
//   if(AppComponent.isDesktopDevice()){
//     this.rowCount = 3;
//   }
//   if(AppComponent.isTabletDevice()){
//     this.rowCount = 2;
//   }
//   if(AppComponent.isMobileDevice()){
//     this.rowCount = 1;
//   }
//   if(n != this.rowCount || this.articles.length != this.tracked){
//     this.layout = [];
//     this.tracked = 0;
//     let i;
//     for(i = 0; i < this.rowCount; i++){
//       this.layout.push([]);
//     }
//     this.articles.forEach(
//       (article) => {
//         let trg = 0;
//         let min = null;
//         for(i = 0; i < this.layout.length; i++){
//           let h = this.layout[i].length;
//           min = ((min == null) || (h <= min)) ? h : min;
//           trg = ((min == null) || (h == min)) ? i : trg;
//         }
//         this.layout[trg].push(article);
//         this.tracked += 1;
//       }
//     )
//   }
// });
//


// constructor(private articlesService: B10ArticlesService){}
// ngOnDestroy(){
//
//   clearInterval(this.interval);
//
// }

// this.interval = setInterval(this.packArticles, 30);

// this.articlesService.getArticles((article) => {
//   this.articles.push(article);
//   firebase.storage().ref().child(article.image).getDownloadURL().then(
//     (url) => {
//       $('#' + article.key).attr("src", url);
//     }
//   ).catch(
//     (error) => {
//       console.log(error);
//     }
//   );
// }).then(
//   this.packArticles
// );
