import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../componentes/confirmation-dialog/confirmation-dialog.component';



@Injectable({ providedIn: 'root' })
export class AvisosDialogService {

  constructor(private dialog: MatDialog) { }

  openConfirmationDialog(mensagem: String): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '300px',
        data: mensagem
      });
      dialogRef.afterClosed().subscribe(result => {
        resolve(result === true);
      });
    });
  }

}
