package br.com.kontongroup.api.fabbrini.service;

import br.com.kontongroup.api.fabbrini.domain.Document;
import br.com.kontongroup.api.fabbrini.model.DocumentDTO;
import br.com.kontongroup.api.fabbrini.repos.DoctorRepository;
import br.com.kontongroup.api.fabbrini.repos.DocumentRepository;
import br.com.kontongroup.api.fabbrini.repos.HealthInsuranceRepository;
import br.com.kontongroup.api.fabbrini.repos.PatientRepository;
import br.com.kontongroup.api.fabbrini.util.NotFoundException;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@Transactional(rollbackFor = Exception.class)
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final FileDataService fileDataService;
    private final HealthInsuranceRepository healthInsuranceRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;

    public DocumentService(final DocumentRepository documentRepository,
            final FileDataService fileDataService,
            final HealthInsuranceRepository healthInsuranceRepository,
            final DoctorRepository doctorRepository, final PatientRepository patientRepository) {
        this.documentRepository = documentRepository;
        this.fileDataService = fileDataService;
        this.healthInsuranceRepository = healthInsuranceRepository;
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
    }

    public List<DocumentDTO> findAll() {
        final List<Document> documents = documentRepository.findAll(Sort.by("id"));
        return documents.stream()
                .map(document -> mapToDTO(document, new DocumentDTO()))
                .toList();
    }

    public DocumentDTO get(final Long id) {
        return documentRepository.findById(id)
                .map(document -> mapToDTO(document, new DocumentDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Long create(final DocumentDTO documentDTO) {
        final Document document = new Document();
        mapToEntity(documentDTO, document);
        fileDataService.persistUpload(document.getFile());
        return documentRepository.save(document).getId();
    }

    public void update(final Long id, final DocumentDTO documentDTO) {
        final Document document = documentRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        fileDataService.handleUpdate(document.getFile(), documentDTO.getFile());
        mapToEntity(documentDTO, document);
        documentRepository.save(document);
    }

    public void delete(final Long id) {
        final Document document = documentRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        fileDataService.removeFileContent(document.getFile());
        // remove many-to-many relations at owning side
        healthInsuranceRepository.findAllByDocuments(document)
                .forEach(healthInsurance -> healthInsurance.getDocuments().remove(document));
        doctorRepository.findAllByDocuments(document)
                .forEach(doctor -> doctor.getDocuments().remove(document));
        patientRepository.findAllByDocuments(document)
                .forEach(patient -> patient.getDocuments().remove(document));
        documentRepository.delete(document);
    }

    private DocumentDTO mapToDTO(final Document document, final DocumentDTO documentDTO) {
        documentDTO.setId(document.getId());
        documentDTO.setDocumentType(document.getDocumentType());
        documentDTO.setFile(document.getFile());
        documentDTO.setFilename(document.getFilename());
        documentDTO.setFileType(document.getFileType());
        return documentDTO;
    }

    private Document mapToEntity(final DocumentDTO documentDTO, final Document document) {
        document.setDocumentType(documentDTO.getDocumentType());
        document.setFile(documentDTO.getFile());
        document.setFilename(documentDTO.getFilename());
        document.setFileType(documentDTO.getFileType());
        return document;
    }

}
