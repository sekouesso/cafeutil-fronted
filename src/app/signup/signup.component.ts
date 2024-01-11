import { Component, OnInit } from '@angular/core';
import {FormGroup,FormBuilder,Validators} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { GlobalConstants } from '../shared/global-constants';
import { SnackbarService } from '../snackbar.service';
import { UserService } from '../user.service';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  password=true;
  confirmPassword=true;
  signupForm:any= FormGroup;
  responseMessage:any;


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private snackbarService: SnackbarService,
    private dialogRef:MatDialogRef<SignupComponent>,
    private ngxService: NgxUiLoaderService
  ) { }

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      name:[null,[Validators.required, Validators.pattern(GlobalConstants.nameRegex)]],
      email:[null,[Validators.required, Validators.pattern(GlobalConstants.emailRegex)]],
      contactNumber:[null,[Validators.required, Validators.pattern(GlobalConstants.contactNumberRegex)]],
      password:[null,[Validators.required]],
      confirmPassword:[null,[Validators.required]],
    })
  }

  validateSubmit(){
    if(this.signupForm.controls['password'].value != this.signupForm.controls['confirmPassword'].value){
      return true;
    }else{
      return false;
    }
  }

  handleSubmit(){
    this.ngxService.start();
    var formData = this.signupForm.value;
    var data = {
      name:formData.name,
      email:formData.email,
      contactNumber:formData.contactNumber,
      password:formData.password
    }
    this.userService.signup(data).subscribe({
      next:(response:any)=>{
      this.ngxService.stop();
      this.dialogRef.close();
      this.responseMessage = response?.message;
      this.snackbarService.openSnackbar(this.responseMessage,"");
      this.router.navigate(['/']);
    },error:(error)=>{
      this.ngxService.stop();
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }else {
        this.responseMessage = GlobalConstants.generisError;
      }
      this.snackbarService.openSnackbar(this.responseMessage,GlobalConstants.error)
    }

  })
  }

}
