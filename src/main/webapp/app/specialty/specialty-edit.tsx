import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router';
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

export default function SpecialtyEdit() {
  const { t } = useTranslation();
  useDocumentTitle(t('specialty.edit.headline'));

  const navigate = useNavigate();
  const params = useParams();
  const currentId = +params.id!;

  const useFormResult = useForm({
    resolver: yupResolver(getSchema()),
  });

  const prepareForm = async () => {
    try {
      const data = (await axios.get('/api/specialties/' + currentId)).data;
      useFormResult.reset(data);
    } catch (error: any) {
      handleServerError(error, navigate);
    }
  };

  useEffect(() => {
    prepareForm();
  }, []);

  const updateSpecialty = async (data: SpecialtyDTO) => {
    window.scrollTo(0, 0);
    try {
      await axios.put('/api/specialties/' + currentId, data);
      navigate('/specialties', {
            state: {
              msgSuccess: t('specialty.update.success')
            }
          });
    } catch (error: any) {
      handleServerError(error, navigate, useFormResult.setError, t);
    }
  };

  return (<>
    <div className="d-flex flex-wrap mb-4">
      <h1 className="flex-grow-1">{t('specialty.edit.headline')}</h1>
      <div>
        <Link to="/specialties" className="btn btn-secondary">{t('specialty.edit.back')}</Link>
      </div>
    </div>
    <form onSubmit={useFormResult.handleSubmit(updateSpecialty)} noValidate>
      <InputRow useFormResult={useFormResult} object="specialty" field="id" disabled={true} type="number" />
      <InputRow useFormResult={useFormResult} object="specialty" field="name" required={true} />
      <InputRow useFormResult={useFormResult} object="specialty" field="description" />
      <input type="submit" value={t('specialty.edit.headline')} className="btn btn-primary mt-4" />
    </form>
  </>);
}
