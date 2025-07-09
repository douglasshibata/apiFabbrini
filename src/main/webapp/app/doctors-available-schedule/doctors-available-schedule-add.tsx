import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';
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

export default function DoctorsAvailableScheduleAdd() {
  const { t } = useTranslation();
  useDocumentTitle(t('doctorsAvailableSchedule.add.headline'));

  const navigate = useNavigate();
  const [doctorValues, setDoctorValues] = useState<Map<number,string>>(new Map());

  const useFormResult = useForm({
    resolver: yupResolver(getSchema()),
  });

  const prepareRelations = async () => {
    try {
      const doctorValuesResponse = await axios.get('/api/doctorsAvailableSchedules/doctorValues');
      setDoctorValues(doctorValuesResponse.data);
    } catch (error: any) {
      handleServerError(error, navigate);
    }
  };

  useEffect(() => {
    prepareRelations();
  }, []);

  const createDoctorsAvailableSchedule = async (data: DoctorsAvailableScheduleDTO) => {
    window.scrollTo(0, 0);
    try {
      await axios.post('/api/doctorsAvailableSchedules', data);
      navigate('/doctorsAvailableSchedules', {
            state: {
              msgSuccess: t('doctorsAvailableSchedule.create.success')
            }
          });
    } catch (error: any) {
      handleServerError(error, navigate, useFormResult.setError, t);
    }
  };

  return (<>
    <div className="d-flex flex-wrap mb-4">
      <h1 className="flex-grow-1">{t('doctorsAvailableSchedule.add.headline')}</h1>
      <div>
        <Link to="/doctorsAvailableSchedules" className="btn btn-secondary">{t('doctorsAvailableSchedule.add.back')}</Link>
      </div>
    </div>
    <form onSubmit={useFormResult.handleSubmit(createDoctorsAvailableSchedule)} noValidate>
      <InputRow useFormResult={useFormResult} object="doctorsAvailableSchedule" field="dayOfWeek" />
      <InputRow useFormResult={useFormResult} object="doctorsAvailableSchedule" field="startDateTime" type="datetimepicker" />
      <InputRow useFormResult={useFormResult} object="doctorsAvailableSchedule" field="endDateTime" type="datetimepicker" />
      <InputRow useFormResult={useFormResult} object="doctorsAvailableSchedule" field="interval" type="datetimepicker" />
      <InputRow useFormResult={useFormResult} object="doctorsAvailableSchedule" field="active" type="checkbox" />
      <InputRow useFormResult={useFormResult} object="doctorsAvailableSchedule" field="doctor" type="select" options={doctorValues} />
      <input type="submit" value={t('doctorsAvailableSchedule.add.headline')} className="btn btn-primary mt-4" />
    </form>
  </>);
}
