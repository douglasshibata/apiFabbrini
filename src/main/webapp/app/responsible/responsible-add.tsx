import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';
import { handleServerError, setYupDefaults } from 'app/common/utils';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ResponsibleDTO } from 'app/responsible/responsible-model';
import axios from 'axios';
import InputRow from 'app/common/input-row/input-row';
import useDocumentTitle from 'app/common/use-document-title';
import * as yup from 'yup';


function getSchema() {
  setYupDefaults();
  return yup.object({
    name: yup.string().emptyToNull().max(255),
    degreeOfRelatedness: yup.string().emptyToNull().max(255),
    phones: yup.number().integer().emptyToNull().required(),
    patient: yup.number().integer().emptyToNull().required()
  });
}

export default function ResponsibleAdd() {
  const { t } = useTranslation();
  useDocumentTitle(t('responsible.add.headline'));

  const navigate = useNavigate();
  const [phonesValues, setPhonesValues] = useState<Map<number,string>>(new Map());
  const [patientValues, setPatientValues] = useState<Map<number,string>>(new Map());

  const useFormResult = useForm({
    resolver: yupResolver(getSchema()),
  });

  const prepareRelations = async () => {
    try {
      const phonesValuesResponse = await axios.get('/api/responsibles/phonesValues');
      setPhonesValues(phonesValuesResponse.data);
      const patientValuesResponse = await axios.get('/api/responsibles/patientValues');
      setPatientValues(patientValuesResponse.data);
    } catch (error: any) {
      handleServerError(error, navigate);
    }
  };

  useEffect(() => {
    prepareRelations();
  }, []);

  const createResponsible = async (data: ResponsibleDTO) => {
    window.scrollTo(0, 0);
    try {
      await axios.post('/api/responsibles', data);
      navigate('/responsibles', {
            state: {
              msgSuccess: t('responsible.create.success')
            }
          });
    } catch (error: any) {
      handleServerError(error, navigate, useFormResult.setError, t);
    }
  };

  return (<>
    <div className="d-flex flex-wrap mb-4">
      <h1 className="flex-grow-1">{t('responsible.add.headline')}</h1>
      <div>
        <Link to="/responsibles" className="btn btn-secondary">{t('responsible.add.back')}</Link>
      </div>
    </div>
    <form onSubmit={useFormResult.handleSubmit(createResponsible)} noValidate>
      <InputRow useFormResult={useFormResult} object="responsible" field="name" />
      <InputRow useFormResult={useFormResult} object="responsible" field="degreeOfRelatedness" />
      <InputRow useFormResult={useFormResult} object="responsible" field="phones" required={true} type="select" options={phonesValues} />
      <InputRow useFormResult={useFormResult} object="responsible" field="patient" required={true} type="select" options={patientValues} />
      <input type="submit" value={t('responsible.add.headline')} className="btn btn-primary mt-4" />
    </form>
  </>);
}
