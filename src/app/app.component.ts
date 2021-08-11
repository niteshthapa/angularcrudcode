import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, AbstractControl, Validators } from '@angular/forms';
import { StudentService } from "./service/student.service";
import { Student } from "./model/student.model";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  openModal: boolean = false;
  confirmModal: boolean = false;
  isFormSubmit: boolean = false;
  isEdit: boolean = false;
  students: Student[];
  updatedId: number;
  deletetId: number;
  constructor(private studentService: StudentService) {
  }
  validateForm = new FormGroup({
    name: new FormControl('', Validators.required),
    grade: new FormControl('Select', this.DropdownSelectValidation('Select')),
    gender: new FormControl('Select', this.DropdownSelectValidation('Select')),
    phone: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email])
  });
  DropdownSelectValidation(validationValue: string) {
    return (control: AbstractControl) => {
      if (control.value === validationValue) {
        return { required: true };
      } else {
        return null;
      }
    };
  }
  ngOnInit() {
    this.getAllStudent();
  }
  getAllStudent() {
    this.studentService.fetchAllStudent().subscribe((data: Student[]) => {
      this.students = data;
    }, (error) => {
      console.log(error)
    })
  }
  delete(id: number) {
    this.studentService.deleteStudent(id).subscribe(() => {
      this.getAllStudent();
    }, (error) => {
      console.log(error)
    })
    this.confirmModal = false;
  }
  confirmOpen(id: number) {
    this.deletetId = id;
    this.confirmModal = true;
  }
  confirmClose() {
    this.deletetId;
    this.confirmModal = false;
  }
  showModal() {
    this.openModal = true;
    this.isEdit = false;
    this.isFormSubmit = false;
  }
  closeModal() {
    this.openModal = false;
    this.isEdit = false;
    this.validateForm.patchValue({
      name: "",
      grade: "Select",
      gender: "Select",
      phone: "",
      email: "",
    })
    this.isFormSubmit = false;
  }
  get f() { return this.validateForm['controls']; }
  editModal(obj) {
    this.openModal = true;
    this.isEdit = true;
    this.validateForm.patchValue({
      name: obj.name,
      grade: obj.grade,
      gender: obj.gender,
      phone: obj.phone,
      email: obj.email
    })
    this.updatedId = obj.id;
  }
  onSubmit() {
    this.isFormSubmit = true;
    console.log(this.validateForm)
    if (this.validateForm.valid && this.isEdit) {
      this.studentService.editStudent({ ...this.validateForm.value, id: this.updatedId }).subscribe(() => {
        this.getAllStudent();
        this.closeModal();

      }, (error) => {
        console.log(error)
      })
    }
    else if (this.validateForm.valid) {
      this.studentService.addStudent(this.validateForm.value).subscribe(() => {
        this.getAllStudent();
        this.closeModal()
      }, (error) => {
        console.log(error)
      })
    }
    else {
      console.log("error")
    }
  }
}
