import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectComponent } from './project.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng5SliderModule } from 'ng5-slider';
import { UserService } from '../services/user.service';
import { MockUserService } from '../mocks/mock-user.service';
import { ProjectService } from '../services/project.service';
import { MockProjectService } from '../mocks/mock-project.service';
import { NotifierService } from 'angular-notifier';
import { ModalComponent } from '../common/modal/modal.component';
import { TaskService } from '../services/task.service';
import { MockTaskService } from '../mocks/mock-task.service';
import { DropdownDirective } from '../shared/dropdown.directive';

describe('ProjectComponent', () => {
  let component: ProjectComponent;
  let fixture: ComponentFixture<ProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        ProjectComponent,
        ModalComponent,        
        DropdownDirective
      ],
      imports:[
        FormsModule,
        ReactiveFormsModule,
        Ng5SliderModule
      ],
      
      providers:[
        { provide: UserService, useClass: MockUserService },
        { provide: ProjectService, useClass: MockProjectService },
        { provide: TaskService, useClass: MockTaskService },
        { provide: NotifierService}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
