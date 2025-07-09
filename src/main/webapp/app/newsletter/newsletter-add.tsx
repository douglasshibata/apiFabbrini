import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';
import { handleServerError, setYupDefaults } from 'app/common/utils';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { NewsletterDTO } from 'app/newsletter/newsletter-model';
import axios from 'axios';
import InputRow from 'app/common/input-row/input-row';
import useDocumentTitle from 'app/common/use-document-title';
import * as yup from 'yup';


function getSchema() {
  setYupDefaults();
  return yup.object({
    title: yup.string().emptyToNull().max(255),
    content: yup.string().emptyToNull(),
    file: yup.object().emptyToNull().json(),
    deliveryDate: yup.string().emptyToNull().required()
  });
}

export default function NewsletterAdd() {
  const { t } = useTranslation();
  useDocumentTitle(t('newsletter.add.headline'));

  const navigate = useNavigate();

  const useFormResult = useForm({
    resolver: yupResolver(getSchema()),
  });

  const createNewsletter = async (data: NewsletterDTO) => {
    window.scrollTo(0, 0);
    try {
      await axios.post('/api/newsletters', data);
      navigate('/newsletters', {
            state: {
              msgSuccess: t('newsletter.create.success')
            }
          });
    } catch (error: any) {
      handleServerError(error, navigate, useFormResult.setError, t);
    }
  };

  return (<>
    <div className="d-flex flex-wrap mb-4">
      <h1 className="flex-grow-1">{t('newsletter.add.headline')}</h1>
      <div>
        <Link to="/newsletters" className="btn btn-secondary">{t('newsletter.add.back')}</Link>
      </div>
    </div>
    <form onSubmit={useFormResult.handleSubmit(createNewsletter)} noValidate>
      <InputRow useFormResult={useFormResult} object="newsletter" field="title" />
      <InputRow useFormResult={useFormResult} object="newsletter" field="content" type="textarea" />
      <InputRow useFormResult={useFormResult} object="newsletter" field="file" type="file" />
      <InputRow useFormResult={useFormResult} object="newsletter" field="deliveryDate" required={true} type="datetimepicker" />
      <input type="submit" value={t('newsletter.add.headline')} className="btn btn-primary mt-4" />
    </form>
  </>);
}
