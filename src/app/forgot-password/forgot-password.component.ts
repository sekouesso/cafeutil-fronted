import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { GlobalConstants } from '../shared/global-constants';
import { SnackbarService } from '../snackbar.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm:any = FormGroup;
  responseMessage:any;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private snackbarService: SnackbarService,
    private dialogRef:MatDialogRef<ForgotPasswordComponent>,
    private ngxService: NgxUiLoaderService
  ) { }

  ngOnInit(): void {
    this.forgotPasswordForm = this.fb.group({
      email:[null,[Validators.required, Validators.pattern(GlobalConstants.emailRegex)]],
    });
  }

  handleSubmit(){
    this.ngxService.start();
    var formData = this.forgotPasswordForm.value;
    var data = {
      email:formData.email
    }
    this.userService.forgotPassword(data).subscribe({
      next:(response:any)=>{
      this.ngxService.stop();
      this.responseMessage = response?.message;
      this.dialogRef.close();
      this.snackbarService.openSnackbar(this.responseMessage,"");
      //this.router.navigate(['/']);
    },error:(error)=>{
      this.ngxService.stop();
      if(error?.message){
        this.responseMessage = error.error?.message;
      }else {
        this.responseMessage = GlobalConstants.generisError;
      }
      this.snackbarService.openSnackbar(this.responseMessage,GlobalConstants.error)
    }

  })
  }

}
