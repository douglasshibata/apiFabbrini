import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router';
import App from "./app";
import Home from './home/home';
import PhonesList from './phones/phones-list';
import PhonesAdd from './phones/phones-add';
import PhonesEdit from './phones/phones-edit';
import UserList from './user/user-list';
import UserAdd from './user/user-add';
import UserEdit from './user/user-edit';
import AddressList from './address/address-list';
import AddressAdd from './address/address-add';
import AddressEdit from './address/address-edit';
import RoleList from './role/role-list';
import RoleAdd from './role/role-add';
import RoleEdit from './role/role-edit';
import DoctorList from './doctor/doctor-list';
import DoctorAdd from './doctor/doctor-add';
import DoctorEdit from './doctor/doctor-edit';
import SpecialtyList from './specialty/specialty-list';
import SpecialtyAdd from './specialty/specialty-add';
import SpecialtyEdit from './specialty/specialty-edit';
import HealthInsuranceList from './health-insurance/health-insurance-list';
import HealthInsuranceAdd from './health-insurance/health-insurance-add';
import HealthInsuranceEdit from './health-insurance/health-insurance-edit';
import DocumentList from './document/document-list';
import DocumentAdd from './document/document-add';
import DocumentEdit from './document/document-edit';
import PatientList from './patient/patient-list';
import PatientAdd from './patient/patient-add';
import PatientEdit from './patient/patient-edit';
import ResponsibleList from './responsible/responsible-list';
import ResponsibleAdd from './responsible/responsible-add';
import ResponsibleEdit from './responsible/responsible-edit';
import PasswordTokenList from './password-token/password-token-list';
import PasswordTokenAdd from './password-token/password-token-add';
import PasswordTokenEdit from './password-token/password-token-edit';
import AlertList from './alert/alert-list';
import AlertAdd from './alert/alert-add';
import AlertEdit from './alert/alert-edit';
import NewsletterList from './newsletter/newsletter-list';
import NewsletterAdd from './newsletter/newsletter-add';
import NewsletterEdit from './newsletter/newsletter-edit';
import EmailsList from './emails/emails-list';
import EmailsAdd from './emails/emails-add';
import EmailsEdit from './emails/emails-edit';
import ScheduleList from './schedule/schedule-list';
import ScheduleAdd from './schedule/schedule-add';
import ScheduleEdit from './schedule/schedule-edit';
import MedicalRecordList from './medical-record/medical-record-list';
import MedicalRecordAdd from './medical-record/medical-record-add';
import MedicalRecordEdit from './medical-record/medical-record-edit';
import DoctorsAvailableScheduleList from './doctors-available-schedule/doctors-available-schedule-list';
import DoctorsAvailableScheduleAdd from './doctors-available-schedule/doctors-available-schedule-add';
import DoctorsAvailableScheduleEdit from './doctors-available-schedule/doctors-available-schedule-edit';
import Error from './error/error';


export default function AppRoutes() {
  const router = createBrowserRouter([
    {
      element: <App />,
      children: [
        { path: '', element: <Home /> },
        { path: 'phoness', element: <PhonesList /> },
        { path: 'phoness/add', element: <PhonesAdd /> },
        { path: 'phoness/edit/:id', element: <PhonesEdit /> },
        { path: 'users', element: <UserList /> },
        { path: 'users/add', element: <UserAdd /> },
        { path: 'users/edit/:id', element: <UserEdit /> },
        { path: 'addresses', element: <AddressList /> },
        { path: 'addresses/add', element: <AddressAdd /> },
        { path: 'addresses/edit/:id', element: <AddressEdit /> },
        { path: 'roles', element: <RoleList /> },
        { path: 'roles/add', element: <RoleAdd /> },
        { path: 'roles/edit/:id', element: <RoleEdit /> },
        { path: 'doctors', element: <DoctorList /> },
        { path: 'doctors/add', element: <DoctorAdd /> },
        { path: 'doctors/edit/:id', element: <DoctorEdit /> },
        { path: 'specialties', element: <SpecialtyList /> },
        { path: 'specialties/add', element: <SpecialtyAdd /> },
        { path: 'specialties/edit/:id', element: <SpecialtyEdit /> },
        { path: 'healthInsurances', element: <HealthInsuranceList /> },
        { path: 'healthInsurances/add', element: <HealthInsuranceAdd /> },
        { path: 'healthInsurances/edit/:id', element: <HealthInsuranceEdit /> },
        { path: 'documents', element: <DocumentList /> },
        { path: 'documents/add', element: <DocumentAdd /> },
        { path: 'documents/edit/:id', element: <DocumentEdit /> },
        { path: 'patients', element: <PatientList /> },
        { path: 'patients/add', element: <PatientAdd /> },
        { path: 'patients/edit/:id', element: <PatientEdit /> },
        { path: 'responsibles', element: <ResponsibleList /> },
        { path: 'responsibles/add', element: <ResponsibleAdd /> },
        { path: 'responsibles/edit/:id', element: <ResponsibleEdit /> },
        { path: 'passwordTokens', element: <PasswordTokenList /> },
        { path: 'passwordTokens/add', element: <PasswordTokenAdd /> },
        { path: 'passwordTokens/edit/:id', element: <PasswordTokenEdit /> },
        { path: 'alerts', element: <AlertList /> },
        { path: 'alerts/add', element: <AlertAdd /> },
        { path: 'alerts/edit/:id', element: <AlertEdit /> },
        { path: 'newsletters', element: <NewsletterList /> },
        { path: 'newsletters/add', element: <NewsletterAdd /> },
        { path: 'newsletters/edit/:id', element: <NewsletterEdit /> },
        { path: 'emailss', element: <EmailsList /> },
        { path: 'emailss/add', element: <EmailsAdd /> },
        { path: 'emailss/edit/:id', element: <EmailsEdit /> },
        { path: 'schedules', element: <ScheduleList /> },
        { path: 'schedules/add', element: <ScheduleAdd /> },
        { path: 'schedules/edit/:id', element: <ScheduleEdit /> },
        { path: 'medicalRecords', element: <MedicalRecordList /> },
        { path: 'medicalRecords/add', element: <MedicalRecordAdd /> },
        { path: 'medicalRecords/edit/:id', element: <MedicalRecordEdit /> },
        { path: 'doctorsAvailableSchedules', element: <DoctorsAvailableScheduleList /> },
        { path: 'doctorsAvailableSchedules/add', element: <DoctorsAvailableScheduleAdd /> },
        { path: 'doctorsAvailableSchedules/edit/:id', element: <DoctorsAvailableScheduleEdit /> },
        { path: 'error', element: <Error /> },
        { path: '*', element: <Error /> }
      ]
    }
  ]);

  return (
    <RouterProvider router={router} />
  );
}
