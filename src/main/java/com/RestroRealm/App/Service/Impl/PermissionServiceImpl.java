package com.RestroRealm.App.Service.Impl;

import com.RestroRealm.App.Beans.Permission;
import com.RestroRealm.App.Repository.PermissionRepository;
import com.RestroRealm.App.Service.PermissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PermissionServiceImpl implements PermissionService {

    @Autowired
    private PermissionRepository permissionRepository;

    @Override
    public List<Permission> getAllPermissions() throws Exception {
        return permissionRepository.findAll();
    }

    @Override
    public Permission getPermissionById(Long permissionId) throws Exception  {
        Permission permission = findById(permissionId);
        return permission;
    }

    @Override
    public Permission createPermission(Permission permission) throws Exception  {
        permission.setCreatedDate(null);
        permission.setUpdatedDate(null);
        return permissionRepository.save(permission);
    }

    @Override
    public Permission updatePermission(Permission permission) throws Exception  {
        Permission existingPermission = findById(permission.getPermissionId());
        if (existingPermission != null ) {
            existingPermission.setPermissionName(permission.getPermissionName());
            existingPermission.setPermissionDescription(permission.getPermissionDescription());
            existingPermission.setStatus(permission.getStatus());
            existingPermission.setPermissionType(permission.getPermissionType());
            existingPermission.setCreatedBy(permission.getCreatedBy());
            existingPermission.setUpdatedBy(permission.getUpdatedBy());
            existingPermission.setUpdatedDate(null);
            return permissionRepository.save(existingPermission);
        } else {
            return null;
        }
    }

    @Override
    public String deletePermission(Long permissionId) throws Exception  {
        try{
            Permission existingPermission = findById(permissionId);
            permissionRepository.delete(existingPermission);
            return "Permission deleted successfully";
        } catch (Exception e) {
            throw new Exception("Unable to delete Permission");
        }
    }

    public Permission findById(Long permissionId) throws Exception   {
        Optional<Permission> permission = permissionRepository.findById(permissionId);
        if (permission.isPresent()){
            return permission.get();
        }
        return null;
    }
}
