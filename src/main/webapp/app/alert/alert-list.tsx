import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';
import { handleServerError } from 'app/common/utils';
import { AlertDTO } from 'app/alert/alert-model';
import axios from 'axios';
import useDocumentTitle from 'app/common/use-document-title';


export default function AlertList() {
  const { t } = useTranslation();
  useDocumentTitle(t('alert.list.headline'));

  const [alerts, setAlerts] = useState<AlertDTO[]>([]);
  const navigate = useNavigate();

  const getAllAlerts = async () => {
    try {
      const response = await axios.get('/api/alerts');
      setAlerts(response.data);
    } catch (error: any) {
      handleServerError(error, navigate);
    }
  };

  const confirmDelete = async (id: number) => {
    if (!confirm(t('delete.confirm'))) {
      return;
    }
    try {
      await axios.delete('/api/alerts/' + id);
      navigate('/alerts', {
            state: {
              msgInfo: t('alert.delete.success')
            }
          });
      getAllAlerts();
    } catch (error: any) {
      handleServerError(error, navigate);
    }
  };

  useEffect(() => {
    getAllAlerts();
  }, []);

  return (<>
    <div className="d-flex flex-wrap mb-4">
      <h1 className="flex-grow-1">{t('alert.list.headline')}</h1>
      <div>
        <Link to="/alerts/add" className="btn btn-primary ms-2">{t('alert.list.createNew')}</Link>
      </div>
    </div>
    {!alerts || alerts.length === 0 ? (
    <div>{t('alert.list.empty')}</div>
    ) : (
    <div className="table-responsive">
      <table className="table table-striped table-hover align-middle">
        <thead>
          <tr>
            <th scope="col">{t('alert.id.label')}</th>
            <th scope="col">{t('alert.expirationTime.label')}</th>
            <th scope="col">{t('alert.active.label')}</th>
            <th scope="col">{t('alert.alertType.label')}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {alerts.map((alert) => (
          <tr key={alert.id}>
            <td>{alert.id}</td>
            <td>{alert.expirationTime}</td>
            <td>{alert.active?.toString()}</td>
            <td>{alert.alertType}</td>
            <td>
              <div className="float-end text-nowrap">
                <Link to={'/alerts/edit/' + alert.id} className="btn btn-sm btn-secondary">{t('alert.list.edit')}</Link>
                <span> </span>
                <button type="button" onClick={() => confirmDelete(alert.id!)} className="btn btn-sm btn-secondary">{t('alert.list.delete')}</button>
              </div>
            </td>
          </tr>
          ))}
        </tbody>
      </table>
    </div>
    )}
  </>);
}
