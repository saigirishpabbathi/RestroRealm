package com.RestroRealm.App.Service;

import com.RestroRealm.App.Beans.Permission;

import java.util.List;

public interface PermissionService {
    List<Permission> getAllPermissions() throws Exception;
    Permission getPermissionById(Long id) throws Exception;
    Permission createPermission(Permission permission) throws Exception;
    Permission updatePermission(Permission permission) throws Exception;
    String deletePermission(Long id) throws Exception;
}
