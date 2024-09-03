import { Component, ElementRef, inject, OnInit, ViewChild, viewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Employee } from '../../Models/employee';
import { EmployeeService } from '../../Services/employee.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css'
})
export class EmployeeComponent implements OnInit {

  @ViewChild('myModal') model: ElementRef | undefined;
  employeeList: Employee[] = [];
  employeeForm: FormGroup = new FormGroup([]);
  empService = inject(EmployeeService);
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.setFormState();
    this.getEmployees();
  }

  openModal() {
    const empModal = document.getElementById('myModal')
    if (empModal != null) {
      empModal.style.display = 'block'
    }
  }
  closeModal() {
    this.setFormState();

    if (this.model != null) {
      this.model.nativeElement.style.display = 'none';
    }
  }

  getEmployees() {
    this.empService.getAllEmployee().subscribe((res) => {
      this.employeeList = res;
    })
  }

  setFormState() {
    this.employeeForm = this.fb.group({
      id: [0],
      name: ['', [Validators.required]],
      email: ['', [Validators.required]],
      mobile: ['', [Validators.required]],
      age: ['', [Validators.required]],
      salary: ['', [Validators.required]],
      status: ['', [Validators.required]]

    });
  }
  formValues: any;
  onSubmit() {
    console.log(this.employeeForm);
    if (this.employeeForm.invalid) {
      alert('Please fill all fields.')
      return;
    }
    if(this.employeeForm.value.id == 0){
      
      this.formValues = this.employeeForm.value;
      this.empService.addEmployee(this.formValues).subscribe((res) => {
        alert('Employee added successfully.');
        this.getEmployees();
        this.employeeForm.reset();
        this.closeModal();
      })
    }else{
      this.formValues = this.employeeForm.value;
      this.empService.updateEmployee(this.formValues).subscribe((res) => {
        alert(this.employeeForm.value.name + ' updated successfully.');
        this.getEmployees();
        this.employeeForm.reset();
        this.closeModal();
      })
    }

  }

onEdit(Employee : Employee){
  this.openModal(); 
  this.employeeForm.patchValue(Employee);
}

 onDelete(employee:Employee) {
  const isConfirm = confirm("Are you sure to delete employee: " + employee.name)
  if(isConfirm){

    this.empService.deleteEmployee(employee.id).subscribe((res)=> {
      alert(employee.name + " deleted successfully.");
      this.getEmployees();
    });
  }
}

}
