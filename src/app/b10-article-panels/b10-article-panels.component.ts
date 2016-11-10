import { Component, OnInit, OnDestroy } from '@angular/core';
import {B10ArticlesService} from "../b10-articles.service";
import {B10HeaderComponent} from "../b10-header/b10-header.component";
import {AppComponent} from "../app.component";
declare var firebase: any;
declare var $: any;

@Component({
  selector: 'app-b10-article-panels',
  templateUrl: './b10-article-panels.component.html',
  styleUrls: ['./b10-article-panels.component.css']
})
export class B10ArticlePanelsComponent implements OnInit, OnDestroy {

  interval;
  rowCount = 0;
  articles = [];
  layout = [];
  tracked = 0;

  packArticles = (() => {
    let n = this.rowCount;
    if(AppComponent.isDesktopDevice()){
      this.rowCount = 3;
    }
    if(AppComponent.isTabletDevice()){
      this.rowCount = 2;
    }
    if(AppComponent.isMobileDevice()){
      this.rowCount = 1;
    }
    if(n != this.rowCount || this.articles.length != this.tracked){
      this.layout = [];
      this.tracked = 0;
      let i;
      for(i = 0; i < this.rowCount; i++){
        this.layout.push([]);
      }
      this.articles.forEach(
        (article) => {
          let trg = 0;
          let min = null;
          for(i = 0; i < this.layout.length; i++){
            let h = this.layout[i].length;
            min = ((min == null) || (h <= min)) ? h : min;
            trg = ((min == null) || (h == min)) ? i : trg;
          }
          this.layout[trg].push(article);
          this.tracked += 1;
        }
      )
    }
  });

  constructor(private articlesService: B10ArticlesService){}

  ngOnInit(){

    B10HeaderComponent.paint("#555555");

    this.interval = setInterval(this.packArticles, 30);

    this.articlesService.getArticles((article) => {
      this.articles.push(article);
      firebase.storage().ref().child(article.image).getDownloadURL().then(
        (url) => {
          $('#' + article.key).attr("src", url);
        }
      ).catch(
        (error) => {
          console.log(error);
        }
      );
    }).then(
      this.packArticles
    );

  }

  ngOnDestroy(){

    clearInterval(this.interval);

  }

}
