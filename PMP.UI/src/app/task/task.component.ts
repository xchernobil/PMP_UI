import { Component, OnInit, Input, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { Options } from 'ng5-slider';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TaskService } from '../services/task.service';
import { NotifierService } from 'angular-notifier';
import { ProjectService } from '../services/project.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../services/user.service';
import { ModalComponent } from '../common/modal/modal.component';
import { CodeValueModel } from '../models/codevalue.model';
import { TaskModel, TaskCountModel } from '../models/task.model';
import { DependentRequired } from '../helpers/custom.validator';
import { SortingAndFiltering } from '../models/filter.model';


@Component({
  selector: 'app-task,[app-task]',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {
  private readonly notifier: NotifierService;
  tsubmitted = false;
  teditmode = false;
  taskForm: FormGroup;
  disableParentTaskSearch = false;
  disableProjectSearch = false;
  @Input() selectedTask: TaskModel;
  @Output() onTaskCreated = new EventEmitter();
  @Output() onTaskUpdated = new EventEmitter();

  options: Options = {
    showTicksValues: false,
    floor:1,
    ceil:30
  };

  constructor(private formBuilder: FormBuilder
              , private readonly projectService: ProjectService
              ,  notifierService:NotifierService
              , private modalService: NgbModal
              , private readonly taskService: TaskService
              , private readonly userService: UserService) { 
    this.notifier = notifierService;
  }
  get tf() { return this.taskForm.controls; }

  ngOnInit() {
      this.initTaskForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if('selectedTask' in changes && this.selectedTask){
      this.onTaskEdit(this.selectedTask);
    }
  }

  initTaskForm(){
    
    const sdate = new Date();
    const edate = new Date(new Date().setDate(new Date().getDate() + 1));
    
    this.taskForm = this.formBuilder.group({
      TaskID: [''],
      TaskName: ['', [Validators.required, Validators.minLength(3)]],
      ProjectID: [''],
      ProjectName: ['', Validators.required],
      IsParentTask: [false],
      ParentTaskID:[0],
      ParentTaskName:[''],
      StartDate: new FormControl(sdate.toISOString().substring(0,10), Validators.required),
      EndDate: new FormControl(edate.toISOString().substring(0,10), Validators.required),
      Priority: new FormControl(1, Validators.required),
      UserName:['', Validators.required],
      UserID:['']
    }, {
      validator: DependentRequired('IsParentTask', 'ParentTaskName')
    });
    this.disableProjectSearch = false;
  }

  onIsParentTaskCheck():void {
    let value = this.taskForm.controls.IsParentTask.value;
    if(value){
      this.disableParentTaskSearch = true;
    }
    else{
      this.disableParentTaskSearch = false;
    }
  } 

  onSubmit() {
    this.tsubmitted = true;
    if (this.taskForm.invalid) {
      return;
    }

    this.taskService.saveTask(this.taskForm.value).subscribe(
      data => {
        if(this.taskForm.value.TaskID == '') {
          this.projectService.updateTaskCount(new TaskCountModel(this.taskForm.value.ProjectID,data.RecordsAffected,0)).subscribe(
            udata => {              
              this.onTaskCreated.emit(true);
            },
            error => {
              this.notifier.notify('error', error);
            }
          );
        }
        else{
          this.onTaskUpdated.emit(true);
        }
                
        this.notifier.notify('success', data.LocalizedMessage);
        // this.teditmode = false;
        // this.tsubmitted = false;
        // this.initTaskForm();
        this.onFormReset();
      },
      error=> {
        this.notifier.notify('error', error);
      }
    );
  }

  onFormReset(){
    this.teditmode = false;
    this.tsubmitted = false;
    this.disableParentTaskSearch = false;
    this.initTaskForm();
  }

  onTaskEdit(task: TaskModel){
    this.teditmode = true;
    let etask = {
      TaskID: task.TaskID,
      TaskName: task.TaskName,
      ProjectID: task.ProjectID,
      ProjectName: task.ProjectName,      
      StartDate: task.StartDate.substring(0,10),
      EndDate: task.EndDate.substring(0,10),
      Priority: task.Priority,
      UserID: task.UserID,
      UserName: task.UserName,
      IsParentTask: task.IsParentTask,
      ParentTaskID: task.ParentTaskID,
      ParentTaskName: task.ParentTaskName
    };
    this.taskForm.patchValue(etask);
    this.disableProjectSearch = true;
  }

  onProjectSearch(){
    var ldata = new Array();
    this.projectService.getProjects(0,0).subscribe(
      data => {
        for (var td of data.Projects) {
          ldata.push(new CodeValueModel(td.ProjectID,td.ProjectName));
        }
        const modalRef = this.modalService.open(ModalComponent);
        modalRef.componentInstance.title = "Select a Project";
        modalRef.componentInstance.listData = ldata;
        modalRef.componentInstance.selectEvent.subscribe(($e) => {          
          this.taskForm.patchValue({ProjectID:$e.Code,ProjectName: $e.Value});
          this.modalService.dismissAll();
        });
        modalRef.componentInstance.modalItemSearch.subscribe(($e) => {
          modalRef.componentInstance.listData = ldata.filter((pd) => pd.Value.toLowerCase().startsWith($e.target.value.toLowerCase()));
        });
      },
      error=>{
        this.notifier.notify('error', error);
      }
    );
  }

  onParentTaskSearch() {
    
    if(this.taskForm.controls.ProjectID.value != "") {
      var ldata = new Array();
      var fclause = new SortingAndFiltering();
      fclause.FilterValue = this.taskForm.controls.ProjectID.value;
      this.taskService.getFilteredTasks(fclause).subscribe(
        data => {
          for (var td of data.Tasks) {
            ldata.push(new CodeValueModel(td.TaskID,td.TaskName));
          }
          const modalRef = this.modalService.open(ModalComponent);
          modalRef.componentInstance.title = "Select a Parent Task";
          modalRef.componentInstance.listData = ldata;
          modalRef.componentInstance.selectEvent.subscribe(($e) => {          
            this.taskForm.patchValue({ParentTaskID:$e.Code,ParentTaskName: $e.Value});
            this.modalService.dismissAll();
          });
          modalRef.componentInstance.modalItemSearch.subscribe(($e) => {
            modalRef.componentInstance.listData = ldata.filter((pd) => pd.Value.toLowerCase().startsWith($e.target.value.toLowerCase()));
          });
        },
        error=>{
          this.notifier.notify('error', error);
        }
      );
    }
    else{
      this.notifier.notify('error', 'Please select project first');
    }
  }

  onUserSearch(){
    var ldata = new Array();
    this.userService.getUsers(0,0).subscribe(
      data => {
        for (var td of data.Users) {
          ldata.push(new CodeValueModel(td.EmployeeID,td.FirstName+" "+td.LastName));
        }
        const modalRef = this.modalService.open(ModalComponent);
        modalRef.componentInstance.title = "Select a Parent Task";
        modalRef.componentInstance.listData = ldata;
        modalRef.componentInstance.selectEvent.subscribe(($e) => {          
          this.taskForm.patchValue({UserID:$e.Code,UserName: $e.Value});
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
}
