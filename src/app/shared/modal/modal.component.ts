import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {
  @Input() message : string;
  @Output() close = new EventEmitter<void>();
  constructor() { }

  ngOnInit() {
  }
  onClose(){
    this.close.emit();
  }
}
