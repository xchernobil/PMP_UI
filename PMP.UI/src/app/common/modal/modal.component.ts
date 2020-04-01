import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CodeValueModel } from 'src/app/models/codevalue.model';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {
  @Input() title: string;
  @Input() listData: any;
  @Output() modalItemSearch: EventEmitter<string> = new EventEmitter<string>();
  @Output() selectEvent: EventEmitter<CodeValueModel> = new EventEmitter<CodeValueModel>();
  constructor(public activeModal: NgbActiveModal) {

  }

  onItemSelect(code:string,value:string){
    this.selectEvent.emit(new CodeValueModel(code,value));
  }

  onSearchByTerm(term:string){
    this.modalItemSearch.emit(term);
  }

}
