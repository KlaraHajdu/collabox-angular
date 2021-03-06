import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.sass']
})
export class ConfirmationComponent implements OnInit {
  @Input() message: string
  @Input() info: string
  @Output() confirm: EventEmitter<any> = new EventEmitter();
  @Output() close: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  confirmAction() {
    this.confirm.emit(null);
  }

  cancel() {
    this.close.emit(null);
  }

}
