package com.RestroRealm.App.Repository;

import com.RestroRealm.App.Beans.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {

    List<Role> findAll();
    Optional<Role> findByRoleId(Long roleId);
    Optional<Role> findByRoleName(String roleName);

}
