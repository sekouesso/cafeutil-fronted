import { Component, AfterViewInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DashboardService } from '../services/dashboard.service';
import { GlobalConstants } from '../shared/global-constants';
import { SnackbarService } from '../snackbar.service';
@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements AfterViewInit {

	responseMessage:any;
	data:any;

	ngAfterViewInit() { }

	constructor(
		private dashboardService:DashboardService,
		private ngxService: NgxUiLoaderService,
		private snackbarService: SnackbarService
	) {
			this.ngxService.start();
			this.dashboardData();
	}
	dashboardData() {
		this.dashboardService.getDetails().subscribe({
			next: (response:any) => {
				this.ngxService.stop();
				this.data = response;
			},
			error: (error:any) => {
				this.ngxService.stop();
				console.log(error);
				if(error.error?.message){
					this.responseMessage = error.error?.message;
				}else{
					this.responseMessage = GlobalConstants.generisError;
				}
				this.snackbarService.openSnackbar(this.responseMessage,GlobalConstants.error);
			}
		});
	}

}
