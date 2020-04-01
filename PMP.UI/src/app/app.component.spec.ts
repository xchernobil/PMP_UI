import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { ProjectComponent } from './project/project.component';
import { TaskComponent } from './task/task.component';
import { ViewComponent } from './view/view.component';
import { UserComponent } from './user/user.component';
import { NotifierModule } from 'angular-notifier';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng5SliderModule } from 'ng5-slider';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DropdownDirective } from './shared/dropdown.directive';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        RouterTestingModule,
        NotifierModule,
        FormsModule,
        ReactiveFormsModule,
        Ng5SliderModule,
        NgbModule
      ],
      declarations: [
        AppComponent,
        ProjectComponent,
        TaskComponent,
        ViewComponent,
        UserComponent,
        DropdownDirective
      ]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'PMUI'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('PMUI');
  });

});
