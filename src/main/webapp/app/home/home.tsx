import React from 'react';
import { Link } from 'react-router';
import { Trans, useTranslation } from 'react-i18next';
import useDocumentTitle from 'app/common/use-document-title';
import './home.scss';


export default function Home() {
  const { t } = useTranslation();
  useDocumentTitle(t('home.index.headline'));

  return (<>
    <h1 className="mb-4">{t('home.index.headline')}</h1>
    <p><Trans i18nKey="home.index.text" components={{ a: <a />, strong: <strong /> }} /></p>
    <p className="mb-5">
      <span>{t('home.index.swagger.text')}</span>
      <span> </span>
      <a href={process.env.API_PATH + '/swagger-ui.html'} target="_blank">{t('home.index.swagger.link')}</a>.
    </p>
    <div className="col-md-4 mb-5">
      <h4 className="mb-3">{t('home.index.exploreEntities')}</h4>
      <div className="list-group">
        <Link to="/phoness" className="list-group-item list-group-item-action">{t('phones.list.headline')}</Link>
        <Link to="/users" className="list-group-item list-group-item-action">{t('user.list.headline')}</Link>
        <Link to="/addresses" className="list-group-item list-group-item-action">{t('address.list.headline')}</Link>
        <Link to="/roles" className="list-group-item list-group-item-action">{t('role.list.headline')}</Link>
        <Link to="/doctors" className="list-group-item list-group-item-action">{t('doctor.list.headline')}</Link>
        <Link to="/specialties" className="list-group-item list-group-item-action">{t('specialty.list.headline')}</Link>
        <Link to="/healthInsurances" className="list-group-item list-group-item-action">{t('healthInsurance.list.headline')}</Link>
        <Link to="/documents" className="list-group-item list-group-item-action">{t('document.list.headline')}</Link>
        <Link to="/patients" className="list-group-item list-group-item-action">{t('patient.list.headline')}</Link>
        <Link to="/responsibles" className="list-group-item list-group-item-action">{t('responsible.list.headline')}</Link>
        <Link to="/passwordTokens" className="list-group-item list-group-item-action">{t('passwordToken.list.headline')}</Link>
        <Link to="/alerts" className="list-group-item list-group-item-action">{t('alert.list.headline')}</Link>
        <Link to="/newsletters" className="list-group-item list-group-item-action">{t('newsletter.list.headline')}</Link>
        <Link to="/emailss" className="list-group-item list-group-item-action">{t('emails.list.headline')}</Link>
        <Link to="/schedules" className="list-group-item list-group-item-action">{t('schedule.list.headline')}</Link>
        <Link to="/medicalRecords" className="list-group-item list-group-item-action">{t('medicalRecord.list.headline')}</Link>
        <Link to="/doctorsAvailableSchedules" className="list-group-item list-group-item-action">{t('doctorsAvailableSchedule.list.headline')}</Link>
      </div>
    </div>
  </>);
}
