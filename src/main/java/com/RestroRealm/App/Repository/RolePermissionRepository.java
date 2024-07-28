package com.RestroRealm.App.Repository;

import com.RestroRealm.App.Beans.RolePermission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RolePermissionRepository extends JpaRepository<RolePermission, Long> {
    Optional<RolePermission> findByRolePermissionId(Long rolePermissionId);

    List<RolePermission> findByRoleRoleId(Long roleId);

    List<RolePermission> findByUserUserId(Long userId);

    List<RolePermission> findByPermissionPermissionId(Long userId);

    List<RolePermission> findByRoleRoleIdAndUserUserId(Long roleId, Long userId);

    List<RolePermission> findByRoleRoleIdOrUserUserId(Long roleId, Long userId);

    Optional<RolePermission> findByRoleRoleIdAndPermissionPermissionId(Long roleId, Long permissionId);
}
