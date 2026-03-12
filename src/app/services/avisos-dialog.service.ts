import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../componentes/confirmation-dialog/confirmation-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';



@Injectable({ providedIn: 'root' })
export class AvisosDialogService {

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) { }

  openConfirmationDialog(mensagem: String): Promise<boolean> {
    return new Promise<boolean>((resolve, _reject) => {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '300px',
        data: mensagem
      });
      dialogRef.afterClosed().subscribe(result => {
        resolve(result === true);
      });
    });
  }


  notificar(msg: string, title: string){
    this.snackBar.open(msg, title, {
      duration: 5000
    });
  }


}
