import { Component, OnInit } from '@angular/core';
import {B10ArticlesService} from "../b10-articles.service";
import {B10HeaderComponent} from "../b10-header/b10-header.component";

@Component({
  selector: 'app-b10-article-panels',
  templateUrl: './b10-article-panels.component.html',
  styleUrls: ['./b10-article-panels.component.css']
})
export class B10ArticlePanelsComponent implements OnInit {

  articles = [];

  constructor(private articlesService: B10ArticlesService){}

  ngOnInit(){
    B10HeaderComponent.paint("#555555");
    this.articlesService.getArticles((article) => {
      console.dir(article);
      this.articles.push(article);
    });
  }

}
