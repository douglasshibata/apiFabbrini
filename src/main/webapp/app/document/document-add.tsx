import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';
import { handleServerError, setYupDefaults } from 'app/common/utils';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { DocumentDTO } from 'app/document/document-model';
import axios from 'axios';
import InputRow from 'app/common/input-row/input-row';
import useDocumentTitle from 'app/common/use-document-title';
import * as yup from 'yup';


function getSchema() {
  setYupDefaults();
  return yup.object({
    documentType: yup.string().emptyToNull(),
    file: yup.object().emptyToNull().json().required(),
    filename: yup.string().emptyToNull().max(255),
    fileType: yup.string().emptyToNull().max(255)
  });
}

export default function DocumentAdd() {
  const { t } = useTranslation();
  useDocumentTitle(t('document.add.headline'));

  const navigate = useNavigate();

  const useFormResult = useForm({
    resolver: yupResolver(getSchema()),
  });

  const createDocument = async (data: DocumentDTO) => {
    window.scrollTo(0, 0);
    try {
      await axios.post('/api/documents', data);
      navigate('/documents', {
            state: {
              msgSuccess: t('document.create.success')
            }
          });
    } catch (error: any) {
      handleServerError(error, navigate, useFormResult.setError, t);
    }
  };

  return (<>
    <div className="d-flex flex-wrap mb-4">
      <h1 className="flex-grow-1">{t('document.add.headline')}</h1>
      <div>
        <Link to="/documents" className="btn btn-secondary">{t('document.add.back')}</Link>
      </div>
    </div>
    <form onSubmit={useFormResult.handleSubmit(createDocument)} noValidate>
      <InputRow useFormResult={useFormResult} object="document" field="documentType" required={true} type="select" options={{'CPF': 'CPF', 'RG': 'RG', 'ATESTADO': 'ATESTADO', 'PLANOSAUDE': 'PLANOSAUDE', 'NEWSLETTER': 'NEWSLETTER', 'OTHERS': 'OTHERS'}} />
      <InputRow useFormResult={useFormResult} object="document" field="file" required={true} type="file" />
      <InputRow useFormResult={useFormResult} object="document" field="filename" />
      <InputRow useFormResult={useFormResult} object="document" field="fileType" />
      <input type="submit" value={t('document.add.headline')} className="btn btn-primary mt-4" />
    </form>
  </>);
}
