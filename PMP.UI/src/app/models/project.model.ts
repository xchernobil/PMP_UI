import { Paging } from './paging.model';

export class ProjectModel{
    ProjectID: string
    ProjectName: string;
    StartDate: string;
    EndDate: string;
    Priority: number;
    ManagerName: string;
    ManagerID: number;
    NumberOfTasks: number;
    CompletedTasks: number;
}

export class ProjectViewModel{
    Projects: ProjectModel[];
    Paging: Paging;
}