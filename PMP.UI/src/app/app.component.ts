import { Component,OnInit } from '@angular/core';
import { TaskModel } from './models/task.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'PMUI';
  activeTab: string = "project-tab";
  emittedTask: TaskModel;
  needTasksReload: boolean = false;
  needProjectsReload: boolean = false;

  ngOnInit(){

  }

  onTabChange($event) {
    this.activeTab = $event.target.id;
  }

  openTaskTab(event:TaskModel) {
    this.activeTab = "task-tab";
    this.emittedTask = event;
  }
  
  onReloadProjects($event) {
    this.needProjectsReload = $event;
  }

  onReloadTasks($event) {
    this.activeTab = "viewtask-tab";
    this.needTasksReload = $event;
  }
}
