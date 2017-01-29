import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {B10ArticlesService} from "../b10-articles.service";
import {B10HeaderComponent} from "../b10-header/b10-header.component";
import Timer = NodeJS.Timer;
import {articleTree} from "../b10-article-panels/b10-article-panels.component";
import {AppComponent} from "../app.component";
declare var firebase: any;
declare var $: any;


@Component({
  selector: 'app-b10-article',
  templateUrl: './b10-article.component.html',
  styleUrls: ['./b10-article.component.css']
})
export class B10ArticleComponent implements OnInit {

  article: any;
  image: string;
  interval: Timer;

  navigate = AppComponent.navigate;

  constructor(private route: ActivatedRoute, private router: Router){}

  displayArticle(key){

    this.article = articleTree.filter((row)=>{
      return row.filter((article)=>{
        return article.path == key;
      }).length > 0;
    })[0].filter((article)=>{
      return article.path == key;
    })[0];

    B10HeaderComponent.paint(this.article.color);

    let content = $("#content");

    content.load('../../assets/articles/' + this.article.path + '/article.txt', ()=>{
      content.children("hr").css("margin-bottom","1.5rem").css("margin-top","1.5rem");
      content.children("p" ).css("margin-bottom","1.5rem").css("text-indent","2.5em");
    });

  }

  ngOnInit(){

    let key = this.route.snapshot.params['article'];

    this.displayArticle(key);

    this.interval = setInterval(()=>{
      if(this.route.snapshot.params['article'] != key){
        key = this.route.snapshot.params['article'];
        $("html, body").animate({ scrollTop: 0 }, "slow");
        this.displayArticle(key);
      }
    }, 30);

  }

  ngOnDestroy() {

    clearInterval(this.interval);

  }

}
