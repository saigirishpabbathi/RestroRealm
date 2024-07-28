package com.RestroRealm.App.Service.Impl;

import com.RestroRealm.App.Beans.Dto.RolePermissionDto;
import com.RestroRealm.App.Beans.Permission;
import com.RestroRealm.App.Beans.Role;
import com.RestroRealm.App.Beans.RolePermission;
import com.RestroRealm.App.Beans.User;
import com.RestroRealm.App.Repository.RolePermissionRepository;
import com.RestroRealm.App.Service.PermissionService;
import com.RestroRealm.App.Service.RolePermissionService;
import com.RestroRealm.App.Service.RoleService;
import com.RestroRealm.App.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RolePermissionServiceImpl implements RolePermissionService {

    @Autowired
    private RolePermissionRepository rolePermissionRepository;

    @Autowired
    private PermissionService permissionService;

    @Autowired
    private RoleService roleService;

    @Autowired
    private UserService userService;

    @Override
    public RolePermission addRolePermission(RolePermission rolePermission) throws Exception {
        try {
            RolePermission existingRolePermission = getByRoleIdAndPermissionId(rolePermission.getRole().getRoleId(),
                    rolePermission.getPermission().getPermissionId());
            if(existingRolePermission == null){
                return rolePermissionRepository.save(rolePermission);
            }
            throw new Exception("Role and Permission already mapped.");
        } catch (Exception e){
            throw new Exception("Unable to create mapping " + e.getMessage());
        }
    }

    @Override
    public RolePermission updateRolePermission(RolePermissionDto rolePermissionDto) throws Exception {
        try {
            RolePermission existingRolePermission = rolePermissionRepository.findByRolePermissionId(rolePermissionDto
                    .getRolePermissionId()).orElse(null);
            Permission permission = permissionService.getPermissionById(rolePermissionDto.getPermissionId());
            Role role = roleService.getRoleById(rolePermissionDto.getRoleId());
            User user = userService.getUserById(rolePermissionDto.getUserId());
            if(existingRolePermission!=null){
                existingRolePermission.setPermission(permission);
                existingRolePermission.setRole(role);
                existingRolePermission.setUser(user);
               // existingRolePermission.setUpdatedBy(); yet to implement
                existingRolePermission.setUpdatedDate(null);
                return rolePermissionRepository.save(existingRolePermission);
            }
            throw new Exception("Role permission does not exist");
        } catch (Exception e) {
            throw new Exception("Unable to update the role permission "+e.getMessage());
        }
    }

    @Override
    public String deleteRolePermission(Long rolePermissionId) throws Exception {
        try {
            RolePermission existingRolePermission = rolePermissionRepository.findByRolePermissionId(rolePermissionId)
                    .orElse(null);
            if(existingRolePermission == null){
                throw new Exception("Role Permission Id does not exist");
            }
            rolePermissionRepository.delete(existingRolePermission);
            return "Deleted Successfully";
        } catch (Exception e) {
            throw new Exception("Unable to delete role permission "+ e.getMessage());
        }
    }

    @Override
    public List<RolePermission> getAllRolePermission() throws Exception {
        try {
            return rolePermissionRepository.findAll();
        } catch (Exception e){
            throw new Exception("Unable to get Role Permissions by userId "+ e.getMessage());
        }
    }

    @Override
    public RolePermission getByRolePermissionId(Long rolePermissionId) throws Exception {
        try {
            return rolePermissionRepository.findByRolePermissionId(rolePermissionId).orElse(null);
        } catch (Exception e) {
            throw new Exception("Unable to get Role Permission " + e.getMessage());
        }
    }

    @Override
    public List<RolePermission> getByUserId(Long userId) throws Exception {
        try {
            return rolePermissionRepository.findByUserUserId(userId);
        } catch (Exception e){
            throw new Exception("Unable to get Role Permissions by userId "+ e.getMessage());
        }
    }

    @Override
    public List<RolePermission> getByPermissionId(Long permissionId) throws Exception {
        try {
            return rolePermissionRepository.findByPermissionPermissionId(permissionId);
        } catch (Exception e){
            throw new Exception("Unable to get Role Permissions by permissionId "+ e.getMessage());
        }
    }

    @Override
    public List<RolePermission> getByRoleId(Long roleId) throws Exception {
        try {
            return rolePermissionRepository.findByRoleRoleId(roleId);
        } catch (Exception e){
            throw new Exception("Unable to get Role Permissions by roleId "+ e.getMessage());
        }
    }

    @Override
    public List<RolePermission> getByRoleIdAndUserId(Long roleId, Long userId) throws Exception {
        try {
            return rolePermissionRepository.findByRoleRoleIdAndUserUserId(roleId, userId);
        } catch (Exception e){
            throw new Exception("Unable to get Role Permissions by userId and roleId "+ e.getMessage());
        }
    }

    @Override
    public List<RolePermission> getByRoleIdOrUserId(Long roleId, Long userId) throws Exception {
        try {
            return rolePermissionRepository.findByRoleRoleIdOrUserUserId(roleId, userId);
        } catch (Exception e){
            throw new Exception("Unable to get Role Permissions by userId and roleId "+ e.getMessage());
        }
    }

    @Override
    public RolePermission getByRoleIdAndPermissionId(Long roleId, Long permissionId) throws Exception {
        try {
            return rolePermissionRepository.findByRoleRoleIdAndPermissionPermissionId(roleId, permissionId).orElse(null);
        } catch (Exception e){
            throw new Exception("Unable to get Role Permissions by userId and roleId "+ e.getMessage());
        }
    }
}
