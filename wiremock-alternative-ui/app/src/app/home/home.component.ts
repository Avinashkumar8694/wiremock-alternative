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
  username: string = "username"
  // @ViewChild('addMockApiDialog') addMockApiDialog!: TemplateRef<any>;
  // @ViewChild('editMockApiDialog') editMockApiDialog!: TemplateRef<any>;
  constructor(private loginService: LoginService, private mockApiService: MockApiService, private dialog: MatDialog) {

  }

  ngOnInit(): void {
    this.fetchDomains();
  }

  getMockApis() {
    this.mockApiService.getMockApis().subscribe((mockApis: MockApi[]) => {
      this.mockApis = mockApis;
    });
  }

  openAddMockApiDialog(): void {
    const dialogRef = this.dialog.open(AddMockApiComponent, {
      data: { edit: false },
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
      data: { ...mockApi, edit: true },
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


  fetchDomains(): void {
    this.http.get<any[]>('http://api.127-0-0-1.nip.io:8888/domains').subscribe(
      (response) => {
        this.domains = response;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  deleteDomain(domainId: string): void {
    if (confirm('Are you sure you want to delete this domain?')) {
      const url = `http://api.127-0-0-1.nip.io:8888/domains/${domainId}`;
      this.http
        .delete(url)
        .subscribe(
          () => {
            this.fetchDomains();
          },
          (error) => {
            console.error(error);
          }
        );
    }
  }

  createNewAPI(): void {
    const currentDomain = window.location.hostname;
    const randomText = Math.random().toString(36).substring(7);

    const url = 'http://api.127-0-0-1.nip.io:8888/domain';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImF2aW5hc2hAZ21haWwuY29tIiwib3JnYW5pemF0aW9uIjoibmV1dHJpbm9zIiwiaWF0IjoxNjg4OTg2MDQxLCJleHAiOjE2ODg5ODY5NDF9.mhq21AvJAeBAXB-Z_EKhMC9bjVDLSdrcfwvGXC7a40g'
    });

    const body = {
      name: `${randomText}.${currentDomain}`,
      org: '6427bbb7c78044ec91c0e2a9' // Replace with the actual org ID from the logged-in user info
    };

    this.http.post(url, body, { headers }).subscribe(
      (response) => {
        console.log('New API created:', response);
        this.fetchDomains();
      },
      (error) => {
        console.error('Error creating new API:', error);
      }
    );
  }
}