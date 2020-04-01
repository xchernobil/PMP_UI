import { Observable } from 'rxjs/Observable'; 
import { UserModel } from '../models/user.model';
import { of } from 'rxjs';

export class MockUserService{
    getUsers():Observable<UserModel[]>{
       let mockData: UserModel[] = [];
       return of(mockData);
    }
}