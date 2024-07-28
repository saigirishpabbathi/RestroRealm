package com.RestroRealm.App.Service;

import com.RestroRealm.App.Beans.Role;

import java.util.List;

public interface RoleService {
    Role addRole(Role role) throws Exception;
    Role updateRole(Role role) throws Exception;
    String deleteRole(Role role) throws Exception;
    List<Role> getAllRoles() throws Exception;
    Role getRoleById(Long roleId) throws Exception;
}
