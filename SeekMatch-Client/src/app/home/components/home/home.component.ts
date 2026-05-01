import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  tags: string[] = ['Home.Tags.New', 'Home.Tags.Old', 'Home.Tags.Test'];

}
