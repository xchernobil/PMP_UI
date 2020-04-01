import { Component, OnInit, Output, EventEmitter, Input, SimpleChanges } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { TaskService } from '../services/task.service';
import { TaskModel, TaskCountModel } from '../models/task.model';
import { ProjectService } from '../services/project.service';
import { SortingAndFiltering } from '../models/filter.model';
import { ModalComponent } from '../common/modal/modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CodeValueModel } from '../models/codevalue.model';
import { ConfirmationService } from '../common/confirmation/confirmation.service';
import { Paging } from '../models/paging.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-view,[app-view]',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {
  tasks: TaskModel[] = [];
  filterClause: SortingAndFiltering;
  selectedProjectId: string = null;
  selectedProjectName: string = null;
  tIsSortAsc = true;
  tSortField = "";
  paging:Paging;
  @Output() onTaskSelect = new EventEmitter();
  @Output() onTaskEnd = new EventEmitter();
  @Input() RequireDataReload: boolean;

  constructor(private readonly notifier:NotifierService
    , private readonly taskService: TaskService
    , private modalService: NgbModal
    , private readonly projectService: ProjectService
    , private confirmation: ConfirmationService) {
      this.filterClause = new SortingAndFiltering();
      this.selectedProjectName='';
     }

  ngOnInit() {
    
  }

  ngOnChanges(changes: SimpleChanges) {    
    if('RequireDataReload' in changes && this.RequireDataReload){
      if(this.selectedProjectId != null){
        this.loadTasks();
      }      
    }
  }

  loadTasks() {
    if(this.selectedProjectId == null){
      this.taskService.getTasks((environment.PAGE_SIZE+10),0).subscribe(
        tdata => {
          this.tasks = tdata.Tasks;
          this.paging = tdata.Paging;
        },
        error => {
          this.notifier.notify('error', error);
        }
      );
    }
    else{
      this.filterClause.FilterValue = this.selectedProjectId;
      this.getFilteredAndPagedData(this.selectedProjectId,0,environment.PAGE_SIZE);      
    }
  }

  private getFilteredAndPagedData(fvalue: string, pageindex: number, pagesize: number) {
    this.filterClause.FilterValue = fvalue;
    this.filterClause.Paging.PageIndex = pageindex;
    this.filterClause.Paging.PageSize = pagesize;

    this.taskService.getFilteredTasks(this.filterClause).subscribe(
      tdata => {
        this.tasks = tdata.Tasks;
        this.paging = tdata.Paging;
      },
      error => {
        this.notifier.notify('error', error);
      }
    );
  }

  onEditTask(task:TaskModel) { 
    this.onTaskSelect.emit(task);
  }

  onEndTask(task:TaskModel) {
    this.confirmation.confirm('Confirmation required','Do you want to end the task <b>'+task.TaskName+'</b>')
    .then((confirmed) => {
        if(confirmed) {
          this.taskService.endTask(task.TaskID).subscribe(
            data => {
              this.notifier.notify('success', data.LocalizedMessage);
              this.projectService.updateTaskCount(new TaskCountModel(this.selectedProjectId,0,data.RecordsAffected)).subscribe(
                udata => {                  
                  this.onTaskEnd.emit(task.TaskID);
                },
                error => {
                  this.notifier.notify('error', error);
                }
              );
              this.loadTasks();
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
          this.selectedProjectId = $e.Code;
          this.selectedProjectName = $e.Value;
          this.getFilteredAndPagedData(this.selectedProjectId,0,environment.PAGE_SIZE);
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

    onSort(sortfield: string) {
    if(this.tSortField != sortfield){
      this.tSortField = sortfield;
      this.tIsSortAsc = true;
    }
    
    this.filterClause.FilterValue = this.selectedProjectId;
    this.filterClause.SortField = sortfield;
    this.filterClause.SortOrder = this.tIsSortAsc? "Asc":"Desc";
    this.tIsSortAsc = !this.tIsSortAsc;
    this.filterClause.Paging.PageIndex = 0;
    this.filterClause.Paging.PageSize = environment.PAGE_SIZE;
    this.taskService.getFilteredTasks(this.filterClause).subscribe(
      data => {
        this.tasks = data.Tasks;
        this.paging = data.Paging;
      },
      error => {
        this.notifier.notify('error', error);
      }
    );
  }

  onPagingNumber(pidx:number){
    this.getFilteredAndPagedData(this.selectedProjectId,pidx,environment.PAGE_SIZE)
  }

  onPagingNext(){
    if(this.paging.PageIndex <= this.paging.TotalPages-1){
      this.getFilteredAndPagedData(this.selectedProjectId,(this.paging.PageIndex+1),environment.PAGE_SIZE);
    }
  }

  onPagingPrev() {
    if(this.paging.PageIndex > 0) {
      this.getFilteredAndPagedData(this.selectedProjectId,(this.paging.PageIndex-1),environment.PAGE_SIZE);
    }
  }

  calculateDiff(sentDate) {
    var date1:any = new Date(sentDate);
    var date2:any = new Date();
    var diffDays:any = Math.floor((date2 - date1) / (1000 * 60 * 60 * 24));

    return diffDays;
  }
}

