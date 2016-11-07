import { Component, OnInit, OnDestroy } from '@angular/core';
import {B10ArticlesService} from "../b10-articles.service";
import {B10HeaderComponent} from "../b10-header/b10-header.component";
import {AppComponent} from "../app.component";

@Component({
  selector: 'app-b10-article-panels',
  templateUrl: './b10-article-panels.component.html',
  styleUrls: ['./b10-article-panels.component.css']
})
export class B10ArticlePanelsComponent implements OnInit, OnDestroy {

  rowCount = 0;
  articles = [];
  layout = [];

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
    if(n != this.rowCount){
      this.layout = [];
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
        }
      )
    }
  });

  constructor(private articlesService: B10ArticlesService){}

  ngOnInit(){

    B10HeaderComponent.paint("#555555");

    // TODO should probably close this up at some point?
    window.addEventListener("resize",
      this.packArticles
    );

    this.articlesService.getArticles((article) => {
      this.articles.push(article);
    }).then(
      this.packArticles
    );

  }

  ngOnDestroy(){

    window.removeEventListener("resize");

  }

}
