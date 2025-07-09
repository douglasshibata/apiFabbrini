import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';
import { handleServerError } from 'app/common/utils';
import { UserDTO } from 'app/user/user-model';
import axios from 'axios';
import useDocumentTitle from 'app/common/use-document-title';


export default function UserList() {
  const { t } = useTranslation();
  useDocumentTitle(t('user.list.headline'));

  const [users, setUsers] = useState<UserDTO[]>([]);
  const navigate = useNavigate();

  const getAllUsers = async () => {
    try {
      const response = await axios.get('/api/users');
      setUsers(response.data);
    } catch (error: any) {
      handleServerError(error, navigate);
    }
  };

  const confirmDelete = async (id: number) => {
    if (!confirm(t('delete.confirm'))) {
      return;
    }
    try {
      await axios.delete('/api/users/' + id);
      navigate('/users', {
            state: {
              msgInfo: t('user.delete.success')
            }
          });
      getAllUsers();
    } catch (error: any) {
      if (error?.response?.data?.code === 'REFERENCED') {
        const messageParts = error.response.data.message.split(',');
        navigate('/users', {
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
    getAllUsers();
  }, []);

  return (<>
    <div className="d-flex flex-wrap mb-4">
      <h1 className="flex-grow-1">{t('user.list.headline')}</h1>
      <div>
        <Link to="/users/add" className="btn btn-primary ms-2">{t('user.list.createNew')}</Link>
      </div>
    </div>
    {!users || users.length === 0 ? (
    <div>{t('user.list.empty')}</div>
    ) : (
    <div className="table-responsive">
      <table className="table table-striped table-hover align-middle">
        <thead>
          <tr>
            <th scope="col">{t('user.id.label')}</th>
            <th scope="col">{t('user.email.label')}</th>
            <th scope="col">{t('user.password.label')}</th>
            <th scope="col">{t('user.fullname.label')}</th>
            <th scope="col">{t('user.active.label')}</th>
            <th scope="col">{t('user.socialname.label')}</th>
            <th scope="col">{t('user.cpf.label')}</th>
            <th scope="col">{t('user.crm.label')}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
          <tr key={user.id}>
            <td>{user.id}</td>
            <td>{user.email}</td>
            <td>{user.password}</td>
            <td>{user.fullname}</td>
            <td>{user.active?.toString()}</td>
            <td>{user.socialname}</td>
            <td>{user.cpf}</td>
            <td>{user.crm}</td>
            <td>
              <div className="float-end text-nowrap">
                <Link to={'/users/edit/' + user.id} className="btn btn-sm btn-secondary">{t('user.list.edit')}</Link>
                <span> </span>
                <button type="button" onClick={() => confirmDelete(user.id!)} className="btn btn-sm btn-secondary">{t('user.list.delete')}</button>
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
