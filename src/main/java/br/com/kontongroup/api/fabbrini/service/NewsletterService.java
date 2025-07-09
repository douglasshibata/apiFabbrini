package br.com.kontongroup.api.fabbrini.service;

import br.com.kontongroup.api.fabbrini.domain.Emails;
import br.com.kontongroup.api.fabbrini.domain.Newsletter;
import br.com.kontongroup.api.fabbrini.model.NewsletterDTO;
import br.com.kontongroup.api.fabbrini.repos.EmailsRepository;
import br.com.kontongroup.api.fabbrini.repos.NewsletterRepository;
import br.com.kontongroup.api.fabbrini.util.NotFoundException;
import br.com.kontongroup.api.fabbrini.util.ReferencedWarning;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@Transactional(rollbackFor = Exception.class)
public class NewsletterService {

    private final NewsletterRepository newsletterRepository;
    private final FileDataService fileDataService;
    private final EmailsRepository emailsRepository;

    public NewsletterService(final NewsletterRepository newsletterRepository,
            final FileDataService fileDataService, final EmailsRepository emailsRepository) {
        this.newsletterRepository = newsletterRepository;
        this.fileDataService = fileDataService;
        this.emailsRepository = emailsRepository;
    }

    public List<NewsletterDTO> findAll() {
        final List<Newsletter> newsletters = newsletterRepository.findAll(Sort.by("id"));
        return newsletters.stream()
                .map(newsletter -> mapToDTO(newsletter, new NewsletterDTO()))
                .toList();
    }

    public NewsletterDTO get(final Long id) {
        return newsletterRepository.findById(id)
                .map(newsletter -> mapToDTO(newsletter, new NewsletterDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Long create(final NewsletterDTO newsletterDTO) {
        final Newsletter newsletter = new Newsletter();
        mapToEntity(newsletterDTO, newsletter);
        fileDataService.persistUpload(newsletter.getFile());
        return newsletterRepository.save(newsletter).getId();
    }

    public void update(final Long id, final NewsletterDTO newsletterDTO) {
        final Newsletter newsletter = newsletterRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        fileDataService.handleUpdate(newsletter.getFile(), newsletterDTO.getFile());
        mapToEntity(newsletterDTO, newsletter);
        newsletterRepository.save(newsletter);
    }

    public void delete(final Long id) {
        final Newsletter newsletter = newsletterRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        fileDataService.removeFileContent(newsletter.getFile());
        newsletterRepository.delete(newsletter);
    }

    private NewsletterDTO mapToDTO(final Newsletter newsletter, final NewsletterDTO newsletterDTO) {
        newsletterDTO.setId(newsletter.getId());
        newsletterDTO.setTitle(newsletter.getTitle());
        newsletterDTO.setContent(newsletter.getContent());
        newsletterDTO.setFile(newsletter.getFile());
        newsletterDTO.setDeliveryDate(newsletter.getDeliveryDate());
        return newsletterDTO;
    }

    private Newsletter mapToEntity(final NewsletterDTO newsletterDTO, final Newsletter newsletter) {
        newsletter.setTitle(newsletterDTO.getTitle());
        newsletter.setContent(newsletterDTO.getContent());
        newsletter.setFile(newsletterDTO.getFile());
        newsletter.setDeliveryDate(newsletterDTO.getDeliveryDate());
        return newsletter;
    }

    public ReferencedWarning getReferencedWarning(final Long id) {
        final ReferencedWarning referencedWarning = new ReferencedWarning();
        final Newsletter newsletter = newsletterRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        final Emails newsletterEmails = emailsRepository.findFirstByNewsletter(newsletter);
        if (newsletterEmails != null) {
            referencedWarning.setKey("newsletter.emails.newsletter.referenced");
            referencedWarning.addParam(newsletterEmails.getId());
            return referencedWarning;
        }
        return null;
    }

}
