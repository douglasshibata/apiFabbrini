import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';
import { handleServerError } from 'app/common/utils';
import { NewsletterDTO } from 'app/newsletter/newsletter-model';
import axios from 'axios';
import useDocumentTitle from 'app/common/use-document-title';


export default function NewsletterList() {
  const { t } = useTranslation();
  useDocumentTitle(t('newsletter.list.headline'));

  const [newsletters, setNewsletters] = useState<NewsletterDTO[]>([]);
  const navigate = useNavigate();

  const getAllNewsletters = async () => {
    try {
      const response = await axios.get('/api/newsletters');
      setNewsletters(response.data);
    } catch (error: any) {
      handleServerError(error, navigate);
    }
  };

  const confirmDelete = async (id: number) => {
    if (!confirm(t('delete.confirm'))) {
      return;
    }
    try {
      await axios.delete('/api/newsletters/' + id);
      navigate('/newsletters', {
            state: {
              msgInfo: t('newsletter.delete.success')
            }
          });
      getAllNewsletters();
    } catch (error: any) {
      if (error?.response?.data?.code === 'REFERENCED') {
        const messageParts = error.response.data.message.split(',');
        navigate('/newsletters', {
              state: {
                msgError: t(messageParts[0]!, { id: messageParts[1]! })
              }
            });
        return;
      }
      handleServerError(error, navigate);
    }
  };

  useEffect(() => {
    getAllNewsletters();
  }, []);

  return (<>
    <div className="d-flex flex-wrap mb-4">
      <h1 className="flex-grow-1">{t('newsletter.list.headline')}</h1>
      <div>
        <Link to="/newsletters/add" className="btn btn-primary ms-2">{t('newsletter.list.createNew')}</Link>
      </div>
    </div>
    {!newsletters || newsletters.length === 0 ? (
    <div>{t('newsletter.list.empty')}</div>
    ) : (
    <div className="table-responsive">
      <table className="table table-striped table-hover align-middle">
        <thead>
          <tr>
            <th scope="col">{t('newsletter.id.label')}</th>
            <th scope="col">{t('newsletter.title.label')}</th>
            <th scope="col">{t('newsletter.deliveryDate.label')}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {newsletters.map((newsletter) => (
          <tr key={newsletter.id}>
            <td>{newsletter.id}</td>
            <td>{newsletter.title}</td>
            <td>{newsletter.deliveryDate}</td>
            <td>
              <div className="float-end text-nowrap">
                <Link to={'/newsletters/edit/' + newsletter.id} className="btn btn-sm btn-secondary">{t('newsletter.list.edit')}</Link>
                <span> </span>
                <button type="button" onClick={() => confirmDelete(newsletter.id!)} className="btn btn-sm btn-secondary">{t('newsletter.list.delete')}</button>
              </div>
            </td>
          </tr>
          ))}
        </tbody>
      </table>
    </div>
    )}
  </>);
}
