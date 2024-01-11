import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { SnackbarService } from 'src/app/snackbar.service';
import { ProductComponent } from '../product/product.component';

@Component({
  selector: 'app-view-bill-products',
  templateUrl: './view-bill-products.component.html',
  styleUrls: ['./view-bill-products.component.scss']
})
export class ViewBillProductsComponent implements OnInit {

  displayColumns: string[]=['name','category','price','quantity','total'];
  dataSource:any;
  data:any;
  responseMessage:any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData:any,
    private productService:ProductService,
    private categoryService:CategoryService,
    public dialogRef: MatDialogRef<ViewBillProductsComponent>,
    private snackbarService: SnackbarService,
    private fb: FormBuilder
  ){}

  ngOnInit() {
    this.data = this.dialogData.data;
    console.log(this.dialogData.data);
    console.log(this.data);
    this.dataSource = JSON.parse(this.dialogData.data.productDetail);
    console.log(this.dialogData.data);
    console.log(this.data);
    
  }
}
