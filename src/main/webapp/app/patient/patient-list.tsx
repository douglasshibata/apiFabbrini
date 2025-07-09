import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';
import { handleServerError } from 'app/common/utils';
import { PatientDTO } from 'app/patient/patient-model';
import axios from 'axios';
import useDocumentTitle from 'app/common/use-document-title';


export default function PatientList() {
  const { t } = useTranslation();
  useDocumentTitle(t('patient.list.headline'));

  const [patients, setPatients] = useState<PatientDTO[]>([]);
  const navigate = useNavigate();

  const getAllPatients = async () => {
    try {
      const response = await axios.get('/api/patients');
      setPatients(response.data);
    } catch (error: any) {
      handleServerError(error, navigate);
    }
  };

  const confirmDelete = async (id: number) => {
    if (!confirm(t('delete.confirm'))) {
      return;
    }
    try {
      await axios.delete('/api/patients/' + id);
      navigate('/patients', {
            state: {
              msgInfo: t('patient.delete.success')
            }
          });
      getAllPatients();
    } catch (error: any) {
      if (error?.response?.data?.code === 'REFERENCED') {
        const messageParts = error.response.data.message.split(',');
        navigate('/patients', {
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
    getAllPatients();
  }, []);

  return (<>
    <div className="d-flex flex-wrap mb-4">
      <h1 className="flex-grow-1">{t('patient.list.headline')}</h1>
      <div>
        <Link to="/patients/add" className="btn btn-primary ms-2">{t('patient.list.createNew')}</Link>
      </div>
    </div>
    {!patients || patients.length === 0 ? (
    <div>{t('patient.list.empty')}</div>
    ) : (
    <div className="table-responsive">
      <table className="table table-striped table-hover align-middle">
        <thead>
          <tr>
            <th scope="col">{t('patient.id.label')}</th>
            <th scope="col">{t('patient.fullname.label')}</th>
            <th scope="col">{t('patient.cpf.label')}</th>
            <th scope="col">{t('patient.rg.label')}</th>
            <th scope="col">{t('patient.socialname.label')}</th>
            <th scope="col">{t('patient.user.label')}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
          <tr key={patient.id}>
            <td>{patient.id}</td>
            <td>{patient.fullname}</td>
            <td>{patient.cpf}</td>
            <td>{patient.rg}</td>
            <td>{patient.socialname}</td>
            <td>{patient.user}</td>
            <td>
              <div className="float-end text-nowrap">
                <Link to={'/patients/edit/' + patient.id} className="btn btn-sm btn-secondary">{t('patient.list.edit')}</Link>
                <span> </span>
                <button type="button" onClick={() => confirmDelete(patient.id!)} className="btn btn-sm btn-secondary">{t('patient.list.delete')}</button>
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
