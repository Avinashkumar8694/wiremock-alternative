import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { LoginService } from "../login.service";
import { environment } from "../../environments/environment";
import { MockApi } from '../add-mock-api/add-mock-api.component';
import { AddMockApiComponent } from '../add-mock-api/add-mock-api.component';
import { MockApiService } from '../mock-api.service';
import { MatDialog } from "@angular/material/dialog";
@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  mockApis: MockApi[] = [];
  // @ViewChild('addMockApiDialog') addMockApiDialog!: TemplateRef<any>;
  // @ViewChild('editMockApiDialog') editMockApiDialog!: TemplateRef<any>;
  constructor(private loginService: LoginService, private mockApiService: MockApiService, private dialog: MatDialog) {
    
  }

  ngOnInit(): void {
    this.getMockApis();
  }
  
  getMockApis(){
    this.mockApiService.getMockApis().subscribe((mockApis: MockApi[]) => {
      this.mockApis = mockApis;
    });
  }

  openAddMockApiDialog(): void {
    const dialogRef = this.dialog.open(AddMockApiComponent,{
      data: {edit: false },
      hasBackdrop: true,
      height: '70vh',
      width: '50vw',
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Add Mock API dialog closed: ${result}`);
      this.mockApiService.addMockApi(result).subscribe(result => {
        this.getMockApis();
      });
    });
  }

  closeAddMockApiDialog(): void {
    this.dialog.closeAll();
  }

  onMockApiAdded(mockApi: MockApi): void {
    this.mockApis.push(mockApi);
    this.closeAddMockApiDialog();
  }

  openEditMockApiDialog(mockApi: MockApi): void {
    const dialogRef = this.dialog.open(AddMockApiComponent, {
      data: {...mockApi, edit: true},
      hasBackdrop: true,
      height: '70vh',
      width: '50vw',
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Edit Mock API dialog closed: ${result}`);
      this.mockApiService.updateMockApi(result).subscribe(result => {
        this.getMockApis();
      });
    });
  }

  deleteMockApi(mockApi: MockApi): void {
    if (confirm(`Are you sure you want to delete mock API with ID ${mockApi._id}?`)) {
      this.mockApiService.deleteMockApi(mockApi._id).subscribe(() => {
        this.mockApis = this.mockApis.filter(m => m._id !== mockApi._id);
      });
    }
  }
}
