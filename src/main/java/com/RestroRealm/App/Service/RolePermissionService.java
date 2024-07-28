package com.RestroRealm.App.Service;

import com.RestroRealm.App.Beans.Dto.RolePermissionDto;
import com.RestroRealm.App.Beans.RolePermission;

import java.util.List;

public interface RolePermissionService {
    public RolePermission addRolePermission(RolePermission rolePermission) throws Exception;

    RolePermission updateRolePermission(RolePermissionDto rolePermissionDto) throws Exception;

    public String deleteRolePermission(Long rolePermissionId) throws Exception;
    public List<RolePermission> getAllRolePermission() throws Exception;
    public RolePermission getByRolePermissionId(Long rolePermissionId) throws Exception;
    public List<RolePermission> getByUserId(Long userId) throws Exception;
    public List<RolePermission> getByPermissionId(Long permissionId) throws Exception;
    public List<RolePermission> getByRoleId(Long roleId) throws Exception;

    List<RolePermission> getByRoleIdAndUserId(Long roleId, Long userId) throws Exception;

    List<RolePermission> getByRoleIdOrUserId(Long roleId, Long userId) throws Exception;

    RolePermission getByRoleIdAndPermissionId(Long roleId, Long permissionId) throws Exception;
}
