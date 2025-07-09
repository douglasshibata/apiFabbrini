import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';
import { handleServerError } from 'app/common/utils';
import { EmailsDTO } from 'app/emails/emails-model';
import axios from 'axios';
import useDocumentTitle from 'app/common/use-document-title';


export default function EmailsList() {
  const { t } = useTranslation();
  useDocumentTitle(t('emails.list.headline'));

  const [emailses, setEmailses] = useState<EmailsDTO[]>([]);
  const navigate = useNavigate();

  const getAllEmailses = async () => {
    try {
      const response = await axios.get('/api/emailss');
      setEmailses(response.data);
    } catch (error: any) {
      handleServerError(error, navigate);
    }
  };

  const confirmDelete = async (id: number) => {
    if (!confirm(t('delete.confirm'))) {
      return;
    }
    try {
      await axios.delete('/api/emailss/' + id);
      navigate('/emailss', {
            state: {
              msgInfo: t('emails.delete.success')
            }
          });
      getAllEmailses();
    } catch (error: any) {
      handleServerError(error, navigate);
    }
  };

  useEffect(() => {
    getAllEmailses();
  }, []);

  return (<>
    <div className="d-flex flex-wrap mb-4">
      <h1 className="flex-grow-1">{t('emails.list.headline')}</h1>
      <div>
        <Link to="/emailss/add" className="btn btn-primary ms-2">{t('emails.list.createNew')}</Link>
      </div>
    </div>
    {!emailses || emailses.length === 0 ? (
    <div>{t('emails.list.empty')}</div>
    ) : (
    <div className="table-responsive">
      <table className="table table-striped table-hover align-middle">
        <thead>
          <tr>
            <th scope="col">{t('emails.id.label')}</th>
            <th scope="col">{t('emails.email.label')}</th>
            <th scope="col">{t('emails.active.label')}</th>
            <th scope="col">{t('emails.newsletter.label')}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {emailses.map((emails) => (
          <tr key={emails.id}>
            <td>{emails.id}</td>
            <td>{emails.email}</td>
            <td>{emails.active?.toString()}</td>
            <td>{emails.newsletter}</td>
            <td>
              <div className="float-end text-nowrap">
                <Link to={'/emailss/edit/' + emails.id} className="btn btn-sm btn-secondary">{t('emails.list.edit')}</Link>
                <span> </span>
                <button type="button" onClick={() => confirmDelete(emails.id!)} className="btn btn-sm btn-secondary">{t('emails.list.delete')}</button>
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
