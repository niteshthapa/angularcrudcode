import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
@Injectable({
  providedIn: 'root'
})
export class StudentService {
url:string = "http://localhost:3000/posts";
  constructor(private http:HttpClient) { }

  fetchAllStudent(){
    return this.http.get(this.url)
  }
  addStudent(obj){
    return this.http.post(this.url,obj)
  }
  deleteStudent(id){
    return this.http.delete(`${this.url}/${id}`)
  }
  editStudent(obj){
    console.log(obj)
    console.log(`${this.url}/${obj.id}`)
    return this.http.put(`${this.url}/${obj.id}`,obj)
  }
}
