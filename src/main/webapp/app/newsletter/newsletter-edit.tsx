import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router';
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

export default function NewsletterEdit() {
  const { t } = useTranslation();
  useDocumentTitle(t('newsletter.edit.headline'));

  const navigate = useNavigate();
  const params = useParams();
  const currentId = +params.id!;

  const useFormResult = useForm({
    resolver: yupResolver(getSchema()),
  });

  const prepareForm = async () => {
    try {
      const data = (await axios.get('/api/newsletters/' + currentId)).data;
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

  const updateNewsletter = async (data: NewsletterDTO) => {
    window.scrollTo(0, 0);
    try {
      await axios.put('/api/newsletters/' + currentId, data);
      navigate('/newsletters', {
            state: {
              msgSuccess: t('newsletter.update.success')
            }
          });
    } catch (error: any) {
      handleServerError(error, navigate, useFormResult.setError, t);
    }
  };

  return (<>
    <div className="d-flex flex-wrap mb-4">
      <h1 className="flex-grow-1">{t('newsletter.edit.headline')}</h1>
      <div>
        <Link to="/newsletters" className="btn btn-secondary">{t('newsletter.edit.back')}</Link>
      </div>
    </div>
    <form onSubmit={useFormResult.handleSubmit(updateNewsletter)} noValidate>
      <InputRow useFormResult={useFormResult} object="newsletter" field="id" disabled={true} type="number" />
      <InputRow useFormResult={useFormResult} object="newsletter" field="title" />
      <InputRow useFormResult={useFormResult} object="newsletter" field="content" type="textarea" />
      <InputRow useFormResult={useFormResult} object="newsletter" field="file" type="file" downloadLink={'/api/phoness/' + currentId + '/file'} />
      <InputRow useFormResult={useFormResult} object="newsletter" field="deliveryDate" required={true} type="datetimepicker" />
      <input type="submit" value={t('newsletter.edit.headline')} className="btn btn-primary mt-4" />
    </form>
  </>);
}
