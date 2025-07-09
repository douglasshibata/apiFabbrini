import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';
import { handleServerError } from 'app/common/utils';
import { RoleDTO } from 'app/role/role-model';
import axios from 'axios';
import useDocumentTitle from 'app/common/use-document-title';


export default function RoleList() {
  const { t } = useTranslation();
  useDocumentTitle(t('role.list.headline'));

  const [roles, setRoles] = useState<RoleDTO[]>([]);
  const navigate = useNavigate();

  const getAllRoles = async () => {
    try {
      const response = await axios.get('/api/roles');
      setRoles(response.data);
    } catch (error: any) {
      handleServerError(error, navigate);
    }
  };

  const confirmDelete = async (id: number) => {
    if (!confirm(t('delete.confirm'))) {
      return;
    }
    try {
      await axios.delete('/api/roles/' + id);
      navigate('/roles', {
            state: {
              msgInfo: t('role.delete.success')
            }
          });
      getAllRoles();
    } catch (error: any) {
      if (error?.response?.data?.code === 'REFERENCED') {
        const messageParts = error.response.data.message.split(',');
        navigate('/roles', {
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
    getAllRoles();
  }, []);

  return (<>
    <div className="d-flex flex-wrap mb-4">
      <h1 className="flex-grow-1">{t('role.list.headline')}</h1>
      <div>
        <Link to="/roles/add" className="btn btn-primary ms-2">{t('role.list.createNew')}</Link>
      </div>
    </div>
    {!roles || roles.length === 0 ? (
    <div>{t('role.list.empty')}</div>
    ) : (
    <div className="table-responsive">
      <table className="table table-striped table-hover align-middle">
        <thead>
          <tr>
            <th scope="col">{t('role.id.label')}</th>
            <th scope="col">{t('role.type.label')}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
          <tr key={role.id}>
            <td>{role.id}</td>
            <td>{role.type}</td>
            <td>
              <div className="float-end text-nowrap">
                <Link to={'/roles/edit/' + role.id} className="btn btn-sm btn-secondary">{t('role.list.edit')}</Link>
                <span> </span>
                <button type="button" onClick={() => confirmDelete(role.id!)} className="btn btn-sm btn-secondary">{t('role.list.delete')}</button>
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
