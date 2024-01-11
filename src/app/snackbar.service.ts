import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(
    private snackbar:MatSnackBar
  ) { }

  openSnackbar(message:string,action:string){
    if(action==='error'){
      this.snackbar.open(message,'',{
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration:2000,
        panelClass:['black-snackbar']
      });
    }else{
      this.snackbar.open(message,'',{
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration:2000,
        panelClass:['green-snackbar']
      });
    }
  }

  openSnackBar(message: string, action: string) {
    this.snackbar.open(message, action, {
      duration: 2000,
      panelClass:['green-snackbar']
    });
  }

  openSnack(m:string) {
    this.snackbar.open(m,"", {
      duration: 500,
    });
  }

}
