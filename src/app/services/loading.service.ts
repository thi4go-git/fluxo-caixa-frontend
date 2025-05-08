import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LoadingModalComponent } from '../componentes/loading-modal/loading-modal.component';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private loadingRef: MatDialogRef<LoadingModalComponent> | null = null;
  
  constructor(private dialog: MatDialog) {}
  
  show(): void {
    if (!this.loadingRef) {
      this.loadingRef = this.dialog.open(LoadingModalComponent, {
        disableClose: true,
        panelClass: 'transparent-dialog'
      });
    }
  }

  hide(): void {
    if (this.loadingRef) {
      this.loadingRef.close();
      this.loadingRef = null;
    }
  }
}
