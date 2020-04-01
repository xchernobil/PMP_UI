import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewComponent } from './view.component';
import { NotifierModule, NotifierService } from 'angular-notifier';
import { ProjectService } from '../services/project.service';
import { MockProjectService } from '../mocks/mock-project.service';
import { TaskService } from '../services/task.service';
import { MockTaskService } from '../mocks/mock-task.service';
import { DropdownDirective } from '../shared/dropdown.directive';

describe('ViewComponent', () => {
  let component: ViewComponent;
  let fixture: ComponentFixture<ViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        ViewComponent,
        DropdownDirective
      ],
      providers:[
        { provide: ProjectService, useClass: MockProjectService },
        { provide: TaskService, useClass: MockTaskService },
        { provide: NotifierService}
    ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
