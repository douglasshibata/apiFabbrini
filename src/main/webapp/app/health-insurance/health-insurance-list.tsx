import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';
import { handleServerError } from 'app/common/utils';
import { HealthInsuranceDTO } from 'app/health-insurance/health-insurance-model';
import axios from 'axios';
import useDocumentTitle from 'app/common/use-document-title';


export default function HealthInsuranceList() {
  const { t } = useTranslation();
  useDocumentTitle(t('healthInsurance.list.headline'));

  const [healthInsurances, setHealthInsurances] = useState<HealthInsuranceDTO[]>([]);
  const navigate = useNavigate();

  const getAllHealthInsurances = async () => {
    try {
      const response = await axios.get('/api/healthInsurances');
      setHealthInsurances(response.data);
    } catch (error: any) {
      handleServerError(error, navigate);
    }
  };

  const confirmDelete = async (id: number) => {
    if (!confirm(t('delete.confirm'))) {
      return;
    }
    try {
      await axios.delete('/api/healthInsurances/' + id);
      navigate('/healthInsurances', {
            state: {
              msgInfo: t('healthInsurance.delete.success')
            }
          });
      getAllHealthInsurances();
    } catch (error: any) {
      handleServerError(error, navigate);
    }
  };

  useEffect(() => {
    getAllHealthInsurances();
  }, []);

  return (<>
    <div className="d-flex flex-wrap mb-4">
      <h1 className="flex-grow-1">{t('healthInsurance.list.headline')}</h1>
      <div>
        <Link to="/healthInsurances/add" className="btn btn-primary ms-2">{t('healthInsurance.list.createNew')}</Link>
      </div>
    </div>
    {!healthInsurances || healthInsurances.length === 0 ? (
    <div>{t('healthInsurance.list.empty')}</div>
    ) : (
    <div className="table-responsive">
      <table className="table table-striped table-hover align-middle">
        <thead>
          <tr>
            <th scope="col">{t('healthInsurance.id.label')}</th>
            <th scope="col">{t('healthInsurance.number.label')}</th>
            <th scope="col">{t('healthInsurance.type.label')}</th>
            <th scope="col">{t('healthInsurance.plan.label')}</th>
            <th scope="col">{t('healthInsurance.carrier.label')}</th>
            <th scope="col">{t('healthInsurance.active.label')}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {healthInsurances.map((healthInsurance) => (
          <tr key={healthInsurance.id}>
            <td>{healthInsurance.id}</td>
            <td>{healthInsurance.number}</td>
            <td>{healthInsurance.type}</td>
            <td>{healthInsurance.plan}</td>
            <td>{healthInsurance.carrier}</td>
            <td>{healthInsurance.active?.toString()}</td>
            <td>
              <div className="float-end text-nowrap">
                <Link to={'/healthInsurances/edit/' + healthInsurance.id} className="btn btn-sm btn-secondary">{t('healthInsurance.list.edit')}</Link>
                <span> </span>
                <button type="button" onClick={() => confirmDelete(healthInsurance.id!)} className="btn btn-sm btn-secondary">{t('healthInsurance.list.delete')}</button>
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
