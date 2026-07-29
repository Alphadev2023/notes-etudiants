import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IconComponent } from "../icon/icon.component";

@Component({
  selector: "app-confirm-modal",
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: "./confirm-modal.component.html",
})
export class ConfirmModalComponent {
  @Input() open = false;
  @Input() title = "Confirmer";
  @Input() message = "Êtes-vous sûr ?";
  @Input() confirmLabel = "Confirmer";
  @Input() cancelLabel = "Annuler";
  @Input() loading = false;

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}
