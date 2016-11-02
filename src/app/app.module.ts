import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import {RouterModule} from "@angular/router";
import { B10HomeComponent } from './b10-home/b10-home.component';
import { B10SearchComponent } from './b10-search/b10-search.component';
import { B10HeaderComponent } from './b10-header/b10-header.component';

@NgModule({
  declarations: [
    AppComponent,
    B10HomeComponent,
    B10SearchComponent,
    B10HeaderComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    // RouterModule.forRoot([
    //   {
    //     path: '',
    //     redirectTo: '/home',
    //     pathMatch: 'full'
    //   },
    //   { path: 'home', component: },
    //   {}
    // ])
  ],
  providers: [
    /*service classes*/
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
