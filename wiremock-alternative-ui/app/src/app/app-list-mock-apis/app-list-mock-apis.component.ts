import { Component, OnInit } from '@angular/core';
import { MockApiService } from '../mock-api.service';
import { MockApi } from '../add-mock-api/add-mock-api.component';

@Component({
  selector: 'app-list-mock-apis',
  templateUrl: './app-list-mock-apis.component.html',
  styleUrls: ['./app-list-mock-apis.component.scss']
})
export class AppListMockApisComponent implements OnInit {
  mockApis: MockApi[] = [];

  constructor(private mockApiService: MockApiService) { }

  ngOnInit() {
    this.loadMockApis();
  }

  loadMockApis() {
    this.mockApiService.getMockApis().subscribe(
      data => {
        this.mockApis = data;
      },
      error => {
        console.log('Error loading mock APIs', error);
      }
    );
  }

  editMockApi(mockApi: MockApi) {
    console.log('Edit mock API', mockApi);
  }

  deleteMockApi(mockApi: MockApi) {
    console.log('Delete mock API', mockApi);
  }
}
