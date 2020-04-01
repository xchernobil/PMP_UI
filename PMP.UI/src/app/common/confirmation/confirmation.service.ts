import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ConfirmationComponent } from './confirmation.component';

@Injectable({providedIn: 'root'})
export class ConfirmationService {

  constructor(private modalService: NgbModal) { }

  public confirm(
    title: string,
    message: string,
    btnOkText: string = 'OK',
    btnCancelText: string = 'Cancel',
    dialogSize: 'md'|'lg' = 'md'): Promise<boolean> {
    const modalRef = this.modalService.open(ConfirmationComponent, { size: dialogSize });
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.message = message;
    modalRef.componentInstance.btnOkText = btnOkText;
    modalRef.componentInstance.btnCancelText = btnCancelText;

    return modalRef.result;
  }

}
