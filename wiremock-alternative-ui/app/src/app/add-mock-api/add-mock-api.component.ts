import { Component, OnInit, EventEmitter, Output, Input, Injector } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'; //_splitter_

export class MockApi {
  _id?: string;
  path: string = '';
  method: string;
  queryParams?: { [key: string]: any };
  requestBody?: any;
  response: {
    statusCode: number;
    headers?: { [key: string]: string };
    body: any;
    responseTemplate?: string;
  };
  responseTemplate?: string;
}
@Component({
  selector: 'app-add-mock-api',
  templateUrl: './add-mock-api.component.html',
  styleUrls: ['./add-mock-api.component.scss']
})
export class AddMockApiComponent implements OnInit {
  // mockApi: MockApi = new MockApi();
  @Input() mockApi;
  @Output() mockApiAdded = new EventEmitter<MockApi>();
  constructor(private __page_injector__: Injector,  public dialogRef: MatDialogRef<any>) {}

  ngOnInit(): void {
    this.mockApi = this.__page_injector__.get(MAT_DIALOG_DATA);
    if (!this.mockApi['edit']) {
      this.mockApi = {
        path: '',
        method: "GET",
        queryParams: "",
        requestBody: '',
        response: {
          statusCode: 200,
          headers: "",
          body: '',
          responseTemplate: '',
        },
        responseTemplate: '',
      }
    } else{
      this.mockApi.queryParams = this.mockApi.queryParams ? JSON.stringify(this.mockApi.queryParams) : "";
      this.mockApi.response.headers = this.mockApi.response.headers ? JSON.stringify(this.mockApi.response.headers) : "";
    }
    console.log(this.mockApi);
  }

  onSubmit() {
    if (this.mockApi.queryParams) {
      this.mockApi.queryParams = JSON.parse(this.mockApi.queryParams + '');
    }
    if (this.mockApi.response.headers) {
      this.mockApi.response.headers = JSON.parse(this.mockApi.response.headers + '');
    }
    this.close();
    this.mockApi = null;

  }


  close(){
    this.dialogRef.close(this.mockApi);
  }

 
}
