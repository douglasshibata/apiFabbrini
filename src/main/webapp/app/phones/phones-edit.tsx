import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router';
import { handleServerError, setYupDefaults } from 'app/common/utils';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { PhonesDTO } from 'app/phones/phones-model';
import axios from 'axios';
import InputRow from 'app/common/input-row/input-row';
import useDocumentTitle from 'app/common/use-document-title';
import * as yup from 'yup';


function getSchema() {
  setYupDefaults();
  return yup.object({
    ddd: yup.string().emptyToNull().max(4),
    number: yup.string().emptyToNull().max(40),
    user: yup.number().integer().emptyToNull()
  });
}

export default function PhonesEdit() {
  const { t } = useTranslation();
  useDocumentTitle(t('phones.edit.headline'));

  const navigate = useNavigate();
  const [userValues, setUserValues] = useState<Map<number,string>>(new Map());
  const params = useParams();
  const currentId = +params.id!;

  const useFormResult = useForm({
    resolver: yupResolver(getSchema()),
  });

  const prepareForm = async () => {
    try {
      const userValuesResponse = await axios.get('/api/phoness/userValues');
      setUserValues(userValuesResponse.data);
      const data = (await axios.get('/api/phoness/' + currentId)).data;
      useFormResult.reset(data);
    } catch (error: any) {
      handleServerError(error, navigate);
    }
  };

  useEffect(() => {
    prepareForm();
  }, []);

  const updatePhones = async (data: PhonesDTO) => {
    window.scrollTo(0, 0);
    try {
      await axios.put('/api/phoness/' + currentId, data);
      navigate('/phoness', {
            state: {
              msgSuccess: t('phones.update.success')
            }
          });
    } catch (error: any) {
      handleServerError(error, navigate, useFormResult.setError, t);
    }
  };

  return (<>
    <div className="d-flex flex-wrap mb-4">
      <h1 className="flex-grow-1">{t('phones.edit.headline')}</h1>
      <div>
        <Link to="/phoness" className="btn btn-secondary">{t('phones.edit.back')}</Link>
      </div>
    </div>
    <form onSubmit={useFormResult.handleSubmit(updatePhones)} noValidate>
      <InputRow useFormResult={useFormResult} object="phones" field="id" disabled={true} type="number" />
      <InputRow useFormResult={useFormResult} object="phones" field="ddd" />
      <InputRow useFormResult={useFormResult} object="phones" field="number" />
      <InputRow useFormResult={useFormResult} object="phones" field="user" type="select" options={userValues} />
      <input type="submit" value={t('phones.edit.headline')} className="btn btn-primary mt-4" />
    </form>
  </>);
}
