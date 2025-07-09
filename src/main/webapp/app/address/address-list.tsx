import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';
import { handleServerError } from 'app/common/utils';
import { AddressDTO } from 'app/address/address-model';
import axios from 'axios';
import useDocumentTitle from 'app/common/use-document-title';


export default function AddressList() {
  const { t } = useTranslation();
  useDocumentTitle(t('address.list.headline'));

  const [addresses, setAddresses] = useState<AddressDTO[]>([]);
  const navigate = useNavigate();

  const getAllAddresses = async () => {
    try {
      const response = await axios.get('/api/addresses');
      setAddresses(response.data);
    } catch (error: any) {
      handleServerError(error, navigate);
    }
  };

  const confirmDelete = async (id: number) => {
    if (!confirm(t('delete.confirm'))) {
      return;
    }
    try {
      await axios.delete('/api/addresses/' + id);
      navigate('/addresses', {
            state: {
              msgInfo: t('address.delete.success')
            }
          });
      getAllAddresses();
    } catch (error: any) {
      handleServerError(error, navigate);
    }
  };

  useEffect(() => {
    getAllAddresses();
  }, []);

  return (<>
    <div className="d-flex flex-wrap mb-4">
      <h1 className="flex-grow-1">{t('address.list.headline')}</h1>
      <div>
        <Link to="/addresses/add" className="btn btn-primary ms-2">{t('address.list.createNew')}</Link>
      </div>
    </div>
    {!addresses || addresses.length === 0 ? (
    <div>{t('address.list.empty')}</div>
    ) : (
    <div className="table-responsive">
      <table className="table table-striped table-hover align-middle">
        <thead>
          <tr>
            <th scope="col">{t('address.id.label')}</th>
            <th scope="col">{t('address.address.label')}</th>
            <th scope="col">{t('address.cep.label')}</th>
            <th scope="col">{t('address.complement.label')}</th>
            <th scope="col">{t('address.neighbourhood.label')}</th>
            <th scope="col">{t('address.number.label')}</th>
            <th scope="col">{t('address.city.label')}</th>
            <th scope="col">{t('address.uf.label')}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {addresses.map((address) => (
          <tr key={address.id}>
            <td>{address.id}</td>
            <td>{address.address}</td>
            <td>{address.cep}</td>
            <td>{address.complement}</td>
            <td>{address.neighbourhood}</td>
            <td>{address.number}</td>
            <td>{address.city}</td>
            <td>{address.uf}</td>
            <td>
              <div className="float-end text-nowrap">
                <Link to={'/addresses/edit/' + address.id} className="btn btn-sm btn-secondary">{t('address.list.edit')}</Link>
                <span> </span>
                <button type="button" onClick={() => confirmDelete(address.id!)} className="btn btn-sm btn-secondary">{t('address.list.delete')}</button>
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
