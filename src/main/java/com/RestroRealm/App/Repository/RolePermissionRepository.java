package com.RestroRealm.App.Repository;

import com.RestroRealm.App.Beans.RolePermission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RolePermissionRepository extends JpaRepository<RolePermission, Long> {
    Optional<RolePermission> findByRolePermissionId(Long rolePermissionId);

    List<RolePermission> findByRoleId(Long roleId);

    List<RolePermission> findByUserId(Long userId);

    List<RolePermission> findByPermissionId(Long userId);

    List<RolePermission> findByRoleIdAndUserId(Long roleId, Long userId);

    List<RolePermission> findByRoleIdOrUserId(Long roleId, Long userId);

    Optional<RolePermission> findByRoleIdAndPermissionId(Long roleId, Long permissionId);
}
