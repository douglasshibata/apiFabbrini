import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';
import { handleServerError, setYupDefaults } from 'app/common/utils';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { AlertDTO } from 'app/alert/alert-model';
import axios from 'axios';
import InputRow from 'app/common/input-row/input-row';
import useDocumentTitle from 'app/common/use-document-title';
import * as yup from 'yup';


function getSchema() {
  setYupDefaults();
  return yup.object({
    description: yup.string().emptyToNull().required(),
    expirationTime: yup.string().emptyToNull().required(),
    active: yup.bool(),
    alertType: yup.string().emptyToNull().max(255)
  });
}

export default function AlertAdd() {
  const { t } = useTranslation();
  useDocumentTitle(t('alert.add.headline'));

  const navigate = useNavigate();

  const useFormResult = useForm({
    resolver: yupResolver(getSchema()),
  });

  const createAlert = async (data: AlertDTO) => {
    window.scrollTo(0, 0);
    try {
      await axios.post('/api/alerts', data);
      navigate('/alerts', {
            state: {
              msgSuccess: t('alert.create.success')
            }
          });
    } catch (error: any) {
      handleServerError(error, navigate, useFormResult.setError, t);
    }
  };

  return (<>
    <div className="d-flex flex-wrap mb-4">
      <h1 className="flex-grow-1">{t('alert.add.headline')}</h1>
      <div>
        <Link to="/alerts" className="btn btn-secondary">{t('alert.add.back')}</Link>
      </div>
    </div>
    <form onSubmit={useFormResult.handleSubmit(createAlert)} noValidate>
      <InputRow useFormResult={useFormResult} object="alert" field="description" required={true} type="textarea" />
      <InputRow useFormResult={useFormResult} object="alert" field="expirationTime" required={true} type="datetimepicker" />
      <InputRow useFormResult={useFormResult} object="alert" field="active" type="checkbox" />
      <InputRow useFormResult={useFormResult} object="alert" field="alertType" />
      <input type="submit" value={t('alert.add.headline')} className="btn btn-primary mt-4" />
    </form>
  </>);
}
