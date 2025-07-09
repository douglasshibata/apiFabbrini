import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';
import { handleServerError, setYupDefaults } from 'app/common/utils';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ScheduleDTO } from 'app/schedule/schedule-model';
import axios from 'axios';
import InputRow from 'app/common/input-row/input-row';
import useDocumentTitle from 'app/common/use-document-title';
import * as yup from 'yup';


function getSchema() {
  setYupDefaults();
  return yup.object({
    appoimentTime: yup.string().emptyToNull(),
    videoHashLink: yup.string().emptyToNull().uuid(),
    note: yup.string().emptyToNull(),
    patient: yup.number().integer().emptyToNull(),
    doctorsAvailableSchedule: yup.number().integer().emptyToNull()
  });
}

export default function ScheduleAdd() {
  const { t } = useTranslation();
  useDocumentTitle(t('schedule.add.headline'));

  const navigate = useNavigate();
  const [patientValues, setPatientValues] = useState<Map<number,string>>(new Map());
  const [doctorsAvailableScheduleValues, setDoctorsAvailableScheduleValues] = useState<Map<number,string>>(new Map());

  const useFormResult = useForm({
    resolver: yupResolver(getSchema()),
  });

  const prepareRelations = async () => {
    try {
      const patientValuesResponse = await axios.get('/api/schedules/patientValues');
      setPatientValues(patientValuesResponse.data);
      const doctorsAvailableScheduleValuesResponse = await axios.get('/api/schedules/doctorsAvailableScheduleValues');
      setDoctorsAvailableScheduleValues(doctorsAvailableScheduleValuesResponse.data);
    } catch (error: any) {
      handleServerError(error, navigate);
    }
  };

  useEffect(() => {
    prepareRelations();
  }, []);

  const createSchedule = async (data: ScheduleDTO) => {
    window.scrollTo(0, 0);
    try {
      await axios.post('/api/schedules', data);
      navigate('/schedules', {
            state: {
              msgSuccess: t('schedule.create.success')
            }
          });
    } catch (error: any) {
      handleServerError(error, navigate, useFormResult.setError, t);
    }
  };

  return (<>
    <div className="d-flex flex-wrap mb-4">
      <h1 className="flex-grow-1">{t('schedule.add.headline')}</h1>
      <div>
        <Link to="/schedules" className="btn btn-secondary">{t('schedule.add.back')}</Link>
      </div>
    </div>
    <form onSubmit={useFormResult.handleSubmit(createSchedule)} noValidate>
      <InputRow useFormResult={useFormResult} object="schedule" field="appoimentTime" type="datetimepicker" />
      <InputRow useFormResult={useFormResult} object="schedule" field="videoHashLink" />
      <InputRow useFormResult={useFormResult} object="schedule" field="note" type="textarea" />
      <InputRow useFormResult={useFormResult} object="schedule" field="patient" type="select" options={patientValues} />
      <InputRow useFormResult={useFormResult} object="schedule" field="doctorsAvailableSchedule" type="select" options={doctorsAvailableScheduleValues} />
      <input type="submit" value={t('schedule.add.headline')} className="btn btn-primary mt-4" />
    </form>
  </>);
}
