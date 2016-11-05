import { Component, OnInit } from '@angular/core';
import { B10ArticlesService } from "../b10-articles.service";

@Component({
  selector: 'app-b10-home',
  templateUrl: './b10-home.component.html',
  styleUrls: ['./b10-home.component.css']
})
export class B10HomeComponent implements OnInit {

  articles = [];

  constructor(private articlesService: B10ArticlesService){}

  ngOnInit() {
    this.articlesService.getArticles((article) => {
      console.dir(article);
      this.articles.push(article);
    });
  }

}
