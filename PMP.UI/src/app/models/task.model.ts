import { Paging } from './paging.model';

export class TaskModel {
    TaskID: string;
    TaskName: string;
    ProjectName: string;
    ProjectID: string;
    UserName: string;
    UserID: number;
    IsParentTask: boolean;
    ParentTaskName: string;
    ParentTaskID: number;
    StartDate: string;
    EndDate: string;
    Priority: number;
    Status: number;
}

export class TaskViewModel{
    Tasks: TaskModel[];
    Paging: Paging;
}

export class TaskCountModel{
    ProjectID: string;
    NumberOfTasks: number;
    CompletedTasks: number;
    constructor(projectId:string,numberOfTasks:number,completedTasks:number) {
        this.ProjectID=projectId;
        this.NumberOfTasks=numberOfTasks;
        this.CompletedTasks=completedTasks;
    }
}