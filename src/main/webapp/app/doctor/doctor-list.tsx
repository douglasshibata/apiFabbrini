import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';
import { handleServerError } from 'app/common/utils';
import { DoctorDTO } from 'app/doctor/doctor-model';
import axios from 'axios';
import useDocumentTitle from 'app/common/use-document-title';


export default function DoctorList() {
  const { t } = useTranslation();
  useDocumentTitle(t('doctor.list.headline'));

  const [doctors, setDoctors] = useState<DoctorDTO[]>([]);
  const navigate = useNavigate();

  const getAllDoctors = async () => {
    try {
      const response = await axios.get('/api/doctors');
      setDoctors(response.data);
    } catch (error: any) {
      handleServerError(error, navigate);
    }
  };

  const confirmDelete = async (id: number) => {
    if (!confirm(t('delete.confirm'))) {
      return;
    }
    try {
      await axios.delete('/api/doctors/' + id);
      navigate('/doctors', {
            state: {
              msgInfo: t('doctor.delete.success')
            }
          });
      getAllDoctors();
    } catch (error: any) {
      if (error?.response?.data?.code === 'REFERENCED') {
        const messageParts = error.response.data.message.split(',');
        navigate('/doctors', {
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
    getAllDoctors();
  }, []);

  return (<>
    <div className="d-flex flex-wrap mb-4">
      <h1 className="flex-grow-1">{t('doctor.list.headline')}</h1>
      <div>
        <Link to="/doctors/add" className="btn btn-primary ms-2">{t('doctor.list.createNew')}</Link>
      </div>
    </div>
    {!doctors || doctors.length === 0 ? (
    <div>{t('doctor.list.empty')}</div>
    ) : (
    <div className="table-responsive">
      <table className="table table-striped table-hover align-middle">
        <thead>
          <tr>
            <th scope="col">{t('doctor.id.label')}</th>
            <th scope="col">{t('doctor.conselho.label')}</th>
            <th scope="col">{t('doctor.ufconselho.label')}</th>
            <th scope="col">{t('doctor.registro.label')}</th>
            <th scope="col">{t('doctor.title.label')}</th>
            <th scope="col">{t('doctor.user.label')}</th>
            <th scope="col">{t('doctor.specialty.label')}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((doctor) => (
          <tr key={doctor.id}>
            <td>{doctor.id}</td>
            <td>{doctor.conselho}</td>
            <td>{doctor.ufconselho}</td>
            <td>{doctor.registro}</td>
            <td>{doctor.title}</td>
            <td>{doctor.user}</td>
            <td>{doctor.specialty}</td>
            <td>
              <div className="float-end text-nowrap">
                <Link to={'/doctors/edit/' + doctor.id} className="btn btn-sm btn-secondary">{t('doctor.list.edit')}</Link>
                <span> </span>
                <button type="button" onClick={() => confirmDelete(doctor.id!)} className="btn btn-sm btn-secondary">{t('doctor.list.delete')}</button>
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
