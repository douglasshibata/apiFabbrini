package br.com.kontongroup.api.fabbrini.service;

import br.com.kontongroup.api.fabbrini.domain.Address;
import br.com.kontongroup.api.fabbrini.domain.User;
import br.com.kontongroup.api.fabbrini.model.AddressDTO;
import br.com.kontongroup.api.fabbrini.repos.AddressRepository;
import br.com.kontongroup.api.fabbrini.repos.UserRepository;
import br.com.kontongroup.api.fabbrini.util.NotFoundException;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
public class AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    public AddressService(final AddressRepository addressRepository,
            final UserRepository userRepository) {
        this.addressRepository = addressRepository;
        this.userRepository = userRepository;
    }

    public List<AddressDTO> findAll() {
        final List<Address> addresses = addressRepository.findAll(Sort.by("id"));
        return addresses.stream()
                .map(address -> mapToDTO(address, new AddressDTO()))
                .toList();
    }

    public AddressDTO get(final Long id) {
        return addressRepository.findById(id)
                .map(address -> mapToDTO(address, new AddressDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Long create(final AddressDTO addressDTO) {
        final Address address = new Address();
        mapToEntity(addressDTO, address);
        return addressRepository.save(address).getId();
    }

    public void update(final Long id, final AddressDTO addressDTO) {
        final Address address = addressRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        mapToEntity(addressDTO, address);
        addressRepository.save(address);
    }

    public void delete(final Long id) {
        addressRepository.deleteById(id);
    }

    private AddressDTO mapToDTO(final Address address, final AddressDTO addressDTO) {
        addressDTO.setId(address.getId());
        addressDTO.setAddress(address.getAddress());
        addressDTO.setCep(address.getCep());
        addressDTO.setComplement(address.getComplement());
        addressDTO.setNeighbourhood(address.getNeighbourhood());
        addressDTO.setNumber(address.getNumber());
        addressDTO.setCity(address.getCity());
        addressDTO.setUf(address.getUf());
        addressDTO.setUser(address.getUser() == null ? null : address.getUser().getId());
        return addressDTO;
    }

    private Address mapToEntity(final AddressDTO addressDTO, final Address address) {
        address.setAddress(addressDTO.getAddress());
        address.setCep(addressDTO.getCep());
        address.setComplement(addressDTO.getComplement());
        address.setNeighbourhood(addressDTO.getNeighbourhood());
        address.setNumber(addressDTO.getNumber());
        address.setCity(addressDTO.getCity());
        address.setUf(addressDTO.getUf());
        final User user = addressDTO.getUser() == null ? null : userRepository.findById(addressDTO.getUser())
                .orElseThrow(() -> new NotFoundException("user not found"));
        address.setUser(user);
        return address;
    }

}
