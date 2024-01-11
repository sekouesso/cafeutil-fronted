import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  url = environment.apiUrl
  constructor(
    private http: HttpClient
  ) { }

  add(data:any){
    return this.http.post(this.url+'/product/add',data,{
      headers:new HttpHeaders().set("Content-Type","Application/json")})
  }

  update(data:any){
    return this.http.post(this.url+'/product/update',data,{
      headers:new HttpHeaders().set("Content-Type","Application/json")})
  }

  updateStatus(data:any){
    return this.http.post(this.url+'/product/updateStatus',data,{
      headers:new HttpHeaders().set("Content-Type","Application/json")})
  }

  getProducts(){
    return this.http.get(this.url+'/product/get');
  }

  delete(id:any){
    return this.http.post(this.url+'/product/delete/'+id,{
      headers:new HttpHeaders().set("Content-Type","Application/json")})
  }

  getProductByCategory(id:any){
    return this.http.get(this.url+'/product/getByCategory/'+id);
  }

  getById(id:any){
    return this.http.get(this.url+'/product/getById/'+id);
  }
}
