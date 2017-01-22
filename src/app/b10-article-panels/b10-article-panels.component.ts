import { Component, OnInit, OnDestroy } from '@angular/core';
import {B10ArticlesService} from "../b10-articles.service";
import {B10HeaderComponent} from "../b10-header/b10-header.component";
import {AppComponent} from "../app.component";
declare const firebase: any;
declare const $: any;

@Component({
  selector: 'app-b10-article-panels',
  templateUrl: './b10-article-panels.component.html',
  styleUrls: ['./b10-article-panels.component.css']
})
export class B10ArticlePanelsComponent implements OnInit {

  articleTree;
  articles;

  ngOnInit(){

    B10HeaderComponent.paint("#4e4e4e");
    this.articles = [];

    this.articleTree = (()=>{
      if(AppComponent.isDesktopDevice()){
        return [['gloo','base10'],['computer-science','calculus','javascript']];
      }
      if(AppComponent.isTabletDevice()){
        return [['gloo','base10'],['computer-science'],['calculus','javascript']];
      }
      if(AppComponent.isMobileDevice()){
        return [['gloo'],['base10'],['computer-science'],['calculus'],['javascript']];
      }
    })();

    let index = 0;
    this.articleTree.forEach((row)=>{
      let delay = index * 160;
      this.articles.push([]);
      row.forEach((article)=>{
        let d = (()=>{return index})();
        setTimeout(()=>{this.articles[d].push(article)},delay);
        delay += 160;
      });
      index++;
    });

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
