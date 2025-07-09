import React, { useEffect, useRef, ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UseFormReturn } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { upload, FileData } from 'app/common/file-upload';
import { handleServerError } from 'app/common/utils';
import InputErrors from 'app/common/input-row/input-errors';
import flatpickr from 'flatpickr';


export default function InputRow({ useFormResult, object, field, type = 'text',
    required = false, disabled = false, inputClass = '', options, downloadLink }: InputRowParams) {
  const { t } = useTranslation();
  const label = t(object + '.' + field + '.label') + (required ? '*' : '');

  const { register, setValue, formState: { errors }, watch } = useFormResult;
  let optionsMap = new Map();
  if (options && options instanceof Map) {
    optionsMap = options;
  } else if (options) {
    optionsMap = new Map(Object.entries(options));
  }
  const navigate = useNavigate();
  const currentValue = watch(field);
  const [currentFile, setCurrentFile] = useState<FileData|null>(null);
  const [withDownloads, setWithDownloads] = useState(true);

  const getInputClasses = () => {
    return (errors[field] ? 'is-invalid ' : '') + inputClass;
  };

  const fileDelete = () => {
    setValue(field, null);
    setWithDownloads(false);
  };

  const fileChanged = async (event: ChangeEvent<HTMLInputElement>) => {
    const $filesInput = event.target as HTMLInputElement;
    setValue(field, null);
    if (!$filesInput.files) {
      return;
    }
    try {
      const uploadedFile = await upload($filesInput.files[0]!);
      setValue(field, JSON.stringify(uploadedFile));
      $filesInput.value = '';
    } catch (error: any) {
      handleServerError(error, navigate);
    }
  };

  if (type === 'file') {
    useEffect(() => {
      setCurrentFile(JSON.parse(currentValue || null));
    }, [currentValue]);
  }

  if (type === 'radio' && !required) {
    useEffect(() => {
      setValue(field, '');
    }, []);
  }

  const rowRef = useRef<HTMLDivElement|null>(null);
  let datepicker: string|undefined;
  if (type === 'datepicker' || type === 'timepicker' || type === 'datetimepicker') {
    datepicker = type;
    type = 'text';

    useEffect(() => {
      const flatpickrConfig:any = {
        allowInput: true,
        time_24hr: true,
        enableSeconds: true
      };
      if (datepicker === 'datepicker') {
        flatpickrConfig.dateFormat = 'Y-m-d';
      } else if (datepicker === 'timepicker') {
        flatpickrConfig.enableTime = true;
        flatpickrConfig.noCalendar = true;
        flatpickrConfig.dateFormat = 'H:i:S';
      } else { // datetimepicker
        flatpickrConfig.enableTime = true;
        flatpickrConfig.dateFormat = 'Y-m-dTH:i:S';
      }
      flatpickrConfig.onChange = function(_selectedDates: any, dateStr: string, _instance: any) {
        useFormResult.setValue(field, dateStr);
      };
      const input = rowRef.current!.querySelector('input') as HTMLInputElement;
      const calendar = flatpickr(input, flatpickrConfig);
      return () => calendar.destroy();
    }, []);
  }

  return (
    <div className="row mb-3" ref={rowRef}>
      {type === 'checkbox' ? (
        <div className="col-md-10 offset-md-2">
          <div className="form-check">
            <input id={field} {...register(field)} type="checkbox" disabled={disabled}
                className={'form-check-input ' + getInputClasses()} />
            <label htmlFor={field} className="form-check-label">
              {label}
            </label>
          </div>
          <InputErrors errors={errors} field={field} />
        </div>
      ) : (<>
      <label htmlFor={field} className="col-md-2 col-form-label">
        {label}
      </label>
      <div className="col-md-10">
        {type === 'text' || type === 'password' || type === 'email' || type === 'tel' || type === 'number' ? (
        <input id={field} {...register(field)} type={type} disabled={disabled}
            className={'form-control ' + getInputClasses()} />
        ) : type === 'textarea' ? (
        <textarea id={field} {...register(field)} disabled={disabled}
            className={'form-control ' + getInputClasses()}></textarea>
        ) : type === 'select' || type === 'multiselect' ? (
        <select id={field} {...register(field)} multiple={type === 'multiselect'} disabled={disabled}
            className={'form-select ' + getInputClasses()}>
          {type === 'select' && <option value="">{t('select.empty.label')}</option>}
          {Array.from(optionsMap).map(([key, value]) => (
          <option value={key} key={key}>{value}</option>
          ))}
        </select>
        ) : type === 'radio' ? (<>
        {!required &&
          <div className="form-check form-check-inline pt-2">
            <input id={field} {...register(field)} value="" type="radio" disabled={disabled}
                className={'form-check-input ' + getInputClasses()} />
            <label htmlFor={field} className="form-check-label">{t('select.empty.label')}</label>
          </div>
        }
        {Array.from(optionsMap).map(([key, value]) => (
        <div key={key} className="form-check form-check-inline pt-2">
          <input id={field + '_' + key} {...register(field)} value={key} type="radio" disabled={disabled}
              className={'form-check-input ' + getInputClasses()} />
          <label htmlFor={field + '_' + key} className="form-check-label">{value}</label>
        </div>
        ))}
        </>) : type === 'file' ? (<>
        <input id={field} {...register(field)} type="hidden" disabled={disabled} />
        <input id={field + '_file'} type="file" disabled={disabled} onChange={fileChanged}
            className={'form-control ' + (currentFile === null ? '' : 'd-none ') + getInputClasses()} />
        {currentFile !== null &&
          <div className="form-control-plaintext d-flex align-items-baseline gap-2">
            <span>{currentFile.fileName}</span>
            {withDownloads && downloadLink &&
              <a href={process.env.API_PATH + downloadLink + '/' + currentFile!.fileName} target="_blank" className="small text-secondary">{t('file.open')}</a>
            }
            <span role="button" onClick={fileDelete} className="small text-secondary text-decoration-underline">{t('file.delete')}</span>
          </div>
        }
        </>) : (<></>)}
        <InputErrors errors={errors} field={field} />
      </div>
      </>)}
    </div>
  );
}

interface InputRowParams {

  useFormResult: UseFormReturn<any, any, any|undefined>;
  object: string;
  field: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
  inputClass?: string;
  options?: Record<string, string>|Map<number, string>;
  downloadLink?: string;

}
