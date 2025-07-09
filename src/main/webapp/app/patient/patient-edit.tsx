import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router';
import { handleServerError, setYupDefaults } from 'app/common/utils';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { PatientDTO } from 'app/patient/patient-model';
import axios from 'axios';
import InputRow from 'app/common/input-row/input-row';
import useDocumentTitle from 'app/common/use-document-title';
import * as yup from 'yup';


function getSchema() {
  setYupDefaults();
  return yup.object({
    fullname: yup.string().emptyToNull().max(255).required(),
    cpf: yup.string().emptyToNull().max(255),
    rg: yup.string().emptyToNull().max(255),
    socialname: yup.string().emptyToNull().max(255),
    user: yup.number().integer().emptyToNull().required(),
    documents: yup.array(yup.number().required()).emptyToNull().json(),
    healthInsurances: yup.array(yup.number().required()).emptyToNull().json()
  });
}

export default function PatientEdit() {
  const { t } = useTranslation();
  useDocumentTitle(t('patient.edit.headline'));

  const navigate = useNavigate();
  const [userValues, setUserValues] = useState<Map<number,string>>(new Map());
  const [documentsValues, setDocumentsValues] = useState<Map<number,string>>(new Map());
  const [healthInsurancesValues, setHealthInsurancesValues] = useState<Map<number,string>>(new Map());
  const params = useParams();
  const currentId = +params.id!;

  const useFormResult = useForm({
    resolver: yupResolver(getSchema()),
  });

  const getMessage = (key: string) => {
    const messages: Record<string, string> = {
      PATIENT_CPF_UNIQUE: t('exists.patient.cpf'),
      PATIENT_USER_UNIQUE: t('Exists.patient.user')
    };
    return messages[key];
  };

  const prepareForm = async () => {
    try {
      const userValuesResponse = await axios.get('/api/patients/userValues');
      setUserValues(userValuesResponse.data);
      const documentsValuesResponse = await axios.get('/api/patients/documentsValues');
      setDocumentsValues(documentsValuesResponse.data);
      const healthInsurancesValuesResponse = await axios.get('/api/patients/healthInsurancesValues');
      setHealthInsurancesValues(healthInsurancesValuesResponse.data);
      const data = (await axios.get('/api/patients/' + currentId)).data;
      if (data.documents) {
        data.documents = JSON.stringify(data.documents, undefined, 2);
      }
      if (data.healthInsurances) {
        data.healthInsurances = JSON.stringify(data.healthInsurances, undefined, 2);
      }
      useFormResult.reset(data);
    } catch (error: any) {
      handleServerError(error, navigate);
    }
  };

  useEffect(() => {
    prepareForm();
  }, []);

  const updatePatient = async (data: PatientDTO) => {
    window.scrollTo(0, 0);
    try {
      await axios.put('/api/patients/' + currentId, data);
      navigate('/patients', {
            state: {
              msgSuccess: t('patient.update.success')
            }
          });
    } catch (error: any) {
      handleServerError(error, navigate, useFormResult.setError, t, getMessage);
    }
  };

  return (<>
    <div className="d-flex flex-wrap mb-4">
      <h1 className="flex-grow-1">{t('patient.edit.headline')}</h1>
      <div>
        <Link to="/patients" className="btn btn-secondary">{t('patient.edit.back')}</Link>
      </div>
    </div>
    <form onSubmit={useFormResult.handleSubmit(updatePatient)} noValidate>
      <InputRow useFormResult={useFormResult} object="patient" field="id" disabled={true} type="number" />
      <InputRow useFormResult={useFormResult} object="patient" field="fullname" required={true} />
      <InputRow useFormResult={useFormResult} object="patient" field="cpf" />
      <InputRow useFormResult={useFormResult} object="patient" field="rg" />
      <InputRow useFormResult={useFormResult} object="patient" field="socialname" />
      <InputRow useFormResult={useFormResult} object="patient" field="user" required={true} type="select" options={userValues} />
      <InputRow useFormResult={useFormResult} object="patient" field="documents" type="multiselect" options={documentsValues} />
      <InputRow useFormResult={useFormResult} object="patient" field="healthInsurances" type="multiselect" options={healthInsurancesValues} />
      <input type="submit" value={t('patient.edit.headline')} className="btn btn-primary mt-4" />
    </form>
  </>);
}
