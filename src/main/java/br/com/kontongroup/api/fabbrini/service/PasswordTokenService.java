package br.com.kontongroup.api.fabbrini.service;

import br.com.kontongroup.api.fabbrini.domain.PasswordToken;
import br.com.kontongroup.api.fabbrini.model.PasswordTokenDTO;
import br.com.kontongroup.api.fabbrini.repos.PasswordTokenRepository;
import br.com.kontongroup.api.fabbrini.util.NotFoundException;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
public class PasswordTokenService {

    private final PasswordTokenRepository passwordTokenRepository;

    public PasswordTokenService(final PasswordTokenRepository passwordTokenRepository) {
        this.passwordTokenRepository = passwordTokenRepository;
    }

    public List<PasswordTokenDTO> findAll() {
        final List<PasswordToken> passwordTokens = passwordTokenRepository.findAll(Sort.by("id"));
        return passwordTokens.stream()
                .map(passwordToken -> mapToDTO(passwordToken, new PasswordTokenDTO()))
                .toList();
    }

    public PasswordTokenDTO get(final Long id) {
        return passwordTokenRepository.findById(id)
                .map(passwordToken -> mapToDTO(passwordToken, new PasswordTokenDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Long create(final PasswordTokenDTO passwordTokenDTO) {
        final PasswordToken passwordToken = new PasswordToken();
        mapToEntity(passwordTokenDTO, passwordToken);
        return passwordTokenRepository.save(passwordToken).getId();
    }

    public void update(final Long id, final PasswordTokenDTO passwordTokenDTO) {
        final PasswordToken passwordToken = passwordTokenRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        mapToEntity(passwordTokenDTO, passwordToken);
        passwordTokenRepository.save(passwordToken);
    }

    public void delete(final Long id) {
        passwordTokenRepository.deleteById(id);
    }

    private PasswordTokenDTO mapToDTO(final PasswordToken passwordToken,
            final PasswordTokenDTO passwordTokenDTO) {
        passwordTokenDTO.setId(passwordToken.getId());
        passwordTokenDTO.setToken(passwordToken.getToken());
        passwordTokenDTO.setExpirationTime(passwordToken.getExpirationTime());
        passwordTokenDTO.setTypeToken(passwordToken.getTypeToken());
        passwordTokenDTO.setUsed(passwordToken.getUsed());
        return passwordTokenDTO;
    }

    private PasswordToken mapToEntity(final PasswordTokenDTO passwordTokenDTO,
            final PasswordToken passwordToken) {
        passwordToken.setToken(passwordTokenDTO.getToken());
        passwordToken.setExpirationTime(passwordTokenDTO.getExpirationTime());
        passwordToken.setTypeToken(passwordTokenDTO.getTypeToken());
        passwordToken.setUsed(passwordTokenDTO.getUsed());
        return passwordToken;
    }

}
