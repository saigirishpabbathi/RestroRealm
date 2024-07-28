package com.RestroRealm.App.Service.Impl;

import com.RestroRealm.App.Beans.Role;
import com.RestroRealm.App.Repository.RoleRepository;
import com.RestroRealm.App.Service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RoleServiceImpl implements RoleService {

    @Autowired
    private RoleRepository roleRepository;

    @Override
    public Role addRole(Role role) throws Exception {
        Role existingRole = findByRoleName(role);
        if(existingRole != null && existingRole.getRoleName().equalsIgnoreCase(role.getRoleName())){
            throw new Exception("Role already Exists");
        }
        return roleRepository.save(role);
    }

    @Override
    public Role updateRole(Role role) throws Exception {
        Role existingRole = findByRoleName(role);
        if(existingRole == null) {
            throw new Exception("Role does not exists");
        }
        existingRole.setRoleName(role.getRoleName());
        existingRole.setRoleDescription(role.getRoleDescription());
        return roleRepository.save(role);
    }

    @Override
    public String deleteRole(Long roleId) throws Exception {
        Role existingRole = findByRoleId(roleId);
        if(existingRole == null) {
            throw new Exception("Role does not exists");
        }
        roleRepository.delete(existingRole);
        return "Role deleted successfully";
    }

    @Override
    public List<Role> getAllRoles() throws Exception {
        return roleRepository.findAll();
    }

    @Override
    public Role getRoleById(Long roleId) throws Exception {
        return findByRoleId(roleId);
    }

    public Role findByRoleName(Role role) throws Exception{
        Optional<Role> optionalRole = roleRepository.findByRoleName(role.getRoleName());
        if (optionalRole.isPresent()) {
            return optionalRole.get();
        }
        return null;
    }

    public Role findByRoleId(Long roleId) throws Exception{
        Optional<Role> optionalRole = roleRepository.findByRoleId(roleId);
        if (optionalRole.isPresent()) {
            return optionalRole.get();
        }
        return null;
    }
}
