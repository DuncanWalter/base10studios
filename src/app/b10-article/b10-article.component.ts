import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {B10ArticlesService} from "../b10-articles.service";
import {B10HeaderComponent} from "../b10-header/b10-header.component";
import Timer = NodeJS.Timer;
declare var firebase: any;
declare var $: any;


@Component({
  selector: 'app-b10-article',
  templateUrl: './b10-article.component.html',
  styleUrls: ['./b10-article.component.css']
})
export class B10ArticleComponent implements OnInit {

  title: string;
  bgLight: string;
  bgMed: string;
  bgDark: string;
  color: string;
  image: string;
  interval: Timer;

  constructor(private route: ActivatedRoute, private articlesService: B10ArticlesService){

  }

  displayArticle(key){

    this.articlesService.getArticle(key,
      (article) => {
        this.bgLight = article.bgColorLight;
        this.bgMed   = article.bgColorMed;
        this.bgDark  = article.bgColorDark;
        this.color   = article.color;
        B10HeaderComponent.paint(this.color);
        this.title = article.title;
      }
    );

    firebase.storage().ref().child('articles/' + key + '.html').getDownloadURL().then(
      (url) => {
        $("#content").load(url);
      }
    ).catch(
      (error) => {
        console.dir(error);
      }
    );

    firebase.storage().ref().child('images/' + key + '.png').getDownloadURL().then(
      (url) => {
        $("#image").attr("src", url);
      }
    ).catch(
      (error) => {
        console.dir(error);
      }
    );

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
