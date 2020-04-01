import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
//import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProjectComponent } from './project/project.component';
import { TaskComponent } from './task/task.component';
import { UserComponent } from './user/user.component';
import { ViewComponent } from './view/view.component';
import { Ng5SliderModule } from 'ng5-slider';
import { NotifierModule } from 'angular-notifier';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ErrorInterceptor } from './helpers/error.interceptor';
import { ModalComponent } from './common/modal/modal.component';
import { ConfirmationComponent } from './common/confirmation/confirmation.component';
import { ConfirmationService } from './common/confirmation/confirmation.service';
import { DropdownDirective } from './shared/dropdown.directive';

@NgModule({
  declarations: [
    DropdownDirective,
    AppComponent,
    ProjectComponent,
    TaskComponent,
    UserComponent,
    ViewComponent,
    ModalComponent,
    ConfirmationComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    //AppRoutingModule,
    Ng5SliderModule,
    NotifierModule,
    NgbModule,
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }],
  bootstrap: [AppComponent],
  entryComponents: [ ModalComponent,ConfirmationComponent ]
})
export class AppModule { }
