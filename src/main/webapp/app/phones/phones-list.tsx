import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';
import { handleServerError } from 'app/common/utils';
import { PhonesDTO } from 'app/phones/phones-model';
import axios from 'axios';
import useDocumentTitle from 'app/common/use-document-title';


export default function PhonesList() {
  const { t } = useTranslation();
  useDocumentTitle(t('phones.list.headline'));

  const [phoneses, setPhoneses] = useState<PhonesDTO[]>([]);
  const navigate = useNavigate();

  const getAllPhoneses = async () => {
    try {
      const response = await axios.get('/api/phoness');
      setPhoneses(response.data);
    } catch (error: any) {
      handleServerError(error, navigate);
    }
  };

  const confirmDelete = async (id: number) => {
    if (!confirm(t('delete.confirm'))) {
      return;
    }
    try {
      await axios.delete('/api/phoness/' + id);
      navigate('/phoness', {
            state: {
              msgInfo: t('phones.delete.success')
            }
          });
      getAllPhoneses();
    } catch (error: any) {
      if (error?.response?.data?.code === 'REFERENCED') {
        const messageParts = error.response.data.message.split(',');
        navigate('/phoness', {
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
    getAllPhoneses();
  }, []);

  return (<>
    <div className="d-flex flex-wrap mb-4">
      <h1 className="flex-grow-1">{t('phones.list.headline')}</h1>
      <div>
        <Link to="/phoness/add" className="btn btn-primary ms-2">{t('phones.list.createNew')}</Link>
      </div>
    </div>
    {!phoneses || phoneses.length === 0 ? (
    <div>{t('phones.list.empty')}</div>
    ) : (
    <div className="table-responsive">
      <table className="table table-striped table-hover align-middle">
        <thead>
          <tr>
            <th scope="col">{t('phones.id.label')}</th>
            <th scope="col">{t('phones.ddd.label')}</th>
            <th scope="col">{t('phones.number.label')}</th>
            <th scope="col">{t('phones.user.label')}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {phoneses.map((phones) => (
          <tr key={phones.id}>
            <td>{phones.id}</td>
            <td>{phones.ddd}</td>
            <td>{phones.number}</td>
            <td>{phones.user}</td>
            <td>
              <div className="float-end text-nowrap">
                <Link to={'/phoness/edit/' + phones.id} className="btn btn-sm btn-secondary">{t('phones.list.edit')}</Link>
                <span> </span>
                <button type="button" onClick={() => confirmDelete(phones.id!)} className="btn btn-sm btn-secondary">{t('phones.list.delete')}</button>
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
