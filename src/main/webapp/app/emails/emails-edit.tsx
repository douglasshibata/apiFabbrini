import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router';
import { handleServerError, setYupDefaults } from 'app/common/utils';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { EmailsDTO } from 'app/emails/emails-model';
import axios from 'axios';
import InputRow from 'app/common/input-row/input-row';
import useDocumentTitle from 'app/common/use-document-title';
import * as yup from 'yup';


function getSchema() {
  setYupDefaults();
  return yup.object({
    email: yup.string().emptyToNull().max(255),
    active: yup.bool(),
    newsletter: yup.number().integer().emptyToNull()
  });
}

export default function EmailsEdit() {
  const { t } = useTranslation();
  useDocumentTitle(t('emails.edit.headline'));

  const navigate = useNavigate();
  const [newsletterValues, setNewsletterValues] = useState<Map<number,string>>(new Map());
  const params = useParams();
  const currentId = +params.id!;

  const useFormResult = useForm({
    resolver: yupResolver(getSchema()),
  });

  const prepareForm = async () => {
    try {
      const newsletterValuesResponse = await axios.get('/api/emailss/newsletterValues');
      setNewsletterValues(newsletterValuesResponse.data);
      const data = (await axios.get('/api/emailss/' + currentId)).data;
      useFormResult.reset(data);
    } catch (error: any) {
      handleServerError(error, navigate);
    }
  };

  useEffect(() => {
    prepareForm();
  }, []);

  const updateEmails = async (data: EmailsDTO) => {
    window.scrollTo(0, 0);
    try {
      await axios.put('/api/emailss/' + currentId, data);
      navigate('/emailss', {
            state: {
              msgSuccess: t('emails.update.success')
            }
          });
    } catch (error: any) {
      handleServerError(error, navigate, useFormResult.setError, t);
    }
  };

  return (<>
    <div className="d-flex flex-wrap mb-4">
      <h1 className="flex-grow-1">{t('emails.edit.headline')}</h1>
      <div>
        <Link to="/emailss" className="btn btn-secondary">{t('emails.edit.back')}</Link>
      </div>
    </div>
    <form onSubmit={useFormResult.handleSubmit(updateEmails)} noValidate>
      <InputRow useFormResult={useFormResult} object="emails" field="id" disabled={true} type="number" />
      <InputRow useFormResult={useFormResult} object="emails" field="email" />
      <InputRow useFormResult={useFormResult} object="emails" field="active" type="checkbox" />
      <InputRow useFormResult={useFormResult} object="emails" field="newsletter" type="select" options={newsletterValues} />
      <input type="submit" value={t('emails.edit.headline')} className="btn btn-primary mt-4" />
    </form>
  </>);
}
