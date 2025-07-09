import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';
import { handleServerError } from 'app/common/utils';
import { MedicalRecordDTO } from 'app/medical-record/medical-record-model';
import axios from 'axios';
import useDocumentTitle from 'app/common/use-document-title';


export default function MedicalRecordList() {
  const { t } = useTranslation();
  useDocumentTitle(t('medicalRecord.list.headline'));

  const [medicalRecords, setMedicalRecords] = useState<MedicalRecordDTO[]>([]);
  const navigate = useNavigate();

  const getAllMedicalRecords = async () => {
    try {
      const response = await axios.get('/api/medicalRecords');
      setMedicalRecords(response.data);
    } catch (error: any) {
      handleServerError(error, navigate);
    }
  };

  const confirmDelete = async (id: number) => {
    if (!confirm(t('delete.confirm'))) {
      return;
    }
    try {
      await axios.delete('/api/medicalRecords/' + id);
      navigate('/medicalRecords', {
            state: {
              msgInfo: t('medicalRecord.delete.success')
            }
          });
      getAllMedicalRecords();
    } catch (error: any) {
      handleServerError(error, navigate);
    }
  };

  useEffect(() => {
    getAllMedicalRecords();
  }, []);

  return (<>
    <div className="d-flex flex-wrap mb-4">
      <h1 className="flex-grow-1">{t('medicalRecord.list.headline')}</h1>
      <div>
        <Link to="/medicalRecords/add" className="btn btn-primary ms-2">{t('medicalRecord.list.createNew')}</Link>
      </div>
    </div>
    {!medicalRecords || medicalRecords.length === 0 ? (
    <div>{t('medicalRecord.list.empty')}</div>
    ) : (
    <div className="table-responsive">
      <table className="table table-striped table-hover align-middle">
        <thead>
          <tr>
            <th scope="col">{t('medicalRecord.id.label')}</th>
            <th scope="col">{t('medicalRecord.schedule.label')}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {medicalRecords.map((medicalRecord) => (
          <tr key={medicalRecord.id}>
            <td>{medicalRecord.id}</td>
            <td>{medicalRecord.schedule}</td>
            <td>
              <div className="float-end text-nowrap">
                <Link to={'/medicalRecords/edit/' + medicalRecord.id} className="btn btn-sm btn-secondary">{t('medicalRecord.list.edit')}</Link>
                <span> </span>
                <button type="button" onClick={() => confirmDelete(medicalRecord.id!)} className="btn btn-sm btn-secondary">{t('medicalRecord.list.delete')}</button>
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
