import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';
import { handleServerError } from 'app/common/utils';
import { DocumentDTO } from 'app/document/document-model';
import axios from 'axios';
import useDocumentTitle from 'app/common/use-document-title';


export default function DocumentList() {
  const { t } = useTranslation();
  useDocumentTitle(t('document.list.headline'));

  const [documents, setDocuments] = useState<DocumentDTO[]>([]);
  const navigate = useNavigate();

  const getAllDocuments = async () => {
    try {
      const response = await axios.get('/api/documents');
      setDocuments(response.data);
    } catch (error: any) {
      handleServerError(error, navigate);
    }
  };

  const confirmDelete = async (id: number) => {
    if (!confirm(t('delete.confirm'))) {
      return;
    }
    try {
      await axios.delete('/api/documents/' + id);
      navigate('/documents', {
            state: {
              msgInfo: t('document.delete.success')
            }
          });
      getAllDocuments();
    } catch (error: any) {
      handleServerError(error, navigate);
    }
  };

  useEffect(() => {
    getAllDocuments();
  }, []);

  return (<>
    <div className="d-flex flex-wrap mb-4">
      <h1 className="flex-grow-1">{t('document.list.headline')}</h1>
      <div>
        <Link to="/documents/add" className="btn btn-primary ms-2">{t('document.list.createNew')}</Link>
      </div>
    </div>
    {!documents || documents.length === 0 ? (
    <div>{t('document.list.empty')}</div>
    ) : (
    <div className="table-responsive">
      <table className="table table-striped table-hover align-middle">
        <thead>
          <tr>
            <th scope="col">{t('document.id.label')}</th>
            <th scope="col">{t('document.documentType.label')}</th>
            <th scope="col">{t('document.filename.label')}</th>
            <th scope="col">{t('document.fileType.label')}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {documents.map((document) => (
          <tr key={document.id}>
            <td>{document.id}</td>
            <td>{document.documentType}</td>
            <td>{document.filename}</td>
            <td>{document.fileType}</td>
            <td>
              <div className="float-end text-nowrap">
                <Link to={'/documents/edit/' + document.id} className="btn btn-sm btn-secondary">{t('document.list.edit')}</Link>
                <span> </span>
                <button type="button" onClick={() => confirmDelete(document.id!)} className="btn btn-sm btn-secondary">{t('document.list.delete')}</button>
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
