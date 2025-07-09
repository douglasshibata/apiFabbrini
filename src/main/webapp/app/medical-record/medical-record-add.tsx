import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';
import { handleServerError, setYupDefaults } from 'app/common/utils';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { MedicalRecordDTO } from 'app/medical-record/medical-record-model';
import axios from 'axios';
import InputRow from 'app/common/input-row/input-row';
import useDocumentTitle from 'app/common/use-document-title';
import * as yup from 'yup';


function getSchema() {
  setYupDefaults();
  return yup.object({
    notes: yup.string().emptyToNull(),
    schedule: yup.number().integer().emptyToNull()
  });
}

export default function MedicalRecordAdd() {
  const { t } = useTranslation();
  useDocumentTitle(t('medicalRecord.add.headline'));

  const navigate = useNavigate();
  const [scheduleValues, setScheduleValues] = useState<Map<number,string>>(new Map());

  const useFormResult = useForm({
    resolver: yupResolver(getSchema()),
  });

  const getMessage = (key: string) => {
    const messages: Record<string, string> = {
      MEDICAL_RECORD_SCHEDULE_UNIQUE: t('Exists.medicalRecord.schedule')
    };
    return messages[key];
  };

  const prepareRelations = async () => {
    try {
      const scheduleValuesResponse = await axios.get('/api/medicalRecords/scheduleValues');
      setScheduleValues(scheduleValuesResponse.data);
    } catch (error: any) {
      handleServerError(error, navigate);
    }
  };

  useEffect(() => {
    prepareRelations();
  }, []);

  const createMedicalRecord = async (data: MedicalRecordDTO) => {
    window.scrollTo(0, 0);
    try {
      await axios.post('/api/medicalRecords', data);
      navigate('/medicalRecords', {
            state: {
              msgSuccess: t('medicalRecord.create.success')
            }
          });
    } catch (error: any) {
      handleServerError(error, navigate, useFormResult.setError, t, getMessage);
    }
  };

  return (<>
    <div className="d-flex flex-wrap mb-4">
      <h1 className="flex-grow-1">{t('medicalRecord.add.headline')}</h1>
      <div>
        <Link to="/medicalRecords" className="btn btn-secondary">{t('medicalRecord.add.back')}</Link>
      </div>
    </div>
    <form onSubmit={useFormResult.handleSubmit(createMedicalRecord)} noValidate>
      <InputRow useFormResult={useFormResult} object="medicalRecord" field="notes" type="textarea" />
      <InputRow useFormResult={useFormResult} object="medicalRecord" field="schedule" type="select" options={scheduleValues} />
      <input type="submit" value={t('medicalRecord.add.headline')} className="btn btn-primary mt-4" />
    </form>
  </>);
}
