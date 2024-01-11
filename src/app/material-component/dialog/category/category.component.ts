import { Component, EventEmitter, OnInit , Inject} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CategoryService } from 'src/app/services/category.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { SnackbarService } from 'src/app/snackbar.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  onAddCategory = new EventEmitter();
  onEditCategory = new EventEmitter();
  categoryForm:any = FormGroup;
  dialogAction:any = 'Add';
  action:any = 'Add';
  responseMessage:any ;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData:any,
    private categoryService:CategoryService,
    public dialogRef: MatDialogRef<CategoryComponent>,
    private snackbarService: SnackbarService,
    private fb: FormBuilder
  ){}

  ngOnInit(): void {
    this.categoryForm = this.fb.group({
      name: [null,[Validators.required]]
    });
    if(this.dialogData.action === 'Edit'){
      this.dialogAction = 'Edit';
      this.action = 'Update';
      this.categoryForm.patchValue(this.dialogData.data);
    }
  }
handleSubmit(){
  if(this.dialogAction === 'Edit'){
    this.edit();
  }else{
    this.add();
  }
}
add(){
  var formData = this.categoryForm.value;
  var data = {
    name: formData.name
  }
  this.categoryService.add(data).subscribe({
    next: (response:any) => {
      this.dialogRef.close();
      this.onAddCategory.emit();
      this.responseMessage = response.message;
      this.snackbarService.openSnackbar(this.responseMessage,'success');
    },
    error: (error:any) => {
      this.dialogRef.close();
      console.error(error);
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }else {
        this.responseMessage = GlobalConstants.generisError;
      }
      this.snackbarService.openSnackbar(this.responseMessage,GlobalConstants.error)
      
    }
  })
}
edit(){
  var formData = this.categoryForm.value;
  var data = {
    id: this.dialogData.data.id,
    name: formData.name
  }
  this.categoryService.update(data).subscribe({
    next: (response:any) => {
      this.dialogRef.close();
      this.onEditCategory.emit();
      this.responseMessage = response.message;
      this.snackbarService.openSnackbar(this.responseMessage,'success');
    },
    error: (error:any) => {
      this.dialogRef.close();
      console.error(error);
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
