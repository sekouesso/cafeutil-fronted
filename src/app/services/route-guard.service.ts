import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import jwtDecode from 'jwt-decode';
import { GlobalConstants } from '../shared/global-constants';
import { SnackbarService } from '../snackbar.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RouteGuardService {

  constructor(
    public router: Router,
    public authService: AuthService,
    private snackbarService: SnackbarService
  ) { }

  canActivate(route:ActivatedRouteSnapshot):boolean{
    let expectedRoleArray = route.data;
    expectedRoleArray = expectedRoleArray['expectedRole'];

    const token:any = localStorage.getItem('token');

    var  tokenPayload:any;
    try {
      tokenPayload = jwtDecode(token);
    } catch (error) {
      localStorage.clear();
      this.router.navigate(['/']);
    }
    let expectedRole = '';
    for(let i=0; i<expectedRoleArray['length']; i++) {
      if(expectedRoleArray[i] ==tokenPayload.role){
        expectedRole = tokenPayload.role;
      }
    }
    if(tokenPayload.role == 'user' || tokenPayload.role == 'admin'){
      if(this.authService.isAuthenticated()) {
        return true;
      }
      this.snackbarService.openSnackbar(GlobalConstants.unauthorized,GlobalConstants.error);
      this.router.navigate(['/cafe/dashboard']);
      return false;
    }else{
      this.router.navigate(['/']);
      localStorage.clear();
      return false;
    }
  }
}
