import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/snackbar.service';
import { ProductService } from 'src/app/services/product.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent  implements OnInit {

  onAddProduct = new EventEmitter();
  onEditProduct = new EventEmitter();
  productForm:any = FormGroup;
  dialogAction:any = 'Add';
  action:any = 'Add';
  responseMessage:any ;
  categories:any

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData:any,
    private productService:ProductService,
    private categoryService:CategoryService,
    public dialogRef: MatDialogRef<ProductComponent>,
    private snackbarService: SnackbarService,
    private fb: FormBuilder
  ){}
  ngOnInit(): void {
    this.productForm = this.fb.group({
      name: [null,[Validators.required,Validators.pattern(GlobalConstants.nameRegex)]],
      categoryId: [null,[Validators.required]],
      price: [null,[Validators.required]],
      description: [null,[Validators.required]]
    });
    if(this.dialogData.action === 'Edit'){
      this.dialogAction = 'Edit';
      this.action = 'Update';
      this.productForm.patchValue(this.dialogData.data);
    }
    
    this.getCategories();
  }

  getCategories(){
    this.categoryService.getCategory().subscribe({
      next:(response:any) => {
        this.categories = response
      },
      error:(error:any) => {
        console.log(error);
        if(error.error?.message){
          this.responseMessage = error.error?.message;
        }else {
          this.responseMessage = GlobalConstants.generisError;
        }
        this.snackbarService.openSnackbar(this.responseMessage,GlobalConstants.error)
        
      }
    })
  }


handleSubmit(){
  if(this.dialogAction === 'Edit'){
    this.edit();
  }else{
    this.add();
  }
}
add(){
  var formData = this.productForm.value;
  var data = {
    name: formData.name,
    categoryId: formData.categoryId,
    price: formData.price,
    description: formData.description
  }
  this.productService.add(data).subscribe({
    next: (response:any) => {
      this.dialogRef.close();
      this.onAddProduct.emit();
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
  var formData = this.productForm.value;
  var data = {
    id: this.dialogData.data.id,
    name: formData.name,
    categoryId: formData.categoryId,
    price: formData.price,
    description: formData.description
  }
  this.productService.update(data).subscribe({
    next: (response:any) => {
      this.dialogRef.close();
      this.onEditProduct.emit();
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
