import { Routes } from '@angular/router';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { AppointmentComponent } from './admin/appointment/appointment.component';


import { PatientsComponent } from './admin/patients/patients.component';
import { SpecialtiesComponent } from './admin/specialities/specialities.component';
import { LoginPageComponent } from './components/login/login.component';
import { DoctorDashboardComponent } from './doctor/doctor-dashboard/doctor-dashboard.component';
import { MyAppointmentComponent } from './doctor/my-appointment/my-appointment.component';
import { RoleGuard } from './services/role.guard';
import { DoctorsComponent } from './admin/doctors/doctors.component';
import { AuthGuard } from './services/auth.guard';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { RegistrationPageComponent } from './components/registration-page/registration-page.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { LandingpageComponent } from './components/landingpage/landingpage.component';

export const routes: Routes = [
   // Login route
   { path: '', component: LandingpageComponent},
  { 
    path: 'login', 
    component: LoginPageComponent, 
    canActivate: [AuthGuard],  // Protect the login route 
  },
  { 
    path: 'register', 
    component: RegistrationPageComponent, 
    canActivate: [AuthGuard],  // Protect the register route
    data: { redirectTo: 'landing' } 
  },  
    { path: 'forgot-password',component: ForgotPasswordComponent },// Forgot password page route
    { path: 'reset-password', component: ResetPasswordComponent },  // Reset password page route

  // { path: 'admin/specialties', component: SpecialtiesComponent },
  // Admin routes - Protected by RoleGuard with 'admin' role
  {
    path: 'admin', // Parent route for Admin
    canActivate: [RoleGuard],
    data: { roles: ['admin'] },
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'appointments', component: AppointmentComponent },
      { path: 'specialties', component: SpecialtiesComponent },
      { path: 'doctors', component: DoctorsComponent },
      { path: 'patients', component: PatientsComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, // Default route under admin
    ]
  },

  // Doctor routes - Protected by RoleGuard with 'doctor' role
  {
    path: 'doctor', // Parent route for Doctor
    canActivate: [RoleGuard],
    data: { roles: ['doctor'] },
    children: [
      { path: 'dashboard', component: DoctorDashboardComponent },
      { path: 'my-appointments', component: MyAppointmentComponent },
      { path: 'patients', component: PatientsComponent }, // Reusing Patients component
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, // Default route under doctor
    ]
  },

  // Fallback route for undefined paths
  { path: '**', redirectTo: '/login' },
];
