import { Component } from '@angular/core';
import { environment } from 'src/environments/environment.localhost';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'collabox-angular';


  constructor () {

    console.log();
    console.log(environment.firebaseConfig)
  }

}
