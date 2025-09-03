import { Routes } from '@angular/router';
import { ParticipantForm } from './participant-form/participant-form';
import { ParticipantListComponent } from './participant-list/participant-list.component';
import { DashboardComponent } from './dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'participants', component: ParticipantListComponent },
  { path: 'add-participant', component: ParticipantForm },
  { path: 'dashboard', component: DashboardComponent }
];
