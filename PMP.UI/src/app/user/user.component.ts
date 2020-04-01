import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserModel } from '../models/user.model';
import { SortingAndFiltering } from '../models/filter.model';
import { UserService } from '../services/user.service';
import { NotifierService } from 'angular-notifier';
import { ConfirmationService } from '../common/confirmation/confirmation.service';
import { environment } from 'src/environments/environment';
import { Paging } from '../models/paging.model';

@Component({
  selector: 'app-user,[app-user]',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  private readonly notifier: NotifierService;
  usubmitted = false;
  isEditMode = false;
  uIsSortAsc = true;
  uSortField = "";
  userForm: FormGroup;
  filterClause: SortingAndFiltering;
  users: UserModel[] = [];
  paging:Paging;
  constructor(private formBuilder: FormBuilder
    , private readonly userService: UserService
    , private notifierService:NotifierService
    , private confirmation:ConfirmationService) {
    this.notifier = notifierService;
    this.filterClause = new SortingAndFiltering();
  }

  get uf() { return this.userForm.controls; }
  
  initUserForm(){   
    this.userForm = this.formBuilder.group({
      UserID: [''],
      EmployeeID: ['',[Validators.required, Validators.pattern('^[0-9]{4}$')]],
      FirstName: ['', [Validators.required,Validators.pattern('^[a-zA-Z]*$')]],
      LastName: ['', [Validators.required,Validators.pattern('^[a-zA-Z]*$')]]
    });
  }
  
  ngOnInit() {
    this.initUserForm();
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers(environment.PAGE_SIZE,0).subscribe(
      data => {
        this.users = data.Users;
        this.paging = data.Paging;
      },
      error => {
        this.notifier.notify('error', error);
        console.log(error);
      }
    );
  }

  onSubmit() {
    this.usubmitted = true;
    if (this.userForm.invalid) {
      return;
    }
    this.userService.saveUser(this.userForm.getRawValue()).subscribe(
      data => {
        this.isEditMode = false;
        this.onReset();
        this.loadUsers();
        this.notifier.notify('success', data.LocalizedMessage);
      },
      error => {
        this.notifier.notify('error', error);
      }
    );
  }
  
  onEditUser(user: UserModel){
    this.isEditMode = true;
    let euser = {
      UserID: user.UserID,
      EmployeeID: user.EmployeeID,
      FirstName: user.FirstName,
      LastName: user.LastName
    };
    this.userForm.setValue(euser);
  }

  onDeleteUser(user: UserModel){
    this.confirmation.confirm('Confirmation required','Do you want to delete the user <b>'+user.FirstName+' '+user.LastName+'</b>')
    .then((confirmed) => {
        if(confirmed){
          this.userService.deleteUser(user.UserID).subscribe(
            data => {
              this.notifier.notify('success', data.LocalizedMessage);
              this.loadUsers();
            },
            error=> {
              this.notifier.notify('error', error);
            }
          )
        }
      }
    )
    .catch(() => '');
    
  }

  onReset() {  
    this.isEditMode = false;
    this.usubmitted = false;
    this.userForm.reset();
  }

  onSearchByName(event: any) {
    if(event.target.value.length == 0 || event.target.value.length > 2) {      
      this.getFilteredAndPagedData(event.target.value,0,environment.PAGE_SIZE)
    }
  }

  onSort(sortfield: string) {
    if(this.uSortField != sortfield){
      this.uSortField = sortfield;
      this.uIsSortAsc = true;
    }
    this.filterClause.SortField = sortfield;
    this.filterClause.SortOrder = this.uIsSortAsc? "Asc":"Desc";
    this.uIsSortAsc = !this.uIsSortAsc;
    this.filterClause.Paging.PageIndex = 0;
    this.filterClause.Paging.PageSize = environment.PAGE_SIZE;
    
    this.userService.getFilteredUsers(this.filterClause).subscribe(
      data => {
        this.users = data.Users;

      },
      error=>{
        this.notifier.notify('error', error);
      }
    );
  }

  private getFilteredAndPagedData(fvalue: string, pageindex: number, pagesize: number) {
    this.filterClause.FilterValue = fvalue;
    this.filterClause.Paging.PageIndex = pageindex;
    this.filterClause.Paging.PageSize = pagesize;

    this.userService.getFilteredUsers(this.filterClause).subscribe(
      data => {
        this.users = data.Users;
        this.paging = data.Paging;
      },
      error => {
        this.notifier.notify('error', error);
      }
    );
  }

  onPagingNumber(pidx:number){
    this.getFilteredAndPagedData("",pidx,environment.PAGE_SIZE)
  }

  onPagingNext(){
    if(this.paging.PageIndex <= this.paging.TotalPages-1){
      this.getFilteredAndPagedData("",(this.paging.PageIndex+1),environment.PAGE_SIZE);
    }
  }

  onPagingPrev() {
    if(this.paging.PageIndex > 0) {
      this.getFilteredAndPagedData("",(this.paging.PageIndex-1),environment.PAGE_SIZE);
    }
  }

}
