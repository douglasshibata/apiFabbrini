import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router';
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

export default function DocumentEdit() {
  const { t } = useTranslation();
  useDocumentTitle(t('document.edit.headline'));

  const navigate = useNavigate();
  const params = useParams();
  const currentId = +params.id!;

  const useFormResult = useForm({
    resolver: yupResolver(getSchema()),
  });

  const prepareForm = async () => {
    try {
      const data = (await axios.get('/api/documents/' + currentId)).data;
      if (data.file) {
        data.file = JSON.stringify(data.file, undefined, 2);
      }
      useFormResult.reset(data);
    } catch (error: any) {
      handleServerError(error, navigate);
    }
  };

  useEffect(() => {
    prepareForm();
  }, []);

  const updateDocument = async (data: DocumentDTO) => {
    window.scrollTo(0, 0);
    try {
      await axios.put('/api/documents/' + currentId, data);
      navigate('/documents', {
            state: {
              msgSuccess: t('document.update.success')
            }
          });
    } catch (error: any) {
      handleServerError(error, navigate, useFormResult.setError, t);
    }
  };

  return (<>
    <div className="d-flex flex-wrap mb-4">
      <h1 className="flex-grow-1">{t('document.edit.headline')}</h1>
      <div>
        <Link to="/documents" className="btn btn-secondary">{t('document.edit.back')}</Link>
      </div>
    </div>
    <form onSubmit={useFormResult.handleSubmit(updateDocument)} noValidate>
      <InputRow useFormResult={useFormResult} object="document" field="id" disabled={true} type="number" />
      <InputRow useFormResult={useFormResult} object="document" field="documentType" required={true} type="select" options={{'CPF': 'CPF', 'RG': 'RG', 'ATESTADO': 'ATESTADO', 'PLANOSAUDE': 'PLANOSAUDE', 'NEWSLETTER': 'NEWSLETTER', 'OTHERS': 'OTHERS'}} />
      <InputRow useFormResult={useFormResult} object="document" field="file" required={true} type="file" downloadLink={'/api/phoness/' + currentId + '/file'} />
      <InputRow useFormResult={useFormResult} object="document" field="filename" />
      <InputRow useFormResult={useFormResult} object="document" field="fileType" />
      <input type="submit" value={t('document.edit.headline')} className="btn btn-primary mt-4" />
    </form>
  </>);
}
