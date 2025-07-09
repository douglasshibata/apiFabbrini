import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';
import { handleServerError } from 'app/common/utils';
import { ScheduleDTO } from 'app/schedule/schedule-model';
import axios from 'axios';
import useDocumentTitle from 'app/common/use-document-title';


export default function ScheduleList() {
  const { t } = useTranslation();
  useDocumentTitle(t('schedule.list.headline'));

  const [schedules, setSchedules] = useState<ScheduleDTO[]>([]);
  const navigate = useNavigate();

  const getAllSchedules = async () => {
    try {
      const response = await axios.get('/api/schedules');
      setSchedules(response.data);
    } catch (error: any) {
      handleServerError(error, navigate);
    }
  };

  const confirmDelete = async (id: number) => {
    if (!confirm(t('delete.confirm'))) {
      return;
    }
    try {
      await axios.delete('/api/schedules/' + id);
      navigate('/schedules', {
            state: {
              msgInfo: t('schedule.delete.success')
            }
          });
      getAllSchedules();
    } catch (error: any) {
      if (error?.response?.data?.code === 'REFERENCED') {
        const messageParts = error.response.data.message.split(',');
        navigate('/schedules', {
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
    getAllSchedules();
  }, []);

  return (<>
    <div className="d-flex flex-wrap mb-4">
      <h1 className="flex-grow-1">{t('schedule.list.headline')}</h1>
      <div>
        <Link to="/schedules/add" className="btn btn-primary ms-2">{t('schedule.list.createNew')}</Link>
      </div>
    </div>
    {!schedules || schedules.length === 0 ? (
    <div>{t('schedule.list.empty')}</div>
    ) : (
    <div className="table-responsive">
      <table className="table table-striped table-hover align-middle">
        <thead>
          <tr>
            <th scope="col">{t('schedule.id.label')}</th>
            <th scope="col">{t('schedule.appoimentTime.label')}</th>
            <th scope="col">{t('schedule.videoHashLink.label')}</th>
            <th scope="col">{t('schedule.patient.label')}</th>
            <th scope="col">{t('schedule.doctorsAvailableSchedule.label')}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {schedules.map((schedule) => (
          <tr key={schedule.id}>
            <td>{schedule.id}</td>
            <td>{schedule.appoimentTime}</td>
            <td>{schedule.videoHashLink}</td>
            <td>{schedule.patient}</td>
            <td>{schedule.doctorsAvailableSchedule}</td>
            <td>
              <div className="float-end text-nowrap">
                <Link to={'/schedules/edit/' + schedule.id} className="btn btn-sm btn-secondary">{t('schedule.list.edit')}</Link>
                <span> </span>
                <button type="button" onClick={() => confirmDelete(schedule.id!)} className="btn btn-sm btn-secondary">{t('schedule.list.delete')}</button>
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
