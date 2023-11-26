import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DATA_TABLE } from '../datatable';
// import * from '../../src/datatable'
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NgbModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Illinois data center';

  constructor(private router: Router) {
    this.router.navigateByUrl('users')
  }

  /**
   * Navigate to given path
   * @param path nagivation url
   */
  goToPath(path: string) {
    this.router.navigateByUrl(path)
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class. 
  }
}
