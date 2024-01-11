import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BillService } from 'src/app/services/bill.service';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { SnackbarService } from 'src/app/snackbar.service';

@Component({
  selector: 'app-manage-order',
  templateUrl: './manage-order.component.html',
  styleUrls: ['./manage-order.component.scss']
})
export class ManageOrderComponent implements OnInit {
  displayColumns: string[] = ['name', 'category', 'price', 'quantity', 'total', 'edit'];
  dataSource: any = [];
  manageOrderForm: any = FormGroup;
  categorys: any = [];
  products: any = [];
  price: any;
  totalAmount: number = 0;
  responseMessage: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackbarService: SnackbarService,
    private ngxService: NgxUiLoaderService,
    private productService: ProductService,
    private categoryService: CategoryService,
    private billService: BillService,
    private dialog: MatDialog
  ) { }
  ngOnInit(): void {
    this.ngxService.start();
    this.getCategorys();
    this.manageOrderForm = this.fb.group({
      name: [null, [Validators.required, Validators.pattern(GlobalConstants.nameRegex)]],
      email: [null, [Validators.required, Validators.pattern(GlobalConstants.emailRegex)]],
      contactNumber: [null, [Validators.required, Validators.pattern(GlobalConstants.contactNumberRegex)]],
      category: [null, [Validators.required]],
      product: [null, [Validators.required]],
      paymentMethod: [null, [Validators.required]],
      price: [null, [Validators.required]],
      quantity: [null, [Validators.required]],
      total: [null, [Validators.required]],
    });
  }
  getCategorys() {
    this.categoryService.getFilterCategory().subscribe({
      next: (response: any) => {
        this.ngxService.stop();
        this.categorys = response;
      },
      error: (error: any) => {
        this.ngxService.stop();
        console.log(error.error?.message);
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstants.generisError;
        }
        this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error)
      }
    })
  }

  getProductByCategory(value: any) {
    this.productService.getProductByCategory(value.id).subscribe({
      next: (data: any) => {
        this.products = data;
        this.manageOrderForm.controls['price'].setValue('');
        this.manageOrderForm.controls['quantity'].setValue('');
        this.manageOrderForm.controls['total'].setValue('');
      },
      error: (error: any) => {
        this.ngxService.stop();
        console.log(error.error?.message);
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstants.generisError;
        }
        this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error)
      }
    });
  }

  getProductDetails(value: any) {
    this.productService.getById(value.id).subscribe({
      next: (response: any) => {
        this.price = response.price;
        this.manageOrderForm.controls['price'].setValue(this.price);
        this.manageOrderForm.controls['quantity'].setValue('1');
        this.manageOrderForm.controls['total'].setValue(this.price * 1);
      },
      error: (error: any) => {
        this.ngxService.stop();
        console.log(error.error?.message);
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstants.generisError;
        }
        this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error)
      }
    });
  }

  setQuantity(value: any) {
    let temp = this.manageOrderForm.controls['quantity'].value;
    if (temp > 0) {
      this.manageOrderForm.controls['total'].setValue(this.manageOrderForm.controls['quantity'].value * this.manageOrderForm.controls['price'].value);
    } else if (temp != '') {
      this.manageOrderForm.controls['quantity'].setValue('1');
      this.manageOrderForm.controls['total'].setValue(this.manageOrderForm.controls['quantity'].value * this.manageOrderForm.controls['quantity'].value);
    }
  }

  validateProductAdd() {
    if (this.manageOrderForm.controls['total'].value === 0 || this.manageOrderForm.controls['total'] === null || this.manageOrderForm.controls['quantity'].value <= 0) {
      return true;
    } else {
      return false;
    }
  }

  validateSubmit() {
    if (this.totalAmount === 0 || this.manageOrderForm.controls['name'].value === null || this.manageOrderForm.controls['email'].value === null || this.manageOrderForm.controls['contactNumber'].value === null || this.manageOrderForm.controls['paymentMethod'].value === null) {
      return true;
    } else {
      return false;
    }
  }

  add() {
    var formData = this.manageOrderForm.value;
    var productName = this.dataSource.find((e: { id: number }) => e.id === formData.product.id);
    if (productName === undefined) {
      this.totalAmount = this.totalAmount + formData.total;
      this.dataSource.push({
        id: formData.product.id,
        name: formData.product.name,
        category: formData.category.name,
        quantity: formData.quantity,
        price: formData.price,
        total: formData.total,
      });
      console.log(this.dataSource);
      
      this.dataSource = [...this.dataSource];
      this.snackbarService.openSnackbar(GlobalConstants.productAdded, 'success');
    } else {
      this.snackbarService.openSnackbar(GlobalConstants.productExistsError, GlobalConstants.error);
    }
  }

  handleDeleteAction(value: any, elment: any) {
    this.totalAmount = this.totalAmount - elment.total;
    this.dataSource.splice(value, 1);
    this.dataSource = [...this.dataSource];
  }

  submitAction() {
    var formData = this.manageOrderForm.value;
    var data = {
      name: formData.name,
      email: formData.email,
      contactNumber: formData.contactNumber,
      paymentMethod: formData.paymentMethod,
      totalAmount: this.totalAmount.toString(),
      productDetails: JSON.stringify(this.dataSource)
    }

    this.ngxService.start();
    this.billService.generateReport(data).subscribe({
      next: (response: any) => {
        this.downloadFile(response?.uuid);
        this.manageOrderForm.reset();
        this.dataSource = [];
        this.totalAmount = 0;

      },
      error: (error: any) => {
        this.ngxService.stop();
        console.log(error.error?.message);
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstants.generisError;
        }
        this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error)
      }
    })
  }
  downloadFile(fileName: string) {
    var data = {
      uuid: fileName
    }
    this.billService.getPdf(data).subscribe({
      next:(response: any)=>{
        saveAs(response,fileName +'.pdf');
        this.ngxService.stop();
      }
    })
  }

}
