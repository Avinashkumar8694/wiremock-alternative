import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { appDeclarations, appBootstrap, appProviders } from './config/declarations';
import { appImportModules } from './config/import-modules';
import { HomeComponent } from './home/home.component';
import { AppListMockApisComponent } from './app-list-mock-apis/app-list-mock-apis.component';
import { AddMockApiComponent } from './add-mock-api/add-mock-api.component';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [...appDeclarations, HomeComponent, AppListMockApisComponent, AddMockApiComponent, LoginComponent],
  imports: [...appImportModules],
  providers: [...appProviders],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [...appBootstrap]
})
export class AppModule { }
