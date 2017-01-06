import { Injectable } from '@angular/core';
declare var firebase: any;

@Injectable()
export class B10ArticlesService {

  /*fetches a list of all article stubs*/ // TODO get this to fetch ranges by default and keep track of itself.
  getArticles(callback){
    return Promise.resolve(
      firebase.database().ref('/articles').once('value',
        (snapshot) => {
          snapshot.forEach(
            (article) => {
              let art = article.val();
              art.key = article.key;
              callback(art);
            }
          );
        }
      )
    );
  }
  /*fetches a single article stub*/
  getArticle(article, callback){
    firebase.database().ref('/articles/' + article).once('value',
      (article) => {
        let art = article.val();
        if(!art.key){
          art.key = article.key;
        }
        if(callback == null){
          console.dir(art);
        } else {
          callback(art);
        }
      }
    );
  }

}
