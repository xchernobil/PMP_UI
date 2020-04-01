import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserModel, UserViewModel } from '../models/user.model';
import { environment } from 'src/environments/environment';
import { SortingAndFiltering } from '../models/filter.model';
import { BaseViewModel } from '../models/baseview.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private readonly http: HttpClient) { }

  saveUser(user: UserModel){
    return this.http.post<BaseViewModel>(environment.API_BASE_URL + 'user/saveUser', user);
  }

  deleteUser(id: string){
    return this.http.delete<BaseViewModel>(environment.API_BASE_URL + 'user/deleteUser/'+id);
  }

  getUsers(pagesize:number,pageindex:number){
    return this.http.get<UserViewModel>(environment.API_BASE_URL + 'user/getUsers/'+pagesize+'/'+pageindex);
  }

  getFilteredUsers(fclause: SortingAndFiltering){
    return this.http.post<UserViewModel>(environment.API_BASE_URL + 'user/filterusers',fclause);
  }
}
