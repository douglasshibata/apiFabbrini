import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';
import { handleServerError } from 'app/common/utils';
import { PasswordTokenDTO } from 'app/password-token/password-token-model';
import axios from 'axios';
import useDocumentTitle from 'app/common/use-document-title';


export default function PasswordTokenList() {
  const { t } = useTranslation();
  useDocumentTitle(t('passwordToken.list.headline'));

  const [passwordTokens, setPasswordTokens] = useState<PasswordTokenDTO[]>([]);
  const navigate = useNavigate();

  const getAllPasswordTokens = async () => {
    try {
      const response = await axios.get('/api/passwordTokens');
      setPasswordTokens(response.data);
    } catch (error: any) {
      handleServerError(error, navigate);
    }
  };

  const confirmDelete = async (id: number) => {
    if (!confirm(t('delete.confirm'))) {
      return;
    }
    try {
      await axios.delete('/api/passwordTokens/' + id);
      navigate('/passwordTokens', {
            state: {
              msgInfo: t('passwordToken.delete.success')
            }
          });
      getAllPasswordTokens();
    } catch (error: any) {
      handleServerError(error, navigate);
    }
  };

  useEffect(() => {
    getAllPasswordTokens();
  }, []);

  return (<>
    <div className="d-flex flex-wrap mb-4">
      <h1 className="flex-grow-1">{t('passwordToken.list.headline')}</h1>
      <div>
        <Link to="/passwordTokens/add" className="btn btn-primary ms-2">{t('passwordToken.list.createNew')}</Link>
      </div>
    </div>
    {!passwordTokens || passwordTokens.length === 0 ? (
    <div>{t('passwordToken.list.empty')}</div>
    ) : (
    <div className="table-responsive">
      <table className="table table-striped table-hover align-middle">
        <thead>
          <tr>
            <th scope="col">{t('passwordToken.id.label')}</th>
            <th scope="col">{t('passwordToken.token.label')}</th>
            <th scope="col">{t('passwordToken.expirationTime.label')}</th>
            <th scope="col">{t('passwordToken.typeToken.label')}</th>
            <th scope="col">{t('passwordToken.used.label')}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {passwordTokens.map((passwordToken) => (
          <tr key={passwordToken.id}>
            <td>{passwordToken.id}</td>
            <td>{passwordToken.token}</td>
            <td>{passwordToken.expirationTime}</td>
            <td>{passwordToken.typeToken}</td>
            <td>{passwordToken.used?.toString()}</td>
            <td>
              <div className="float-end text-nowrap">
                <Link to={'/passwordTokens/edit/' + passwordToken.id} className="btn btn-sm btn-secondary">{t('passwordToken.list.edit')}</Link>
                <span> </span>
                <button type="button" onClick={() => confirmDelete(passwordToken.id!)} className="btn btn-sm btn-secondary">{t('passwordToken.list.delete')}</button>
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
