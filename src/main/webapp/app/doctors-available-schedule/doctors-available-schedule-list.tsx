import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';
import { handleServerError } from 'app/common/utils';
import { DoctorsAvailableScheduleDTO } from 'app/doctors-available-schedule/doctors-available-schedule-model';
import axios from 'axios';
import useDocumentTitle from 'app/common/use-document-title';


export default function DoctorsAvailableScheduleList() {
  const { t } = useTranslation();
  useDocumentTitle(t('doctorsAvailableSchedule.list.headline'));

  const [doctorsAvailableSchedules, setDoctorsAvailableSchedules] = useState<DoctorsAvailableScheduleDTO[]>([]);
  const navigate = useNavigate();

  const getAllDoctorsAvailableSchedules = async () => {
    try {
      const response = await axios.get('/api/doctorsAvailableSchedules');
      setDoctorsAvailableSchedules(response.data);
    } catch (error: any) {
      handleServerError(error, navigate);
    }
  };

  const confirmDelete = async (id: number) => {
    if (!confirm(t('delete.confirm'))) {
      return;
    }
    try {
      await axios.delete('/api/doctorsAvailableSchedules/' + id);
      navigate('/doctorsAvailableSchedules', {
            state: {
              msgInfo: t('doctorsAvailableSchedule.delete.success')
            }
          });
      getAllDoctorsAvailableSchedules();
    } catch (error: any) {
      if (error?.response?.data?.code === 'REFERENCED') {
        const messageParts = error.response.data.message.split(',');
        navigate('/doctorsAvailableSchedules', {
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
    getAllDoctorsAvailableSchedules();
  }, []);

  return (<>
    <div className="d-flex flex-wrap mb-4">
      <h1 className="flex-grow-1">{t('doctorsAvailableSchedule.list.headline')}</h1>
      <div>
        <Link to="/doctorsAvailableSchedules/add" className="btn btn-primary ms-2">{t('doctorsAvailableSchedule.list.createNew')}</Link>
      </div>
    </div>
    {!doctorsAvailableSchedules || doctorsAvailableSchedules.length === 0 ? (
    <div>{t('doctorsAvailableSchedule.list.empty')}</div>
    ) : (
    <div className="table-responsive">
      <table className="table table-striped table-hover align-middle">
        <thead>
          <tr>
            <th scope="col">{t('doctorsAvailableSchedule.id.label')}</th>
            <th scope="col">{t('doctorsAvailableSchedule.dayOfWeek.label')}</th>
            <th scope="col">{t('doctorsAvailableSchedule.startDateTime.label')}</th>
            <th scope="col">{t('doctorsAvailableSchedule.endDateTime.label')}</th>
            <th scope="col">{t('doctorsAvailableSchedule.interval.label')}</th>
            <th scope="col">{t('doctorsAvailableSchedule.active.label')}</th>
            <th scope="col">{t('doctorsAvailableSchedule.doctor.label')}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {doctorsAvailableSchedules.map((doctorsAvailableSchedule) => (
          <tr key={doctorsAvailableSchedule.id}>
            <td>{doctorsAvailableSchedule.id}</td>
            <td>{doctorsAvailableSchedule.dayOfWeek}</td>
            <td>{doctorsAvailableSchedule.startDateTime}</td>
            <td>{doctorsAvailableSchedule.endDateTime}</td>
            <td>{doctorsAvailableSchedule.interval}</td>
            <td>{doctorsAvailableSchedule.active?.toString()}</td>
            <td>{doctorsAvailableSchedule.doctor}</td>
            <td>
              <div className="float-end text-nowrap">
                <Link to={'/doctorsAvailableSchedules/edit/' + doctorsAvailableSchedule.id} className="btn btn-sm btn-secondary">{t('doctorsAvailableSchedule.list.edit')}</Link>
                <span> </span>
                <button type="button" onClick={() => confirmDelete(doctorsAvailableSchedule.id!)} className="btn btn-sm btn-secondary">{t('doctorsAvailableSchedule.list.delete')}</button>
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
