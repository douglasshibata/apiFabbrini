import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router';
import { handleServerError, setYupDefaults } from 'app/common/utils';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { DoctorsAvailableScheduleDTO } from 'app/doctors-available-schedule/doctors-available-schedule-model';
import axios from 'axios';
import InputRow from 'app/common/input-row/input-row';
import useDocumentTitle from 'app/common/use-document-title';
import * as yup from 'yup';


function getSchema() {
  setYupDefaults();
  return yup.object({
    dayOfWeek: yup.string().emptyToNull().max(255),
    startDateTime: yup.string().emptyToNull(),
    endDateTime: yup.string().emptyToNull(),
    interval: yup.string().emptyToNull(),
    active: yup.bool(),
    doctor: yup.number().integer().emptyToNull()
  });
}

export default function DoctorsAvailableScheduleEdit() {
  const { t } = useTranslation();
  useDocumentTitle(t('doctorsAvailableSchedule.edit.headline'));

  const navigate = useNavigate();
  const [doctorValues, setDoctorValues] = useState<Map<number,string>>(new Map());
  const params = useParams();
  const currentId = +params.id!;

  const useFormResult = useForm({
    resolver: yupResolver(getSchema()),
  });

  const prepareForm = async () => {
    try {
      const doctorValuesResponse = await axios.get('/api/doctorsAvailableSchedules/doctorValues');
      setDoctorValues(doctorValuesResponse.data);
      const data = (await axios.get('/api/doctorsAvailableSchedules/' + currentId)).data;
      useFormResult.reset(data);
    } catch (error: any) {
      handleServerError(error, navigate);
    }
  };

  useEffect(() => {
    prepareForm();
  }, []);

  const updateDoctorsAvailableSchedule = async (data: DoctorsAvailableScheduleDTO) => {
    window.scrollTo(0, 0);
    try {
      await axios.put('/api/doctorsAvailableSchedules/' + currentId, data);
      navigate('/doctorsAvailableSchedules', {
            state: {
              msgSuccess: t('doctorsAvailableSchedule.update.success')
            }
          });
    } catch (error: any) {
      handleServerError(error, navigate, useFormResult.setError, t);
    }
  };

  return (<>
    <div className="d-flex flex-wrap mb-4">
      <h1 className="flex-grow-1">{t('doctorsAvailableSchedule.edit.headline')}</h1>
      <div>
        <Link to="/doctorsAvailableSchedules" className="btn btn-secondary">{t('doctorsAvailableSchedule.edit.back')}</Link>
      </div>
    </div>
    <form onSubmit={useFormResult.handleSubmit(updateDoctorsAvailableSchedule)} noValidate>
      <InputRow useFormResult={useFormResult} object="doctorsAvailableSchedule" field="id" disabled={true} type="number" />
      <InputRow useFormResult={useFormResult} object="doctorsAvailableSchedule" field="dayOfWeek" />
      <InputRow useFormResult={useFormResult} object="doctorsAvailableSchedule" field="startDateTime" type="datetimepicker" />
      <InputRow useFormResult={useFormResult} object="doctorsAvailableSchedule" field="endDateTime" type="datetimepicker" />
      <InputRow useFormResult={useFormResult} object="doctorsAvailableSchedule" field="interval" type="datetimepicker" />
      <InputRow useFormResult={useFormResult} object="doctorsAvailableSchedule" field="active" type="checkbox" />
      <InputRow useFormResult={useFormResult} object="doctorsAvailableSchedule" field="doctor" type="select" options={doctorValues} />
      <input type="submit" value={t('doctorsAvailableSchedule.edit.headline')} className="btn btn-primary mt-4" />
    </form>
  </>);
}
