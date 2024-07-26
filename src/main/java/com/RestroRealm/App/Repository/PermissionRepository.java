package com.RestroRealm.App.Repository;

import com.RestroRealm.App.Beans.Permission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PermissionRepository extends JpaRepository<Permission, Long> {

    List<Permission> findAll();

    Optional<Permission> findByPermissionId(Long permissionId);

//    @Query("SELECT p FROM Permission p WHERE p.role.roleId = :roleId")
//    List<Permission> findByRoleId(@Param("roleId") Long roleId);
}
