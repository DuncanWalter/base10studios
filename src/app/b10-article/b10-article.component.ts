import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {B10ArticlesService} from "../b10-articles.service";


@Component({
  selector: 'app-b10-article',
  templateUrl: './b10-article.component.html',
  styleUrls: ['./b10-article.component.css']
})
export class B10ArticleComponent implements OnInit {

  title: string;
  content: string;

  constructor(private route: ActivatedRoute, private articlesService: B10ArticlesService){

  }

  ngOnInit(){

    this.articlesService.getArticle(this.route.snapshot.params['article'],
      (article) => this.articlesService.fillArticle(article,
        (article) => {
          this.title = article.title;
          this.content = article.content;
        }
      )
    );
  }

}
