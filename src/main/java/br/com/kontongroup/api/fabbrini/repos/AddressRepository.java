package br.com.kontongroup.api.fabbrini.repos;

import br.com.kontongroup.api.fabbrini.domain.Address;
import br.com.kontongroup.api.fabbrini.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;


public interface AddressRepository extends JpaRepository<Address, Long> {

    Address findFirstByUser(User user);

}
