import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';
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

export default function PasswordTokenAdd() {
  const { t } = useTranslation();
  useDocumentTitle(t('passwordToken.add.headline'));

  const navigate = useNavigate();

  const useFormResult = useForm({
    resolver: yupResolver(getSchema()),
  });

  const createPasswordToken = async (data: PasswordTokenDTO) => {
    window.scrollTo(0, 0);
    try {
      await axios.post('/api/passwordTokens', data);
      navigate('/passwordTokens', {
            state: {
              msgSuccess: t('passwordToken.create.success')
            }
          });
    } catch (error: any) {
      handleServerError(error, navigate, useFormResult.setError, t);
    }
  };

  return (<>
    <div className="d-flex flex-wrap mb-4">
      <h1 className="flex-grow-1">{t('passwordToken.add.headline')}</h1>
      <div>
        <Link to="/passwordTokens" className="btn btn-secondary">{t('passwordToken.add.back')}</Link>
      </div>
    </div>
    <form onSubmit={useFormResult.handleSubmit(createPasswordToken)} noValidate>
      <InputRow useFormResult={useFormResult} object="passwordToken" field="token" />
      <InputRow useFormResult={useFormResult} object="passwordToken" field="expirationTime" type="datetimepicker" />
      <InputRow useFormResult={useFormResult} object="passwordToken" field="typeToken" />
      <InputRow useFormResult={useFormResult} object="passwordToken" field="used" type="checkbox" />
      <input type="submit" value={t('passwordToken.add.headline')} className="btn btn-primary mt-4" />
    </form>
  </>);
}
