import { Paging } from './paging.model';

export class UserModel{
    UserID: string;
    EmployeeID: string;
    FirstName: string;
    LastName: string;
    IsActive: boolean;
}

export class UserViewModel{
    Users: UserModel[];
    Paging: Paging;
}