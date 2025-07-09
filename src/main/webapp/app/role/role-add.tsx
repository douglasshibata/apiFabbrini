import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';
import { handleServerError, setYupDefaults } from 'app/common/utils';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { RoleDTO } from 'app/role/role-model';
import axios from 'axios';
import InputRow from 'app/common/input-row/input-row';
import useDocumentTitle from 'app/common/use-document-title';
import * as yup from 'yup';


function getSchema() {
  setYupDefaults();
  return yup.object({
    type: yup.string().emptyToNull().max(255).required()
  });
}

export default function RoleAdd() {
  const { t } = useTranslation();
  useDocumentTitle(t('role.add.headline'));

  const navigate = useNavigate();

  const useFormResult = useForm({
    resolver: yupResolver(getSchema()),
  });

  const getMessage = (key: string) => {
    const messages: Record<string, string> = {
      ROLE_TYPE_UNIQUE: t('exists.role.type')
    };
    return messages[key];
  };

  const createRole = async (data: RoleDTO) => {
    window.scrollTo(0, 0);
    try {
      await axios.post('/api/roles', data);
      navigate('/roles', {
            state: {
              msgSuccess: t('role.create.success')
            }
          });
    } catch (error: any) {
      handleServerError(error, navigate, useFormResult.setError, t, getMessage);
    }
  };

  return (<>
    <div className="d-flex flex-wrap mb-4">
      <h1 className="flex-grow-1">{t('role.add.headline')}</h1>
      <div>
        <Link to="/roles" className="btn btn-secondary">{t('role.add.back')}</Link>
      </div>
    </div>
    <form onSubmit={useFormResult.handleSubmit(createRole)} noValidate>
      <InputRow useFormResult={useFormResult} object="role" field="type" required={true} />
      <input type="submit" value={t('role.add.headline')} className="btn btn-primary mt-4" />
    </form>
  </>);
}
