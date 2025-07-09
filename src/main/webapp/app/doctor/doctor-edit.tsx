import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router';
import { handleServerError, setYupDefaults } from 'app/common/utils';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { DoctorDTO } from 'app/doctor/doctor-model';
import axios from 'axios';
import InputRow from 'app/common/input-row/input-row';
import useDocumentTitle from 'app/common/use-document-title';
import * as yup from 'yup';


function getSchema() {
  setYupDefaults();
  return yup.object({
    conselho: yup.string().emptyToNull().max(255),
    ufconselho: yup.string().emptyToNull().max(255),
    registro: yup.string().emptyToNull().max(255),
    title: yup.string().emptyToNull().max(255),
    user: yup.number().integer().emptyToNull(),
    specialty: yup.number().integer().emptyToNull(),
    healthinsurances: yup.array(yup.number().required()).emptyToNull().json(),
    documents: yup.array(yup.number().required()).emptyToNull().json()
  });
}

export default function DoctorEdit() {
  const { t } = useTranslation();
  useDocumentTitle(t('doctor.edit.headline'));

  const navigate = useNavigate();
  const [userValues, setUserValues] = useState<Map<number,string>>(new Map());
  const [specialtyValues, setSpecialtyValues] = useState<Map<number,string>>(new Map());
  const [healthinsurancesValues, setHealthinsurancesValues] = useState<Map<number,string>>(new Map());
  const [documentsValues, setDocumentsValues] = useState<Map<number,string>>(new Map());
  const params = useParams();
  const currentId = +params.id!;

  const useFormResult = useForm({
    resolver: yupResolver(getSchema()),
  });

  const getMessage = (key: string) => {
    const messages: Record<string, string> = {
      DOCTOR_USER_UNIQUE: t('Exists.doctor.user')
    };
    return messages[key];
  };

  const prepareForm = async () => {
    try {
      const userValuesResponse = await axios.get('/api/doctors/userValues');
      setUserValues(userValuesResponse.data);
      const specialtyValuesResponse = await axios.get('/api/doctors/specialtyValues');
      setSpecialtyValues(specialtyValuesResponse.data);
      const healthinsurancesValuesResponse = await axios.get('/api/doctors/healthinsurancesValues');
      setHealthinsurancesValues(healthinsurancesValuesResponse.data);
      const documentsValuesResponse = await axios.get('/api/doctors/documentsValues');
      setDocumentsValues(documentsValuesResponse.data);
      const data = (await axios.get('/api/doctors/' + currentId)).data;
      if (data.healthinsurances) {
        data.healthinsurances = JSON.stringify(data.healthinsurances, undefined, 2);
      }
      if (data.documents) {
        data.documents = JSON.stringify(data.documents, undefined, 2);
      }
      useFormResult.reset(data);
    } catch (error: any) {
      handleServerError(error, navigate);
    }
  };

  useEffect(() => {
    prepareForm();
  }, []);

  const updateDoctor = async (data: DoctorDTO) => {
    window.scrollTo(0, 0);
    try {
      await axios.put('/api/doctors/' + currentId, data);
      navigate('/doctors', {
            state: {
              msgSuccess: t('doctor.update.success')
            }
          });
    } catch (error: any) {
      handleServerError(error, navigate, useFormResult.setError, t, getMessage);
    }
  };

  return (<>
    <div className="d-flex flex-wrap mb-4">
      <h1 className="flex-grow-1">{t('doctor.edit.headline')}</h1>
      <div>
        <Link to="/doctors" className="btn btn-secondary">{t('doctor.edit.back')}</Link>
      </div>
    </div>
    <form onSubmit={useFormResult.handleSubmit(updateDoctor)} noValidate>
      <InputRow useFormResult={useFormResult} object="doctor" field="id" disabled={true} type="number" />
      <InputRow useFormResult={useFormResult} object="doctor" field="conselho" />
      <InputRow useFormResult={useFormResult} object="doctor" field="ufconselho" />
      <InputRow useFormResult={useFormResult} object="doctor" field="registro" />
      <InputRow useFormResult={useFormResult} object="doctor" field="title" />
      <InputRow useFormResult={useFormResult} object="doctor" field="user" type="select" options={userValues} />
      <InputRow useFormResult={useFormResult} object="doctor" field="specialty" type="select" options={specialtyValues} />
      <InputRow useFormResult={useFormResult} object="doctor" field="healthinsurances" type="multiselect" options={healthinsurancesValues} />
      <InputRow useFormResult={useFormResult} object="doctor" field="documents" type="multiselect" options={documentsValues} />
      <input type="submit" value={t('doctor.edit.headline')} className="btn btn-primary mt-4" />
    </form>
  </>);
}
