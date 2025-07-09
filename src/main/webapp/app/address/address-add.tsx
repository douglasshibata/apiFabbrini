import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';
import { handleServerError, setYupDefaults } from 'app/common/utils';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { AddressDTO } from 'app/address/address-model';
import axios from 'axios';
import InputRow from 'app/common/input-row/input-row';
import useDocumentTitle from 'app/common/use-document-title';
import * as yup from 'yup';


function getSchema() {
  setYupDefaults();
  return yup.object({
    address: yup.string().emptyToNull().max(255).required(),
    cep: yup.string().emptyToNull().max(20).required(),
    complement: yup.string().emptyToNull().max(255),
    neighbourhood: yup.string().emptyToNull().max(255).required(),
    number: yup.number().integer().emptyToNull(),
    city: yup.string().emptyToNull().max(255).required(),
    uf: yup.string().emptyToNull().max(255).required(),
    user: yup.number().integer().emptyToNull()
  });
}

export default function AddressAdd() {
  const { t } = useTranslation();
  useDocumentTitle(t('address.add.headline'));

  const navigate = useNavigate();
  const [userValues, setUserValues] = useState<Map<number,string>>(new Map());

  const useFormResult = useForm({
    resolver: yupResolver(getSchema()),
  });

  const prepareRelations = async () => {
    try {
      const userValuesResponse = await axios.get('/api/addresses/userValues');
      setUserValues(userValuesResponse.data);
    } catch (error: any) {
      handleServerError(error, navigate);
    }
  };

  useEffect(() => {
    prepareRelations();
  }, []);

  const createAddress = async (data: AddressDTO) => {
    window.scrollTo(0, 0);
    try {
      await axios.post('/api/addresses', data);
      navigate('/addresses', {
            state: {
              msgSuccess: t('address.create.success')
            }
          });
    } catch (error: any) {
      handleServerError(error, navigate, useFormResult.setError, t);
    }
  };

  return (<>
    <div className="d-flex flex-wrap mb-4">
      <h1 className="flex-grow-1">{t('address.add.headline')}</h1>
      <div>
        <Link to="/addresses" className="btn btn-secondary">{t('address.add.back')}</Link>
      </div>
    </div>
    <form onSubmit={useFormResult.handleSubmit(createAddress)} noValidate>
      <InputRow useFormResult={useFormResult} object="address" field="address" required={true} />
      <InputRow useFormResult={useFormResult} object="address" field="cep" required={true} />
      <InputRow useFormResult={useFormResult} object="address" field="complement" />
      <InputRow useFormResult={useFormResult} object="address" field="neighbourhood" required={true} />
      <InputRow useFormResult={useFormResult} object="address" field="number" type="number" />
      <InputRow useFormResult={useFormResult} object="address" field="city" required={true} />
      <InputRow useFormResult={useFormResult} object="address" field="uf" required={true} />
      <InputRow useFormResult={useFormResult} object="address" field="user" type="select" options={userValues} />
      <input type="submit" value={t('address.add.headline')} className="btn btn-primary mt-4" />
    </form>
  </>);
}
