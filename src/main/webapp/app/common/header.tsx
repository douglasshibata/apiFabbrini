import React from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';


export default function Header() {
  const { t } = useTranslation();

  return (
    <header className="bg-light">
      <div className="container">
        <nav className="navbar navbar-light navbar-expand-md">
          <Link to="/" className="navbar-brand">
            <img src="/images/logo.png" alt={t('app.title')} width="100%" height="30" className="d-inline-block align-top" />
            {/* <span className="ps-1">{t('app.title')}</span> */}
          </Link>
          <button type="button" className="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#navbarToggle"
              aria-label={t('navigation.toggle')} aria-controls="navbarToggle" aria-expanded="false">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarToggle">
            <ul className="navbar-nav ms-auto">
              <li className="navbar-item">
                <Link to="/" className="nav-link">{t('navigation.home')}</Link>
              </li>
              <li className="navbar-item dropdown">
                <button type="button" className="nav-link dropdown-toggle" data-bs-toggle="dropdown" id="navbarEntitiesLink"
                    aria-expanded="false">{t('navigation.entities')}</button>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarEntitiesLink">
                  <li><Link to="/phoness" className="dropdown-item">{t('phones.list.headline')}</Link></li>
                  <li><Link to="/users" className="dropdown-item">{t('user.list.headline')}</Link></li>
                  <li><Link to="/addresses" className="dropdown-item">{t('address.list.headline')}</Link></li>
                  <li><Link to="/roles" className="dropdown-item">{t('role.list.headline')}</Link></li>
                  <li><Link to="/doctors" className="dropdown-item">{t('doctor.list.headline')}</Link></li>
                  <li><Link to="/specialties" className="dropdown-item">{t('specialty.list.headline')}</Link></li>
                  <li><Link to="/healthInsurances" className="dropdown-item">{t('healthInsurance.list.headline')}</Link></li>
                  <li><Link to="/documents" className="dropdown-item">{t('document.list.headline')}</Link></li>
                  <li><Link to="/patients" className="dropdown-item">{t('patient.list.headline')}</Link></li>
                  <li><Link to="/responsibles" className="dropdown-item">{t('responsible.list.headline')}</Link></li>
                  <li><Link to="/passwordTokens" className="dropdown-item">{t('passwordToken.list.headline')}</Link></li>
                  <li><Link to="/alerts" className="dropdown-item">{t('alert.list.headline')}</Link></li>
                  <li><Link to="/newsletters" className="dropdown-item">{t('newsletter.list.headline')}</Link></li>
                  <li><Link to="/emailss" className="dropdown-item">{t('emails.list.headline')}</Link></li>
                  <li><Link to="/schedules" className="dropdown-item">{t('schedule.list.headline')}</Link></li>
                  <li><Link to="/medicalRecords" className="dropdown-item">{t('medicalRecord.list.headline')}</Link></li>
                  <li><Link to="/doctorsAvailableSchedules" className="dropdown-item">{t('doctorsAvailableSchedule.list.headline')}</Link></li>
                </ul>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
}
