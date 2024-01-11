import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BillService } from 'src/app/services/bill.service';
import { ProductService } from 'src/app/services/product.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { SnackbarService } from 'src/app/snackbar.service';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';
import { saveAs } from 'file-saver';
import { ViewBillProductsComponent } from '../dialog/view-bill-products/view-bill-products.component';

@Component({
  selector: 'app-view-bill',
  templateUrl: './view-bill.component.html',
  styleUrls: ['./view-bill.component.scss']
})
export class ViewBillComponent implements OnInit {


  displayColumns: string[] = ['name', 'email', 'contactNumber', 'paymentMethod', 'total', 'view'];
  dataSource: any;
  responseMessage: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackbarService: SnackbarService,
    private ngxService: NgxUiLoaderService,
    private productService: ProductService,
    private dialog: MatDialog,
    private billService: BillService
  ) { }
  ngOnInit(): void {
    this.ngxService.start();
    this.tableData();
  }
  tableData() {
    this.billService.getBills().subscribe({
      next: (response: any) => {
        this.ngxService.stop();
        this.dataSource = new MatTableDataSource(response)
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  handleViewAction(values: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      data: values,
    };
    console.log(dialogConfig.data);

    dialogConfig.width = '100%';
    const dialogRef = this.dialog.open(ViewBillProductsComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });

  }
  handleDeleteAction(values: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: 'delete' + values.name + ' product',
      confirmation: true,
    };
    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((response) => {
      this.ngxService.start();
      this.deleteBill(values.id);
      dialogRef.close();
    });
  }
  deleteBill(id: any) {
    this.billService.delete(id).subscribe({
      next: (response: any) => {
        this.ngxService.stop();
        this.tableData();
        this.responseMessage = response?.message;
        this.snackbarService.openSnackbar(this.responseMessage, 'success');
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
  downloadReportAction(value: any) {
    this.ngxService.start();
    var data = {
      name: value.name,
      email: value.email,
      uuid: value.uuid,
      contactNumber: value.contactNumber,
      paymentMethod: value.paymentMethod,
      totalAmount: value.total.toString(),
      productDetail: value.productDetail
    };
    this.downloadFile(value.uuid, data)
  }

  downloadFile(fileName: string, data: any) {
    this.billService.getPdf(data).subscribe({
      next: (response: any) => {
        saveAs(response, fileName + '.pdf');
        this.ngxService.stop();
      }
    })
  }

}
