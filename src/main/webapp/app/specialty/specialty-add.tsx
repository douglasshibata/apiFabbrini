import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';
import { handleServerError, setYupDefaults } from 'app/common/utils';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { SpecialtyDTO } from 'app/specialty/specialty-model';
import axios from 'axios';
import InputRow from 'app/common/input-row/input-row';
import useDocumentTitle from 'app/common/use-document-title';
import * as yup from 'yup';


function getSchema() {
  setYupDefaults();
  return yup.object({
    name: yup.string().emptyToNull().max(255).required(),
    description: yup.string().emptyToNull().max(255)
  });
}

export default function SpecialtyAdd() {
  const { t } = useTranslation();
  useDocumentTitle(t('specialty.add.headline'));

  const navigate = useNavigate();

  const useFormResult = useForm({
    resolver: yupResolver(getSchema()),
  });

  const createSpecialty = async (data: SpecialtyDTO) => {
    window.scrollTo(0, 0);
    try {
      await axios.post('/api/specialties', data);
      navigate('/specialties', {
            state: {
              msgSuccess: t('specialty.create.success')
            }
          });
    } catch (error: any) {
      handleServerError(error, navigate, useFormResult.setError, t);
    }
  };

  return (<>
    <div className="d-flex flex-wrap mb-4">
      <h1 className="flex-grow-1">{t('specialty.add.headline')}</h1>
      <div>
        <Link to="/specialties" className="btn btn-secondary">{t('specialty.add.back')}</Link>
      </div>
    </div>
    <form onSubmit={useFormResult.handleSubmit(createSpecialty)} noValidate>
      <InputRow useFormResult={useFormResult} object="specialty" field="name" required={true} />
      <InputRow useFormResult={useFormResult} object="specialty" field="description" />
      <input type="submit" value={t('specialty.add.headline')} className="btn btn-primary mt-4" />
    </form>
  </>);
}
