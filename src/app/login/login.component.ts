import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { GlobalConstants } from '../shared/global-constants';
import { SnackbarService } from '../snackbar.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent  implements OnInit{

  hide=true;
  loginForm:any = FormGroup;
  responseMessage:any='test response';
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private snackbarService: SnackbarService,
    private dialogRef:MatDialogRef<LoginComponent>,
    private ngxService: NgxUiLoaderService
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email:[null,[Validators.required, Validators.pattern(GlobalConstants.emailRegex)]],
      password:[null,[Validators.required]],
    });
  }

  handleSubmit(){
    this.ngxService.start();
    var formData = this.loginForm.value;
    var data = {
      email:formData.email,
      password:formData.password
    }
    this.userService.login(data).subscribe({
      next:(response:any)=>{
      this.ngxService.stop();
      this.dialogRef.close();
      localStorage.setItem('token',response.token);
      this.router.navigate(['/cafe/dashboard']);
    },error:(error:any)=>{
      this.ngxService.stop();
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }else {
        this.responseMessage = GlobalConstants.generisError;
      }
      this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.error)
    }

  })
  }


}
