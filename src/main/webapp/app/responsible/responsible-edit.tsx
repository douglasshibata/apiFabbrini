import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router';
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

export default function ResponsibleEdit() {
  const { t } = useTranslation();
  useDocumentTitle(t('responsible.edit.headline'));

  const navigate = useNavigate();
  const [phonesValues, setPhonesValues] = useState<Map<number,string>>(new Map());
  const [patientValues, setPatientValues] = useState<Map<number,string>>(new Map());
  const params = useParams();
  const currentId = +params.id!;

  const useFormResult = useForm({
    resolver: yupResolver(getSchema()),
  });

  const prepareForm = async () => {
    try {
      const phonesValuesResponse = await axios.get('/api/responsibles/phonesValues');
      setPhonesValues(phonesValuesResponse.data);
      const patientValuesResponse = await axios.get('/api/responsibles/patientValues');
      setPatientValues(patientValuesResponse.data);
      const data = (await axios.get('/api/responsibles/' + currentId)).data;
      useFormResult.reset(data);
    } catch (error: any) {
      handleServerError(error, navigate);
    }
  };

  useEffect(() => {
    prepareForm();
  }, []);

  const updateResponsible = async (data: ResponsibleDTO) => {
    window.scrollTo(0, 0);
    try {
      await axios.put('/api/responsibles/' + currentId, data);
      navigate('/responsibles', {
            state: {
              msgSuccess: t('responsible.update.success')
            }
          });
    } catch (error: any) {
      handleServerError(error, navigate, useFormResult.setError, t);
    }
  };

  return (<>
    <div className="d-flex flex-wrap mb-4">
      <h1 className="flex-grow-1">{t('responsible.edit.headline')}</h1>
      <div>
        <Link to="/responsibles" className="btn btn-secondary">{t('responsible.edit.back')}</Link>
      </div>
    </div>
    <form onSubmit={useFormResult.handleSubmit(updateResponsible)} noValidate>
      <InputRow useFormResult={useFormResult} object="responsible" field="id" disabled={true} type="number" />
      <InputRow useFormResult={useFormResult} object="responsible" field="name" />
      <InputRow useFormResult={useFormResult} object="responsible" field="degreeOfRelatedness" />
      <InputRow useFormResult={useFormResult} object="responsible" field="phones" required={true} type="select" options={phonesValues} />
      <InputRow useFormResult={useFormResult} object="responsible" field="patient" required={true} type="select" options={patientValues} />
      <input type="submit" value={t('responsible.edit.headline')} className="btn btn-primary mt-4" />
    </form>
  </>);
}
