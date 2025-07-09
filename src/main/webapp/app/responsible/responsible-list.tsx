import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';
import { handleServerError } from 'app/common/utils';
import { ResponsibleDTO } from 'app/responsible/responsible-model';
import axios from 'axios';
import useDocumentTitle from 'app/common/use-document-title';


export default function ResponsibleList() {
  const { t } = useTranslation();
  useDocumentTitle(t('responsible.list.headline'));

  const [responsibles, setResponsibles] = useState<ResponsibleDTO[]>([]);
  const navigate = useNavigate();

  const getAllResponsibles = async () => {
    try {
      const response = await axios.get('/api/responsibles');
      setResponsibles(response.data);
    } catch (error: any) {
      handleServerError(error, navigate);
    }
  };

  const confirmDelete = async (id: number) => {
    if (!confirm(t('delete.confirm'))) {
      return;
    }
    try {
      await axios.delete('/api/responsibles/' + id);
      navigate('/responsibles', {
            state: {
              msgInfo: t('responsible.delete.success')
            }
          });
      getAllResponsibles();
    } catch (error: any) {
      handleServerError(error, navigate);
    }
  };

  useEffect(() => {
    getAllResponsibles();
  }, []);

  return (<>
    <div className="d-flex flex-wrap mb-4">
      <h1 className="flex-grow-1">{t('responsible.list.headline')}</h1>
      <div>
        <Link to="/responsibles/add" className="btn btn-primary ms-2">{t('responsible.list.createNew')}</Link>
      </div>
    </div>
    {!responsibles || responsibles.length === 0 ? (
    <div>{t('responsible.list.empty')}</div>
    ) : (
    <div className="table-responsive">
      <table className="table table-striped table-hover align-middle">
        <thead>
          <tr>
            <th scope="col">{t('responsible.id.label')}</th>
            <th scope="col">{t('responsible.name.label')}</th>
            <th scope="col">{t('responsible.degreeOfRelatedness.label')}</th>
            <th scope="col">{t('responsible.phones.label')}</th>
            <th scope="col">{t('responsible.patient.label')}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {responsibles.map((responsible) => (
          <tr key={responsible.id}>
            <td>{responsible.id}</td>
            <td>{responsible.name}</td>
            <td>{responsible.degreeOfRelatedness}</td>
            <td>{responsible.phones}</td>
            <td>{responsible.patient}</td>
            <td>
              <div className="float-end text-nowrap">
                <Link to={'/responsibles/edit/' + responsible.id} className="btn btn-sm btn-secondary">{t('responsible.list.edit')}</Link>
                <span> </span>
                <button type="button" onClick={() => confirmDelete(responsible.id!)} className="btn btn-sm btn-secondary">{t('responsible.list.delete')}</button>
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
