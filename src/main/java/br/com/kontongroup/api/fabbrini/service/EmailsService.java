package br.com.kontongroup.api.fabbrini.service;

import br.com.kontongroup.api.fabbrini.domain.Emails;
import br.com.kontongroup.api.fabbrini.domain.Newsletter;
import br.com.kontongroup.api.fabbrini.model.EmailsDTO;
import br.com.kontongroup.api.fabbrini.repos.EmailsRepository;
import br.com.kontongroup.api.fabbrini.repos.NewsletterRepository;
import br.com.kontongroup.api.fabbrini.util.NotFoundException;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
public class EmailsService {

    private final EmailsRepository emailsRepository;
    private final NewsletterRepository newsletterRepository;

    public EmailsService(final EmailsRepository emailsRepository,
            final NewsletterRepository newsletterRepository) {
        this.emailsRepository = emailsRepository;
        this.newsletterRepository = newsletterRepository;
    }

    public List<EmailsDTO> findAll() {
        final List<Emails> emailses = emailsRepository.findAll(Sort.by("id"));
        return emailses.stream()
                .map(emails -> mapToDTO(emails, new EmailsDTO()))
                .toList();
    }

    public EmailsDTO get(final Long id) {
        return emailsRepository.findById(id)
                .map(emails -> mapToDTO(emails, new EmailsDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Long create(final EmailsDTO emailsDTO) {
        final Emails emails = new Emails();
        mapToEntity(emailsDTO, emails);
        return emailsRepository.save(emails).getId();
    }

    public void update(final Long id, final EmailsDTO emailsDTO) {
        final Emails emails = emailsRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        mapToEntity(emailsDTO, emails);
        emailsRepository.save(emails);
    }

    public void delete(final Long id) {
        emailsRepository.deleteById(id);
    }

    private EmailsDTO mapToDTO(final Emails emails, final EmailsDTO emailsDTO) {
        emailsDTO.setId(emails.getId());
        emailsDTO.setEmail(emails.getEmail());
        emailsDTO.setActive(emails.getActive());
        emailsDTO.setNewsletter(emails.getNewsletter() == null ? null : emails.getNewsletter().getId());
        return emailsDTO;
    }

    private Emails mapToEntity(final EmailsDTO emailsDTO, final Emails emails) {
        emails.setEmail(emailsDTO.getEmail());
        emails.setActive(emailsDTO.getActive());
        final Newsletter newsletter = emailsDTO.getNewsletter() == null ? null : newsletterRepository.findById(emailsDTO.getNewsletter())
                .orElseThrow(() -> new NotFoundException("newsletter not found"));
        emails.setNewsletter(newsletter);
        return emails;
    }

}
