import { KeyValuePipe } from '@angular/common';
import { AfterViewInit, Component, ElementRef, HostListener, inject, Input, OnChanges, OnInit } from '@angular/core';
import { AbstractControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputErrorsComponent } from 'app/common/input-row/input-errors.component';
import { environment } from 'environments/environment';
import { FileUploadService, FileData } from 'app/common/file-upload.injectable';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import flatpickr from 'flatpickr';


@Component({
  selector: 'app-input-row',
  templateUrl: './input-row.component.html',
  imports: [ReactiveFormsModule, InputErrorsComponent, KeyValuePipe]
})
export class InputRowComponent implements AfterViewInit, OnChanges, OnInit {

  fileUploadService = inject(FileUploadService);
  errorHandler = inject(ErrorHandler);

  @Input({ required: true })
  group?: FormGroup;

  @Input({ required: true })
  field = '';

  @Input()
  rowType = 'text';

  @Input()
  inputClass = '';

  @Input()
  options?: Record<string, string>|Map<number, string>;

  @Input({ required: true })
  label = '';

  @Input()
  downloadLink = '';

  datepicker?: 'datepicker'|'timepicker'|'datetimepicker';

  control?: AbstractControl;
  optionsMap?: Map<string|number,string>;

  currentFile: FileData|null = null;
  withDownloads = true;

  elRef = inject(ElementRef);

  ngOnInit() {
    this.control = this.group!.get(this.field)!;
    if (this.rowType === 'file') {
        this.currentFile = JSON.parse(this.control.value || null);
    }
    if (this.rowType === 'datepicker' || this.rowType === 'timepicker' || this.rowType === 'datetimepicker') {
      this.datepicker = this.rowType;
      this.rowType = 'text';
    }
  }

  ngOnChanges() {
    if (!this.options || this.options instanceof Map) {
      this.optionsMap = this.options;
    } else {
      this.optionsMap = new Map(Object.entries(this.options));
    }
  }

  ngAfterViewInit() {
    this.initDatepicker();
    if (this.rowType === 'file') {
      this.control!.valueChanges.subscribe(val => {
        this.currentFile = JSON.parse(this.control!.value || null);
      });
    }
  }

  @HostListener('input', ['$event.target'])
  onEvent(target: HTMLInputElement) {
    if (target.value === '') {
      this.control!.setValue(null);
    }
  }

  fileDownloadLink() {
    return environment.apiPath + this.downloadLink + '/' + this.currentFile!.fileName;
  }

  fileDelete() {
    this.currentFile = null;
    this.control!.setValue(null);
    this.withDownloads = false;
  }

  fileChanged(event: Event) {
    const $filesInput = event.target as HTMLInputElement;
    this.currentFile = null;
    this.control!.setValue(null);
    if (!$filesInput.files) {
      return;
    }
    this.fileUploadService.upload($filesInput.files[0])
        .subscribe({
          next: (data) => {
            this.currentFile = data;
            this.control!.setValue(JSON.stringify(data));
            $filesInput.value = '';
          },
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  isRequired() {
    return this.control?.hasValidator(Validators.required);
  }

  getInputClasses() {
    return (this.hasErrors() ? 'is-invalid ' : '') + this.inputClass;
  }

  hasErrors() {
    return this.control?.invalid && (this.control?.dirty || this.control?.touched);
  }

  initDatepicker() {
    if (!this.datepicker) {
      return;
    }
    const flatpickrConfig:any = {
      allowInput: true,
      time_24hr: true,
      enableSeconds: true
    };
    if (this.datepicker === 'datepicker') {
      flatpickrConfig.dateFormat = 'Y-m-d';
    } else if (this.datepicker === 'timepicker') {
      flatpickrConfig.enableTime = true;
      flatpickrConfig.noCalendar = true;
      flatpickrConfig.dateFormat = 'H:i:S';
    } else { // datetimepicker
      flatpickrConfig.enableTime = true;
      flatpickrConfig.altInput = true;
      flatpickrConfig.altFormat = 'Y-m-d H:i:S';
      flatpickrConfig.dateFormat = 'Y-m-dTH:i:S';
      // workaround label issue
      flatpickrConfig.onReady = function() {
        const id = this.input.id;
        this.input.id = null;
        this.altInput.id = id;
      };
    }
    const input = this.elRef.nativeElement.querySelector('input');
    const flatpicker = flatpickr(input, flatpickrConfig);
    this.control!.valueChanges.subscribe(val => {
      // update in case value changes after initialization
      flatpicker.setDate(val);
    });
  }

}
