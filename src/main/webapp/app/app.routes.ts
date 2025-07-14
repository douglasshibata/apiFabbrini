import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PhonesListComponent } from './phones/phones-list.component';
import { PhonesAddComponent } from './phones/phones-add.component';
import { PhonesEditComponent } from './phones/phones-edit.component';
import { UserListComponent } from './user/user-list.component';
import { UserAddComponent } from './user/user-add.component';
import { UserEditComponent } from './user/user-edit.component';
import { AddressListComponent } from './address/address-list.component';
import { AddressAddComponent } from './address/address-add.component';
import { AddressEditComponent } from './address/address-edit.component';
import { RoleListComponent } from './role/role-list.component';
import { RoleAddComponent } from './role/role-add.component';
import { RoleEditComponent } from './role/role-edit.component';
import { DoctorListComponent } from './doctor/doctor-list.component';
import { DoctorAddComponent } from './doctor/doctor-add.component';
import { DoctorEditComponent } from './doctor/doctor-edit.component';
import { SpecialtyListComponent } from './specialty/specialty-list.component';
import { SpecialtyAddComponent } from './specialty/specialty-add.component';
import { SpecialtyEditComponent } from './specialty/specialty-edit.component';
import { HealthInsuranceListComponent } from './health-insurance/health-insurance-list.component';
import { HealthInsuranceAddComponent } from './health-insurance/health-insurance-add.component';
import { HealthInsuranceEditComponent } from './health-insurance/health-insurance-edit.component';
import { DocumentListComponent } from './document/document-list.component';
import { DocumentAddComponent } from './document/document-add.component';
import { DocumentEditComponent } from './document/document-edit.component';
import { PatientListComponent } from './patient/patient-list.component';
import { PatientAddComponent } from './patient/patient-add.component';
import { PatientEditComponent } from './patient/patient-edit.component';
import { ResponsibleListComponent } from './responsible/responsible-list.component';
import { ResponsibleAddComponent } from './responsible/responsible-add.component';
import { ResponsibleEditComponent } from './responsible/responsible-edit.component';
import { PasswordTokenListComponent } from './password-token/password-token-list.component';
import { PasswordTokenAddComponent } from './password-token/password-token-add.component';
import { PasswordTokenEditComponent } from './password-token/password-token-edit.component';
import { AlertListComponent } from './alert/alert-list.component';
import { AlertAddComponent } from './alert/alert-add.component';
import { AlertEditComponent } from './alert/alert-edit.component';
import { NewsletterListComponent } from './newsletter/newsletter-list.component';
import { NewsletterAddComponent } from './newsletter/newsletter-add.component';
import { NewsletterEditComponent } from './newsletter/newsletter-edit.component';
import { EmailsListComponent } from './emails/emails-list.component';
import { EmailsAddComponent } from './emails/emails-add.component';
import { EmailsEditComponent } from './emails/emails-edit.component';
import { ScheduleListComponent } from './schedule/schedule-list.component';
import { ScheduleAddComponent } from './schedule/schedule-add.component';
import { ScheduleEditComponent } from './schedule/schedule-edit.component';
import { MedicalRecordListComponent } from './medical-record/medical-record-list.component';
import { MedicalRecordAddComponent } from './medical-record/medical-record-add.component';
import { MedicalRecordEditComponent } from './medical-record/medical-record-edit.component';
import { DoctorsAvailableScheduleListComponent } from './doctors-available-schedule/doctors-available-schedule-list.component';
import { DoctorsAvailableScheduleAddComponent } from './doctors-available-schedule/doctors-available-schedule-add.component';
import { DoctorsAvailableScheduleEditComponent } from './doctors-available-schedule/doctors-available-schedule-edit.component';
import { ErrorComponent } from './error/error.component';


export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: $localize`:@@home.index.headline:Welcome to your new app!`
  },
  {
    path: 'phoness',
    component: PhonesListComponent,
    title: $localize`:@@phones.list.headline:Phoneses`
  },
  {
    path: 'phoness/add',
    component: PhonesAddComponent,
    title: $localize`:@@phones.add.headline:Add Phones`
  },
  {
    path: 'phoness/edit/:id',
    component: PhonesEditComponent,
    title: $localize`:@@phones.edit.headline:Edit Phones`
  },
  {
    path: 'users',
    component: UserListComponent,
    title: $localize`:@@user.list.headline:Users`
  },
  {
    path: 'users/add',
    component: UserAddComponent,
    title: $localize`:@@user.add.headline:Add User`
  },
  {
    path: 'users/edit/:id',
    component: UserEditComponent,
    title: $localize`:@@user.edit.headline:Edit User`
  },
  {
    path: 'addresses',
    component: AddressListComponent,
    title: $localize`:@@address.list.headline:Addresses`
  },
  {
    path: 'addresses/add',
    component: AddressAddComponent,
    title: $localize`:@@address.add.headline:Add Address`
  },
  {
    path: 'addresses/edit/:id',
    component: AddressEditComponent,
    title: $localize`:@@address.edit.headline:Edit Address`
  },
  {
    path: 'roles',
    component: RoleListComponent,
    title: $localize`:@@role.list.headline:Roles`
  },
  {
    path: 'roles/add',
    component: RoleAddComponent,
    title: $localize`:@@role.add.headline:Add Role`
  },
  {
    path: 'roles/edit/:id',
    component: RoleEditComponent,
    title: $localize`:@@role.edit.headline:Edit Role`
  },
  {
    path: 'doctors',
    component: DoctorListComponent,
    title: $localize`:@@doctor.list.headline:Doctors`
  },
  {
    path: 'doctors/add',
    component: DoctorAddComponent,
    title: $localize`:@@doctor.add.headline:Add Doctor`
  },
  {
    path: 'doctors/edit/:id',
    component: DoctorEditComponent,
    title: $localize`:@@doctor.edit.headline:Edit Doctor`
  },
  {
    path: 'specialties',
    component: SpecialtyListComponent,
    title: $localize`:@@specialty.list.headline:Specialties`
  },
  {
    path: 'specialties/add',
    component: SpecialtyAddComponent,
    title: $localize`:@@specialty.add.headline:Add Specialty`
  },
  {
    path: 'specialties/edit/:id',
    component: SpecialtyEditComponent,
    title: $localize`:@@specialty.edit.headline:Edit Specialty`
  },
  {
    path: 'healthInsurances',
    component: HealthInsuranceListComponent,
    title: $localize`:@@healthInsurance.list.headline:Health Insurances`
  },
  {
    path: 'healthInsurances/add',
    component: HealthInsuranceAddComponent,
    title: $localize`:@@healthInsurance.add.headline:Add Health Insurance`
  },
  {
    path: 'healthInsurances/edit/:id',
    component: HealthInsuranceEditComponent,
    title: $localize`:@@healthInsurance.edit.headline:Edit Health Insurance`
  },
  {
    path: 'documents',
    component: DocumentListComponent,
    title: $localize`:@@document.list.headline:Documents`
  },
  {
    path: 'documents/add',
    component: DocumentAddComponent,
    title: $localize`:@@document.add.headline:Add Document`
  },
  {
    path: 'documents/edit/:id',
    component: DocumentEditComponent,
    title: $localize`:@@document.edit.headline:Edit Document`
  },
  {
    path: 'patients',
    component: PatientListComponent,
    title: $localize`:@@patient.list.headline:Patients`
  },
  {
    path: 'patients/add',
    component: PatientAddComponent,
    title: $localize`:@@patient.add.headline:Add Patient`
  },
  {
    path: 'patients/edit/:id',
    component: PatientEditComponent,
    title: $localize`:@@patient.edit.headline:Edit Patient`
  },
  {
    path: 'responsibles',
    component: ResponsibleListComponent,
    title: $localize`:@@responsible.list.headline:Responsibles`
  },
  {
    path: 'responsibles/add',
    component: ResponsibleAddComponent,
    title: $localize`:@@responsible.add.headline:Add Responsible`
  },
  {
    path: 'responsibles/edit/:id',
    component: ResponsibleEditComponent,
    title: $localize`:@@responsible.edit.headline:Edit Responsible`
  },
  {
    path: 'passwordTokens',
    component: PasswordTokenListComponent,
    title: $localize`:@@passwordToken.list.headline:Password Tokens`
  },
  {
    path: 'passwordTokens/add',
    component: PasswordTokenAddComponent,
    title: $localize`:@@passwordToken.add.headline:Add Password Token`
  },
  {
    path: 'passwordTokens/edit/:id',
    component: PasswordTokenEditComponent,
    title: $localize`:@@passwordToken.edit.headline:Edit Password Token`
  },
  {
    path: 'alerts',
    component: AlertListComponent,
    title: $localize`:@@alert.list.headline:Alerts`
  },
  {
    path: 'alerts/add',
    component: AlertAddComponent,
    title: $localize`:@@alert.add.headline:Add Alert`
  },
  {
    path: 'alerts/edit/:id',
    component: AlertEditComponent,
    title: $localize`:@@alert.edit.headline:Edit Alert`
  },
  {
    path: 'newsletters',
    component: NewsletterListComponent,
    title: $localize`:@@newsletter.list.headline:Newsletters`
  },
  {
    path: 'newsletters/add',
    component: NewsletterAddComponent,
    title: $localize`:@@newsletter.add.headline:Add Newsletter`
  },
  {
    path: 'newsletters/edit/:id',
    component: NewsletterEditComponent,
    title: $localize`:@@newsletter.edit.headline:Edit Newsletter`
  },
  {
    path: 'emailss',
    component: EmailsListComponent,
    title: $localize`:@@emails.list.headline:Emailses`
  },
  {
    path: 'emailss/add',
    component: EmailsAddComponent,
    title: $localize`:@@emails.add.headline:Add Emails`
  },
  {
    path: 'emailss/edit/:id',
    component: EmailsEditComponent,
    title: $localize`:@@emails.edit.headline:Edit Emails`
  },
  {
    path: 'schedules',
    component: ScheduleListComponent,
    title: $localize`:@@schedule.list.headline:Schedules`
  },
  {
    path: 'schedules/add',
    component: ScheduleAddComponent,
    title: $localize`:@@schedule.add.headline:Add Schedule`
  },
  {
    path: 'schedules/edit/:id',
    component: ScheduleEditComponent,
    title: $localize`:@@schedule.edit.headline:Edit Schedule`
  },
  {
    path: 'medicalRecords',
    component: MedicalRecordListComponent,
    title: $localize`:@@medicalRecord.list.headline:Medical Records`
  },
  {
    path: 'medicalRecords/add',
    component: MedicalRecordAddComponent,
    title: $localize`:@@medicalRecord.add.headline:Add Medical Record`
  },
  {
    path: 'medicalRecords/edit/:id',
    component: MedicalRecordEditComponent,
    title: $localize`:@@medicalRecord.edit.headline:Edit Medical Record`
  },
  {
    path: 'doctorsAvailableSchedules',
    component: DoctorsAvailableScheduleListComponent,
    title: $localize`:@@doctorsAvailableSchedule.list.headline:Doctors Available Schedules`
  },
  {
    path: 'doctorsAvailableSchedules/add',
    component: DoctorsAvailableScheduleAddComponent,
    title: $localize`:@@doctorsAvailableSchedule.add.headline:Add Doctors Available Schedule`
  },
  {
    path: 'doctorsAvailableSchedules/edit/:id',
    component: DoctorsAvailableScheduleEditComponent,
    title: $localize`:@@doctorsAvailableSchedule.edit.headline:Edit Doctors Available Schedule`
  },
  {
    path: 'error',
    component: ErrorComponent,
    title: $localize`:@@error.page.headline:Error`
  },
  {
    path: '**',
    component: ErrorComponent,
    title: $localize`:@@notFound.headline:Page not found`
  }
];
