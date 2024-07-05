package com.RestroRealm.App.Repository;


import com.RestroRealm.App.Beans.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    User findByUsername(String username);
    List<User> findAllUsersByFirstNameOrLastName(String firstName, String lastName);

    Optional<User> findByUsernameOrEmail(String username, String email);
}
