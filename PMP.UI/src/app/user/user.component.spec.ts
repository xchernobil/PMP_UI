import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserComponent } from './user.component';
import { UserService } from '../services/user.service';
import { MockUserService } from '../mocks/mock-user.service';
import { NotifierService } from 'angular-notifier';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownDirective } from '../shared/dropdown.directive';

describe('UserComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        UserComponent,
        DropdownDirective 
      ],
      imports:[
        FormsModule,
        ReactiveFormsModule
      ],
      providers:[
        { provide: UserService, useClass: MockUserService },
        { provide: NotifierService}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
