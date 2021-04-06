import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from '../../angular-material.module';

import { LandingRoutingModule } from './landing-routing.module';
import { LandingComponent } from './landing.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

@NgModule({
  imports: [
    CommonModule,
    LandingRoutingModule,
    AngularMaterialModule
  ],
  declarations: [
    LandingComponent,
    SidebarComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LandingModule { }
