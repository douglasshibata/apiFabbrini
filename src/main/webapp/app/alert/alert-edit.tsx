import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router';
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

export default function AlertEdit() {
  const { t } = useTranslation();
  useDocumentTitle(t('alert.edit.headline'));

  const navigate = useNavigate();
  const params = useParams();
  const currentId = +params.id!;

  const useFormResult = useForm({
    resolver: yupResolver(getSchema()),
  });

  const prepareForm = async () => {
    try {
      const data = (await axios.get('/api/alerts/' + currentId)).data;
      useFormResult.reset(data);
    } catch (error: any) {
      handleServerError(error, navigate);
    }
  };

  useEffect(() => {
    prepareForm();
  }, []);

  const updateAlert = async (data: AlertDTO) => {
    window.scrollTo(0, 0);
    try {
      await axios.put('/api/alerts/' + currentId, data);
      navigate('/alerts', {
            state: {
              msgSuccess: t('alert.update.success')
            }
          });
    } catch (error: any) {
      handleServerError(error, navigate, useFormResult.setError, t);
    }
  };

  return (<>
    <div className="d-flex flex-wrap mb-4">
      <h1 className="flex-grow-1">{t('alert.edit.headline')}</h1>
      <div>
        <Link to="/alerts" className="btn btn-secondary">{t('alert.edit.back')}</Link>
      </div>
    </div>
    <form onSubmit={useFormResult.handleSubmit(updateAlert)} noValidate>
      <InputRow useFormResult={useFormResult} object="alert" field="id" disabled={true} type="number" />
      <InputRow useFormResult={useFormResult} object="alert" field="description" required={true} type="textarea" />
      <InputRow useFormResult={useFormResult} object="alert" field="expirationTime" required={true} type="datetimepicker" />
      <InputRow useFormResult={useFormResult} object="alert" field="active" type="checkbox" />
      <InputRow useFormResult={useFormResult} object="alert" field="alertType" />
      <input type="submit" value={t('alert.edit.headline')} className="btn btn-primary mt-4" />
    </form>
  </>);
}
