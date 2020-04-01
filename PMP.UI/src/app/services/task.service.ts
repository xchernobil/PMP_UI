import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TaskModel, TaskViewModel } from '../models/task.model';
import { environment } from 'src/environments/environment';
import { SortingAndFiltering } from '../models/filter.model';
import { ProjectModel } from '../models/project.model';
import { CodeValueModel } from '../models/codevalue.model';
import { BaseViewModel } from '../models/baseview.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private readonly http: HttpClient) { }

  saveTask(task: TaskModel){
    return this.http.post<BaseViewModel>(environment.API_BASE_URL + 'task/saveTask', task);
  }

  // deleteTask(id: string){
  //   return this.http.delete<number>(environment.API_BASE_URL + 'task/deleteTask/'+id);
  // }

  endTask(id: string){
    return this.http.delete<BaseViewModel>(environment.API_BASE_URL + 'task/endTask/'+id);
  }

  getTasks(pagesize:number,pageindex:number){
    return this.http.get<TaskViewModel>(environment.API_BASE_URL + 'task/getalltasks/'+pagesize+'/'+pageindex);
  }

  getProjectTasks(projectId: string){
    return this.http.get<TaskModel[]>(environment.API_BASE_URL + 'task/getprojecttasks/'+projectId);
  }
  
  getProjectTaskCount(projectIds: string[]){
    return this.http.post<ProjectModel[]>(environment.API_BASE_URL + 'task/gettaskscount',projectIds);
  }

  getFilteredTasks(fclause: SortingAndFiltering){
    return this.http.post<TaskViewModel>(environment.API_BASE_URL + 'task/filtertasks',fclause);
  }

  updateProjectName(postdata: CodeValueModel){
    return this.http.post<BaseViewModel>(environment.API_BASE_URL + 'task/updateprojectname', postdata);
  }

  updateUserName(postdata: CodeValueModel){
    return this.http.post<BaseViewModel>(environment.API_BASE_URL + 'task/updateusername', postdata);
  }
}
