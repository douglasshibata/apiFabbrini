import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';
import { handleServerError, setYupDefaults } from 'app/common/utils';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { UserDTO } from 'app/user/user-model';
import axios from 'axios';
import InputRow from 'app/common/input-row/input-row';
import useDocumentTitle from 'app/common/use-document-title';
import * as yup from 'yup';


function getSchema() {
  setYupDefaults();
  return yup.object({
    email: yup.string().emptyToNull().max(255).required(),
    password: yup.string().emptyToNull().max(255).required(),
    fullname: yup.string().emptyToNull().max(255).required(),
    active: yup.bool(),
    socialname: yup.string().emptyToNull().max(255),
    cpf: yup.string().emptyToNull().max(255).required(),
    crm: yup.string().emptyToNull().max(255),
    countAccess: yup.number().integer().emptyToNull(),
    role: yup.number().integer().emptyToNull()
  });
}

export default function UserAdd() {
  const { t } = useTranslation();
  useDocumentTitle(t('user.add.headline'));

  const navigate = useNavigate();
  const [roleValues, setRoleValues] = useState<Map<number,string>>(new Map());

  const useFormResult = useForm({
    resolver: yupResolver(getSchema()),
  });

  const getMessage = (key: string) => {
    const messages: Record<string, string> = {
      USER_EMAIL_UNIQUE: t('exists.user.email'),
      USER_CPF_UNIQUE: t('exists.user.cpf'),
      USER_ROLE_UNIQUE: t('Exists.user.role')
    };
    return messages[key];
  };

  const prepareRelations = async () => {
    try {
      const roleValuesResponse = await axios.get('/api/users/roleValues');
      setRoleValues(roleValuesResponse.data);
    } catch (error: any) {
      handleServerError(error, navigate);
    }
  };

  useEffect(() => {
    prepareRelations();
  }, []);

  const createUser = async (data: UserDTO) => {
    window.scrollTo(0, 0);
    try {
      await axios.post('/api/users', data);
      navigate('/users', {
            state: {
              msgSuccess: t('user.create.success')
            }
          });
    } catch (error: any) {
      handleServerError(error, navigate, useFormResult.setError, t, getMessage);
    }
  };

  return (<>
    <div className="d-flex flex-wrap mb-4">
      <h1 className="flex-grow-1">{t('user.add.headline')}</h1>
      <div>
        <Link to="/users" className="btn btn-secondary">{t('user.add.back')}</Link>
      </div>
    </div>
    <form onSubmit={useFormResult.handleSubmit(createUser)} noValidate>
      <InputRow useFormResult={useFormResult} object="user" field="email" required={true} />
      <InputRow useFormResult={useFormResult} object="user" field="password" required={true} />
      <InputRow useFormResult={useFormResult} object="user" field="fullname" required={true} />
      <InputRow useFormResult={useFormResult} object="user" field="active" type="checkbox" />
      <InputRow useFormResult={useFormResult} object="user" field="socialname" />
      <InputRow useFormResult={useFormResult} object="user" field="cpf" required={true} />
      <InputRow useFormResult={useFormResult} object="user" field="crm" />
      <InputRow useFormResult={useFormResult} object="user" field="countAccess" type="number" />
      <InputRow useFormResult={useFormResult} object="user" field="role" type="select" options={roleValues} />
      <input type="submit" value={t('user.add.headline')} className="btn btn-primary mt-4" />
    </form>
  </>);
}
