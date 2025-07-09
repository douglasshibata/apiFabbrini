import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';
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

export default function PhonesAdd() {
  const { t } = useTranslation();
  useDocumentTitle(t('phones.add.headline'));

  const navigate = useNavigate();
  const [userValues, setUserValues] = useState<Map<number,string>>(new Map());

  const useFormResult = useForm({
    resolver: yupResolver(getSchema()),
  });

  const prepareRelations = async () => {
    try {
      const userValuesResponse = await axios.get('/api/phoness/userValues');
      setUserValues(userValuesResponse.data);
    } catch (error: any) {
      handleServerError(error, navigate);
    }
  };

  useEffect(() => {
    prepareRelations();
  }, []);

  const createPhones = async (data: PhonesDTO) => {
    window.scrollTo(0, 0);
    try {
      await axios.post('/api/phoness', data);
      navigate('/phoness', {
            state: {
              msgSuccess: t('phones.create.success')
            }
          });
    } catch (error: any) {
      handleServerError(error, navigate, useFormResult.setError, t);
    }
  };

  return (<>
    <div className="d-flex flex-wrap mb-4">
      <h1 className="flex-grow-1">{t('phones.add.headline')}</h1>
      <div>
        <Link to="/phoness" className="btn btn-secondary">{t('phones.add.back')}</Link>
      </div>
    </div>
    <form onSubmit={useFormResult.handleSubmit(createPhones)} noValidate>
      <InputRow useFormResult={useFormResult} object="phones" field="ddd" />
      <InputRow useFormResult={useFormResult} object="phones" field="number" />
      <InputRow useFormResult={useFormResult} object="phones" field="user" type="select" options={userValues} />
      <input type="submit" value={t('phones.add.headline')} className="btn btn-primary mt-4" />
    </form>
  </>);
}
