import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';
import { handleServerError, setYupDefaults } from 'app/common/utils';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { HealthInsuranceDTO } from 'app/health-insurance/health-insurance-model';
import axios from 'axios';
import InputRow from 'app/common/input-row/input-row';
import useDocumentTitle from 'app/common/use-document-title';
import * as yup from 'yup';


function getSchema() {
  setYupDefaults();
  return yup.object({
    number: yup.string().emptyToNull().max(255).required(),
    type: yup.string().emptyToNull().max(255),
    plan: yup.string().emptyToNull().max(255),
    carrier: yup.string().emptyToNull().max(255),
    active: yup.bool(),
    documents: yup.array(yup.number().required()).emptyToNull().json()
  });
}

export default function HealthInsuranceAdd() {
  const { t } = useTranslation();
  useDocumentTitle(t('healthInsurance.add.headline'));

  const navigate = useNavigate();
  const [documentsValues, setDocumentsValues] = useState<Map<number,string>>(new Map());

  const useFormResult = useForm({
    resolver: yupResolver(getSchema()),
  });

  const prepareRelations = async () => {
    try {
      const documentsValuesResponse = await axios.get('/api/healthInsurances/documentsValues');
      setDocumentsValues(documentsValuesResponse.data);
    } catch (error: any) {
      handleServerError(error, navigate);
    }
  };

  useEffect(() => {
    prepareRelations();
  }, []);

  const createHealthInsurance = async (data: HealthInsuranceDTO) => {
    window.scrollTo(0, 0);
    try {
      await axios.post('/api/healthInsurances', data);
      navigate('/healthInsurances', {
            state: {
              msgSuccess: t('healthInsurance.create.success')
            }
          });
    } catch (error: any) {
      handleServerError(error, navigate, useFormResult.setError, t);
    }
  };

  return (<>
    <div className="d-flex flex-wrap mb-4">
      <h1 className="flex-grow-1">{t('healthInsurance.add.headline')}</h1>
      <div>
        <Link to="/healthInsurances" className="btn btn-secondary">{t('healthInsurance.add.back')}</Link>
      </div>
    </div>
    <form onSubmit={useFormResult.handleSubmit(createHealthInsurance)} noValidate>
      <InputRow useFormResult={useFormResult} object="healthInsurance" field="number" required={true} />
      <InputRow useFormResult={useFormResult} object="healthInsurance" field="type" />
      <InputRow useFormResult={useFormResult} object="healthInsurance" field="plan" />
      <InputRow useFormResult={useFormResult} object="healthInsurance" field="carrier" />
      <InputRow useFormResult={useFormResult} object="healthInsurance" field="active" type="checkbox" />
      <InputRow useFormResult={useFormResult} object="healthInsurance" field="documents" type="multiselect" options={documentsValues} />
      <input type="submit" value={t('healthInsurance.add.headline')} className="btn btn-primary mt-4" />
    </form>
  </>);
}
