import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  static isMobileDevice() {
    return screen.availWidth <= 600;
  }
  static isTabletDevice() {
    return (screen.availWidth >600 && screen.availWidth <= 992);
  }
  static isDesktopDevice() {
    return screen.availWidth > 992;
  }

}
