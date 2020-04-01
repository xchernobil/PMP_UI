import { Observable } from 'rxjs/Observable';
import { ProjectModel } from '../models/project.model';
import { of } from 'rxjs';

export class MockProjectService{
    getProjects():Observable<ProjectModel[]>{
        let mockData: ProjectModel[] = [];
        return of(mockData);
    }
}