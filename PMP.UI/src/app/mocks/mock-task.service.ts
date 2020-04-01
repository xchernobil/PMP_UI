import { ProjectModel } from '../models/project.model';
import { Observable, of } from 'rxjs';

export class MockTaskService{
    getProjectTaskCount(pids:string[]):Observable<ProjectModel[]>{
        let mockData: ProjectModel[] = [];
        return of(mockData);
    }
}