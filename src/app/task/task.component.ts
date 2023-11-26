import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DATA_TABLE } from '../../datatable';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [CommonModule, NgbModule, FormsModule, ReactiveFormsModule],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss'
})
export class TaskComponent {
  userData = DATA_TABLE;
  filteredUsers!: any[];
  filter = new FormControl('', { nonNullable: true });
  constructor() { }


  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.filteredUsers = this.userData
  }
  /**
   * Filters users with given string
   */
  filterUsers() {
    if (this.filter.value && this.filter.value.trim().length > 0) {
      this.filteredUsers = this.userData.filter((el: any) => (el.name as string).toLocaleLowerCase().includes(this.filter.value.toLocaleLowerCase()))

    }
    else {
      this.filteredUsers = this.userData
    }


  }

}
