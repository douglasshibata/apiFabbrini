import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router';
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

export default function ScheduleEdit() {
  const { t } = useTranslation();
  useDocumentTitle(t('schedule.edit.headline'));

  const navigate = useNavigate();
  const [patientValues, setPatientValues] = useState<Map<number,string>>(new Map());
  const [doctorsAvailableScheduleValues, setDoctorsAvailableScheduleValues] = useState<Map<number,string>>(new Map());
  const params = useParams();
  const currentId = +params.id!;

  const useFormResult = useForm({
    resolver: yupResolver(getSchema()),
  });

  const prepareForm = async () => {
    try {
      const patientValuesResponse = await axios.get('/api/schedules/patientValues');
      setPatientValues(patientValuesResponse.data);
      const doctorsAvailableScheduleValuesResponse = await axios.get('/api/schedules/doctorsAvailableScheduleValues');
      setDoctorsAvailableScheduleValues(doctorsAvailableScheduleValuesResponse.data);
      const data = (await axios.get('/api/schedules/' + currentId)).data;
      useFormResult.reset(data);
    } catch (error: any) {
      handleServerError(error, navigate);
    }
  };

  useEffect(() => {
    prepareForm();
  }, []);

  const updateSchedule = async (data: ScheduleDTO) => {
    window.scrollTo(0, 0);
    try {
      await axios.put('/api/schedules/' + currentId, data);
      navigate('/schedules', {
            state: {
              msgSuccess: t('schedule.update.success')
            }
          });
    } catch (error: any) {
      handleServerError(error, navigate, useFormResult.setError, t);
    }
  };

  return (<>
    <div className="d-flex flex-wrap mb-4">
      <h1 className="flex-grow-1">{t('schedule.edit.headline')}</h1>
      <div>
        <Link to="/schedules" className="btn btn-secondary">{t('schedule.edit.back')}</Link>
      </div>
    </div>
    <form onSubmit={useFormResult.handleSubmit(updateSchedule)} noValidate>
      <InputRow useFormResult={useFormResult} object="schedule" field="id" disabled={true} type="number" />
      <InputRow useFormResult={useFormResult} object="schedule" field="appoimentTime" type="datetimepicker" />
      <InputRow useFormResult={useFormResult} object="schedule" field="videoHashLink" />
      <InputRow useFormResult={useFormResult} object="schedule" field="note" type="textarea" />
      <InputRow useFormResult={useFormResult} object="schedule" field="patient" type="select" options={patientValues} />
      <InputRow useFormResult={useFormResult} object="schedule" field="doctorsAvailableSchedule" type="select" options={doctorsAvailableScheduleValues} />
      <input type="submit" value={t('schedule.edit.headline')} className="btn btn-primary mt-4" />
    </form>
  </>);
}
