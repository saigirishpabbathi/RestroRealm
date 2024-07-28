package com.RestroRealm.App.Controller;

import com.RestroRealm.App.Beans.Role;
import com.RestroRealm.App.Service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/role")
public class RoleController {

    @Autowired
    private RoleService roleService;

    @PostMapping("/add")
    public ResponseEntity addRole(@RequestBody Role role) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(roleService.addRole(role));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unable to add role: "+e.getMessage());
        }
    }

    @PutMapping("/update")
    public ResponseEntity updateRole(@RequestBody Role role) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(roleService.updateRole(role));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unable to update role: "+e.getMessage());
        }
    }

    @DeleteMapping("/delete/{roleId}")
    public ResponseEntity deleteRole(@PathVariable Long roleId) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(roleService.deleteRole(roleId));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unable to delete role: "+e.getMessage());
        }
    }

    @GetMapping("/all")
    public List<Role> getAllRoles() {
        try {
            return roleService.getAllRoles();
        } catch (Exception e) {
            return null;
        }
    }

    @GetMapping("/{roleId}")
    public ResponseEntity getRoleById(@PathVariable Long roleId) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(roleService.getRoleById(roleId));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Role not found for RoleId#" + roleId + " "
                    + e.getMessage());
        }
    }
}
