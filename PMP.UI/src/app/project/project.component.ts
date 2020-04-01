import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ProjectService } from '../services/project.service';
import { Options } from 'ng5-slider';
import { SortingAndFiltering } from '../models/filter.model';
import { ProjectModel } from '../models/project.model';
import { NotifierService } from 'angular-notifier';
import { TaskService } from '../services/task.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../common/modal/modal.component';
import { UserService } from '../services/user.service';
import { CodeValueModel } from '../models/codevalue.model';
import { DateCompare } from '../helpers/custom.validator';
import { ConfirmationService } from '../common/confirmation/confirmation.service';
import { Paging } from '../models/paging.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-project,[app-project]',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {
  private readonly notifier: NotifierService;
  psubmitted = false;
  peditmode = false;
  projectForm: FormGroup;
  filterClause: SortingAndFiltering;
  projects: ProjectModel[] = [];
  selectedProjectOrigName = null;
  pIsSortAsc = true;
  pSortField = "";
  paging:Paging;
  @Input() reloadProjects: string;

  options: Options = {
    showTicksValues: false,
    floor:1,
    ceil:30
  };
  constructor(private formBuilder: FormBuilder
            , private readonly projectService: ProjectService
            , private notifierService:NotifierService
            , private modalService: NgbModal
            , private readonly taskService: TaskService
            , private readonly userService: UserService
            , private confirmation: ConfirmationService ) {
    this.notifier = notifierService;
    this.filterClause = new SortingAndFiltering();
  }

  get pf() { return this.projectForm.controls; }
  
  initProjectForm(){
    const sdate = new Date();
    const edate = new Date(new Date().setDate(new Date().getDate() + 1));
    
    this.projectForm = this.formBuilder.group({
      ProjectID: [''],
      ProjectName: ['', [Validators.required, Validators.minLength(6)]],
      IsDatesManuallySet: false,   
      StartDate: new FormControl({value: sdate.toISOString().substring(0,10), disabled: true}, Validators.required),
      EndDate: new FormControl({value: edate.toISOString().substring(0,10), disabled: true}, Validators.required),
      Priority: new FormControl(1, Validators.required),
      ManagerName: new FormControl('', Validators.required),
      ManagerID:['']
    }, {
      validator: DateCompare('StartDate', 'EndDate')
    });
  }
  
  ngOnInit() {
    this.initProjectForm();
    this.loadProjects();
  }

  ngOnChanges(changes: SimpleChanges) {      
    if('reloadProjects' in changes && this.reloadProjects != ""){
      this.loadProjects();     
    }
  }

  onManualDateChange():void {
    let value = this.projectForm.controls.IsDatesManuallySet.value;
    if(value){
      this.projectForm.controls.StartDate.enable();
      this.projectForm.controls.EndDate.enable();
    }
    else{
      this.projectForm.controls.StartDate.disable();
      this.projectForm.controls.EndDate.disable();
    }
  } 

  loadProjects() {
    this.projectService.getProjects(environment.PAGE_SIZE,0).subscribe(
      pdata => { 
        this.projects = pdata.Projects;
        this.paging = pdata.Paging;
      },
      error => {
        this.notifier.notify('error', error);
      }
    );
  }

  onSubmit() {
    this.psubmitted = true;
    if (this.projectForm.invalid) {
      return;
    }

    this.projectService.saveProject(this.projectForm.value).subscribe(
      data => {
        if(this.selectedProjectOrigName !== null && this.selectedProjectOrigName !== this.projectForm.controls.ProjectName.value) {
          
          this.taskService.updateProjectName(new CodeValueModel(this.projectForm.controls.ProjectID.value, this.projectForm.controls.ProjectName.value)).subscribe(
            tdata => {
              console.log("All project references has been updated");
            },
            error => {
              console.log(error);
            }
          );
        }
        this.onFormReset();
        this.loadProjects();
        this.notifier.notify('success', data.LocalizedMessage);
      },
      error => {
        this.notifier.notify('error', error);        
      }
    );
  }
  
  onUpdateProject(project: ProjectModel){
    this.peditmode = true;
    this.selectedProjectOrigName = project.ProjectName;
    let eproject = {
      ProjectID: project.ProjectID,
      ProjectName: project.ProjectName,
      IsDatesManuallySet: true,
      StartDate: project.StartDate.substring(0,10),
      EndDate: project.EndDate.substring(0,10),
      Priority: project.Priority,
      ManagerName: project.ManagerName,
      ManagerID: project.ManagerID
    };
    this.projectForm.setValue(eproject);
    this.onManualDateChange();
  }

  onSuspendProject(project: ProjectModel) {
    this.confirmation.confirm('Confirmation required','Do you want to suspend the project <b>'+project.ProjectName+'</b>')
    .then((confirmed) => {
        if(confirmed) {
          this.projectService.suspendProject(project.ProjectID).subscribe(
            data => {
              if(data.RecordsAffected > 0){
                this.notifier.notify('success', data.LocalizedMessage);
                this.loadProjects();
              }
              else{
                this.notifier.notify('error', 'Server error.Project can not be suspended');
              }
            },
            error => {
              this.notifier.notify('error', error);
            }
          )
        }
      }
    )
    .catch(() => '');
  }

  onFormReset() {
    this.selectedProjectOrigName = null;
    this.peditmode = false;
    this.psubmitted = false;
    this.projectForm.reset();
    this.onManualDateChange();
    const sdate = new Date();
    const edate = new Date(new Date().setDate(new Date().getDate() + 1));
    this.projectForm.patchValue({StartDate:sdate.toISOString().substring(0,10),EndDate:edate.toISOString().substring(0,10)});
  } 

  onSort(sortfield: string) {
    if(this.pSortField != sortfield){
      this.pSortField = sortfield;
      this.pIsSortAsc = true;
    }
    this.filterClause.SortField = sortfield;
    this.filterClause.SortOrder = this.pIsSortAsc? "Asc":"Desc";
    this.pIsSortAsc = !this.pIsSortAsc;
    this.filterClause.Paging.PageIndex = 0;
    this.filterClause.Paging.PageSize = environment.PAGE_SIZE;

    this.projectService.getFilteredProjects(this.filterClause).subscribe(
      pdata => {
        this.projects = pdata.Projects;
        this.paging = pdata.Paging;
      },
      error => {
        this.notifier.notify('error', error);
      }
    );
  }

  onManagerSearch(){
    var ldata = new Array();
    this.userService.getUsers(0,0).subscribe(
      data => {
        for (var td of data.Users) {
          ldata.push(new CodeValueModel(td.EmployeeID,td.FirstName+" "+td.LastName));
        }
        const modalRef = this.modalService.open(ModalComponent);
        modalRef.componentInstance.title = "Select a Manager";
        modalRef.componentInstance.listData = ldata;
        modalRef.componentInstance.selectEvent.subscribe(($e) => {
          this.projectForm.patchValue({ManagerID:$e.Code,ManagerName: $e.Value});
          this.modalService.dismissAll();
        });
        modalRef.componentInstance.modalItemSearch.subscribe(($e) => {
          modalRef.componentInstance.listData = ldata.filter((pd) => pd.Value.toLowerCase().startsWith($e.target.value.toLowerCase()));
        });
      },
      error => {
        this.notifier.notify('error', error);
      }
    );    
  }

  private getFilteredAndPagedData(fvalue: string, pageindex: number, pagesize: number) {
    this.filterClause.FilterValue = fvalue;
    this.filterClause.Paging.PageIndex = pageindex;
    this.filterClause.Paging.PageSize = pagesize;

    this.projectService.getFilteredProjects(this.filterClause).subscribe(
      data => {
        this.projects = data.Projects;
        this.paging = data.Paging;
      },
      error => {
        this.notifier.notify('error', error);
      }
    );
  }

  onSearchByName(event: any) {
    if(event.target.value.length == 0 || event.target.value.length > 2) {      
      this.getFilteredAndPagedData(event.target.value,0,environment.PAGE_SIZE)
    }
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
