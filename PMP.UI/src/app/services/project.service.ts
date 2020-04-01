import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProjectModel, ProjectViewModel } from '../models/project.model';
import { environment } from 'src/environments/environment';
import { SortingAndFiltering } from '../models/filter.model';
import { TaskCountModel } from '../models/task.model';
import { BaseViewModel } from '../models/baseview.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private readonly http: HttpClient) { }

  saveProject(project: ProjectModel){
    return this.http.post<BaseViewModel>(environment.API_BASE_URL + 'project/saveProject', project);
  }

  deleteProject(id: string){
    return this.http.delete<BaseViewModel>(environment.API_BASE_URL + 'project/deleteProject/'+id);
  }

  updateProject(id: string){
    return this.http.post<BaseViewModel>(environment.API_BASE_URL + 'project/updateProject',id);
  }

  suspendProject(id: string){
    return this.http.delete<BaseViewModel>(environment.API_BASE_URL + 'project/suspendProject/'+id);
  }

  getProjects(pagesize:number,pageindex:number){
    return this.http.get<ProjectViewModel>(environment.API_BASE_URL + 'project/getprojects/'+pagesize+'/'+pageindex);
  }

  getProjectNames(projectids: string[]){
    return this.http.post<ProjectModel[]>(environment.API_BASE_URL + 'project/getProjectNames',projectids);
  }

  getFilteredProjects(fclause: SortingAndFiltering){
    return this.http.post<ProjectViewModel>(environment.API_BASE_URL + 'project/filterprojects',fclause);
  }

  updateTaskCount(tcount: TaskCountModel){
    return this.http.post<BaseViewModel>(environment.API_BASE_URL + 'project/updatetaskcount',tcount);
  }
}
