import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BillService } from 'src/app/services/bill.service';
import { ProductService } from 'src/app/services/product.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { SnackbarService } from 'src/app/snackbar.service';
import { UserService } from 'src/app/user.service';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss']
})
export class ManageUsersComponent implements OnInit {

  displayColumns: string[] = ['name', 'email', 'contactNumber', 'status'];
  dataSource: any;
  responseMessage: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackbarService: SnackbarService,
    private ngxService: NgxUiLoaderService,
    private productService: ProductService,
    private dialog: MatDialog,
    private userService: UserService
  ) { }
  ngOnInit(): void {
    this.ngxService.start();
    this.tableData();
  }
  tableData() {
    this.userService.getUsers().subscribe({next:(response:any)=>{
      this.ngxService.stop();
      this.dataSource = new MatTableDataSource(response)
    },
    error:(error:any)=>{
      this.ngxService.stop();
      console.log(error.error?.message);
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }else {
        this.responseMessage = GlobalConstants.generisError;
      }
      this.snackbarService.openSnackbar(this.responseMessage,GlobalConstants.error)
    }
  });
  }

  applyFilter(event:Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onChange(status: any,id:any) {
    this.ngxService.start();
    var data = {
      status: status.toString(),
      id:id
    }
    this.userService.update(data).subscribe({next:(response:any)=>{
      this.ngxService.stop();
      this.tableData();
      this.responseMessage = response?.message;
      this.snackbarService.openSnackbar(this.responseMessage,'success');
    },
    error:(error:any)=>{
      this.ngxService.stop();
      console.log(error.error?.message);
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }else {
        this.responseMessage = GlobalConstants.generisError;
      }
      this.snackbarService.openSnackbar(this.responseMessage,GlobalConstants.error)
    }
  });
    }

}
