import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router';
import { handleServerError, setYupDefaults } from 'app/common/utils';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { PasswordTokenDTO } from 'app/password-token/password-token-model';
import axios from 'axios';
import InputRow from 'app/common/input-row/input-row';
import useDocumentTitle from 'app/common/use-document-title';
import * as yup from 'yup';


function getSchema() {
  setYupDefaults();
  return yup.object({
    token: yup.string().emptyToNull().uuid(),
    expirationTime: yup.string().emptyToNull(),
    typeToken: yup.string().emptyToNull().max(255),
    used: yup.bool()
  });
}

export default function PasswordTokenEdit() {
  const { t } = useTranslation();
  useDocumentTitle(t('passwordToken.edit.headline'));

  const navigate = useNavigate();
  const params = useParams();
  const currentId = +params.id!;

  const useFormResult = useForm({
    resolver: yupResolver(getSchema()),
  });

  const prepareForm = async () => {
    try {
      const data = (await axios.get('/api/passwordTokens/' + currentId)).data;
      useFormResult.reset(data);
    } catch (error: any) {
      handleServerError(error, navigate);
    }
  };

  useEffect(() => {
    prepareForm();
  }, []);

  const updatePasswordToken = async (data: PasswordTokenDTO) => {
    window.scrollTo(0, 0);
    try {
      await axios.put('/api/passwordTokens/' + currentId, data);
      navigate('/passwordTokens', {
            state: {
              msgSuccess: t('passwordToken.update.success')
            }
          });
    } catch (error: any) {
      handleServerError(error, navigate, useFormResult.setError, t);
    }
  };

  return (<>
    <div className="d-flex flex-wrap mb-4">
      <h1 className="flex-grow-1">{t('passwordToken.edit.headline')}</h1>
      <div>
        <Link to="/passwordTokens" className="btn btn-secondary">{t('passwordToken.edit.back')}</Link>
      </div>
    </div>
    <form onSubmit={useFormResult.handleSubmit(updatePasswordToken)} noValidate>
      <InputRow useFormResult={useFormResult} object="passwordToken" field="id" disabled={true} type="number" />
      <InputRow useFormResult={useFormResult} object="passwordToken" field="token" />
      <InputRow useFormResult={useFormResult} object="passwordToken" field="expirationTime" type="datetimepicker" />
      <InputRow useFormResult={useFormResult} object="passwordToken" field="typeToken" />
      <InputRow useFormResult={useFormResult} object="passwordToken" field="used" type="checkbox" />
      <input type="submit" value={t('passwordToken.edit.headline')} className="btn btn-primary mt-4" />
    </form>
  </>);
}
