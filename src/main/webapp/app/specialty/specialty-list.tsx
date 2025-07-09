import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';
import { handleServerError } from 'app/common/utils';
import { SpecialtyDTO } from 'app/specialty/specialty-model';
import axios from 'axios';
import useDocumentTitle from 'app/common/use-document-title';


export default function SpecialtyList() {
  const { t } = useTranslation();
  useDocumentTitle(t('specialty.list.headline'));

  const [specialties, setSpecialties] = useState<SpecialtyDTO[]>([]);
  const navigate = useNavigate();

  const getAllSpecialties = async () => {
    try {
      const response = await axios.get('/api/specialties');
      setSpecialties(response.data);
    } catch (error: any) {
      handleServerError(error, navigate);
    }
  };

  const confirmDelete = async (id: number) => {
    if (!confirm(t('delete.confirm'))) {
      return;
    }
    try {
      await axios.delete('/api/specialties/' + id);
      navigate('/specialties', {
            state: {
              msgInfo: t('specialty.delete.success')
            }
          });
      getAllSpecialties();
    } catch (error: any) {
      if (error?.response?.data?.code === 'REFERENCED') {
        const messageParts = error.response.data.message.split(',');
        navigate('/specialties', {
              state: {
                msgError: t(messageParts[0]!, { id: messageParts[1]! })
              }
            });
        return;
      }
      handleServerError(error, navigate);
    }
  };

  useEffect(() => {
    getAllSpecialties();
  }, []);

  return (<>
    <div className="d-flex flex-wrap mb-4">
      <h1 className="flex-grow-1">{t('specialty.list.headline')}</h1>
      <div>
        <Link to="/specialties/add" className="btn btn-primary ms-2">{t('specialty.list.createNew')}</Link>
      </div>
    </div>
    {!specialties || specialties.length === 0 ? (
    <div>{t('specialty.list.empty')}</div>
    ) : (
    <div className="table-responsive">
      <table className="table table-striped table-hover align-middle">
        <thead>
          <tr>
            <th scope="col">{t('specialty.id.label')}</th>
            <th scope="col">{t('specialty.name.label')}</th>
            <th scope="col">{t('specialty.description.label')}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {specialties.map((specialty) => (
          <tr key={specialty.id}>
            <td>{specialty.id}</td>
            <td>{specialty.name}</td>
            <td>{specialty.description}</td>
            <td>
              <div className="float-end text-nowrap">
                <Link to={'/specialties/edit/' + specialty.id} className="btn btn-sm btn-secondary">{t('specialty.list.edit')}</Link>
                <span> </span>
                <button type="button" onClick={() => confirmDelete(specialty.id!)} className="btn btn-sm btn-secondary">{t('specialty.list.delete')}</button>
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
