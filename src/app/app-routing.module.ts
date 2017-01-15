import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {B10EngineComponent} from "./b10-engine/b10-engine.component";
import {B10ArticleComponent} from "./b10-article/b10-article.component";
import {B10ArticlePanelsComponent} from "./b10-article-panels/b10-article-panels.component";
import {B10HeaderComponent} from "./b10-header/b10-header.component";
import {B10ArticleUploadComponent} from "./b10-article-upload/b10-article-upload.component";
import {B10ContactsComponent} from "./b10-contacts/b10-contacts.component";
import {B10LoginComponent} from "./b10-login/b10-login.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home/articles',
    pathMatch: 'full'
  },
  {
    path: 'engine',
    component: B10EngineComponent
  },
  {
    path: 'home',
    component: B10HeaderComponent,
    children: [
      {
        path: 'articles',
        component: B10ArticlePanelsComponent,
        children: [
          {
            path: ':article',
            component: B10ArticleComponent
          }
        ]
      },
      {
        path:'upload',
        component: B10ArticleUploadComponent
      },
      {
        path: 'contacts',
        component: B10ContactsComponent
      },
      {
        path:'login',
        component: B10LoginComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class Base10StudiosRoutingModule { }
