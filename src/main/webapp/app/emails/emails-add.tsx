import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';
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

export default function EmailsAdd() {
  const { t } = useTranslation();
  useDocumentTitle(t('emails.add.headline'));

  const navigate = useNavigate();
  const [newsletterValues, setNewsletterValues] = useState<Map<number,string>>(new Map());

  const useFormResult = useForm({
    resolver: yupResolver(getSchema()),
  });

  const prepareRelations = async () => {
    try {
      const newsletterValuesResponse = await axios.get('/api/emailss/newsletterValues');
      setNewsletterValues(newsletterValuesResponse.data);
    } catch (error: any) {
      handleServerError(error, navigate);
    }
  };

  useEffect(() => {
    prepareRelations();
  }, []);

  const createEmails = async (data: EmailsDTO) => {
    window.scrollTo(0, 0);
    try {
      await axios.post('/api/emailss', data);
      navigate('/emailss', {
            state: {
              msgSuccess: t('emails.create.success')
            }
          });
    } catch (error: any) {
      handleServerError(error, navigate, useFormResult.setError, t);
    }
  };

  return (<>
    <div className="d-flex flex-wrap mb-4">
      <h1 className="flex-grow-1">{t('emails.add.headline')}</h1>
      <div>
        <Link to="/emailss" className="btn btn-secondary">{t('emails.add.back')}</Link>
      </div>
    </div>
    <form onSubmit={useFormResult.handleSubmit(createEmails)} noValidate>
      <InputRow useFormResult={useFormResult} object="emails" field="email" />
      <InputRow useFormResult={useFormResult} object="emails" field="active" type="checkbox" />
      <InputRow useFormResult={useFormResult} object="emails" field="newsletter" type="select" options={newsletterValues} />
      <input type="submit" value={t('emails.add.headline')} className="btn btn-primary mt-4" />
    </form>
  </>);
}
