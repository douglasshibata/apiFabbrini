package br.com.kontongroup.api.fabbrini.service;

import br.com.kontongroup.api.fabbrini.domain.Address;
import br.com.kontongroup.api.fabbrini.domain.Doctor;
import br.com.kontongroup.api.fabbrini.domain.Patient;
import br.com.kontongroup.api.fabbrini.domain.Phones;
import br.com.kontongroup.api.fabbrini.domain.Role;
import br.com.kontongroup.api.fabbrini.domain.User;
import br.com.kontongroup.api.fabbrini.model.UserDTO;
import br.com.kontongroup.api.fabbrini.repos.AddressRepository;
import br.com.kontongroup.api.fabbrini.repos.DoctorRepository;
import br.com.kontongroup.api.fabbrini.repos.PatientRepository;
import br.com.kontongroup.api.fabbrini.repos.PhonesRepository;
import br.com.kontongroup.api.fabbrini.repos.RoleRepository;
import br.com.kontongroup.api.fabbrini.repos.UserRepository;
import br.com.kontongroup.api.fabbrini.util.NotFoundException;
import br.com.kontongroup.api.fabbrini.util.ReferencedWarning;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PhonesRepository phonesRepository;
    private final AddressRepository addressRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;

    public UserService(final UserRepository userRepository, final RoleRepository roleRepository,
            final PhonesRepository phonesRepository, final AddressRepository addressRepository,
            final DoctorRepository doctorRepository, final PatientRepository patientRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.phonesRepository = phonesRepository;
        this.addressRepository = addressRepository;
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
    }

    public List<UserDTO> findAll() {
        final List<User> users = userRepository.findAll(Sort.by("id"));
        return users.stream()
                .map(user -> mapToDTO(user, new UserDTO()))
                .toList();
    }

    public UserDTO get(final Long id) {
        return userRepository.findById(id)
                .map(user -> mapToDTO(user, new UserDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Long create(final UserDTO userDTO) {
        final User user = new User();
        mapToEntity(userDTO, user);
        return userRepository.save(user).getId();
    }

    public void update(final Long id, final UserDTO userDTO) {
        final User user = userRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        mapToEntity(userDTO, user);
        userRepository.save(user);
    }

    public void delete(final Long id) {
        userRepository.deleteById(id);
    }

    private UserDTO mapToDTO(final User user, final UserDTO userDTO) {
        userDTO.setId(user.getId());
        userDTO.setEmail(user.getEmail());
        userDTO.setPassword(user.getPassword());
        userDTO.setFullname(user.getFullname());
        userDTO.setActive(user.getActive());
        userDTO.setSocialname(user.getSocialname());
        userDTO.setCpf(user.getCpf());
        userDTO.setCrm(user.getCrm());
        userDTO.setCountAccess(user.getCountAccess());
        userDTO.setRole(user.getRole() == null ? null : user.getRole().getId());
        return userDTO;
    }

    private User mapToEntity(final UserDTO userDTO, final User user) {
        user.setEmail(userDTO.getEmail());
        user.setPassword(userDTO.getPassword());
        user.setFullname(userDTO.getFullname());
        user.setActive(userDTO.getActive());
        user.setSocialname(userDTO.getSocialname());
        user.setCpf(userDTO.getCpf());
        user.setCrm(userDTO.getCrm());
        user.setCountAccess(userDTO.getCountAccess());
        final Role role = userDTO.getRole() == null ? null : roleRepository.findById(userDTO.getRole())
                .orElseThrow(() -> new NotFoundException("role not found"));
        user.setRole(role);
        return user;
    }

    public boolean emailExists(final String email) {
        return userRepository.existsByEmailIgnoreCase(email);
    }

    public boolean cpfExists(final String cpf) {
        return userRepository.existsByCpfIgnoreCase(cpf);
    }

    public boolean roleExists(final Long id) {
        return userRepository.existsByRoleId(id);
    }

    public ReferencedWarning getReferencedWarning(final Long id) {
        final ReferencedWarning referencedWarning = new ReferencedWarning();
        final User user = userRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        final Phones userPhones = phonesRepository.findFirstByUser(user);
        if (userPhones != null) {
            referencedWarning.setKey("user.phones.user.referenced");
            referencedWarning.addParam(userPhones.getId());
            return referencedWarning;
        }
        final Address userAddress = addressRepository.findFirstByUser(user);
        if (userAddress != null) {
            referencedWarning.setKey("user.address.user.referenced");
            referencedWarning.addParam(userAddress.getId());
            return referencedWarning;
        }
        final Doctor userDoctor = doctorRepository.findFirstByUser(user);
        if (userDoctor != null) {
            referencedWarning.setKey("user.doctor.user.referenced");
            referencedWarning.addParam(userDoctor.getId());
            return referencedWarning;
        }
        final Patient userPatient = patientRepository.findFirstByUser(user);
        if (userPatient != null) {
            referencedWarning.setKey("user.patient.user.referenced");
            referencedWarning.addParam(userPatient.getId());
            return referencedWarning;
        }
        return null;
    }

}
