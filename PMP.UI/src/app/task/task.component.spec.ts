import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskComponent } from './task.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { MockTaskService } from '../mocks/mock-task.service';
import { TaskService } from '../services/task.service';
import { Ng5SliderModule } from 'ng5-slider';
import { ModalComponent } from '../common/modal/modal.component';
import { UserService } from '../services/user.service';
import { MockUserService } from '../mocks/mock-user.service';
import { ProjectService } from '../services/project.service';
import { MockProjectService } from '../mocks/mock-project.service';

describe('TaskComponent', () => {
  let component: TaskComponent;
  let fixture: ComponentFixture<TaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskComponent,
        ModalComponent 
      ],
      imports:[
        FormsModule,
        ReactiveFormsModule,
        Ng5SliderModule
      ],
      providers:[
        { provide: TaskService, useClass: MockTaskService },
        { provide: UserService, useClass: MockUserService },
        { provide: ProjectService, useClass: MockProjectService },
        { provide: NotifierService}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
