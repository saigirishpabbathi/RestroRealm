package com.RestroRealm.App.Controller;

import com.RestroRealm.App.Beans.Dto.RolePermissionDto;
import com.RestroRealm.App.Beans.RolePermission;
import com.RestroRealm.App.Service.RolePermissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rolepermission/")
public class RolePermissionController {
    @Autowired
    private RolePermissionService rolePermissionService;

    @PostMapping("/add")
    public ResponseEntity addRolePermission(@RequestBody RolePermission rolePermission) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(rolePermissionService.addRolePermission(rolePermission));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unable to create role permission: "+e.getMessage());
        }
    }

    @PutMapping("/update")
    public ResponseEntity updateRolePermission(@RequestBody RolePermissionDto rolePermissionDto) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(rolePermissionService.updateRolePermission(rolePermissionDto));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unable to update role permission: "+e.getMessage());
        }
    }

    @DeleteMapping("/delete/{rolePermissionId}")
    public ResponseEntity deleteRolePermission(@PathVariable Long rolePermissionId) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(rolePermissionService.deleteRolePermission(rolePermissionId));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unable to delete role permission: "+e.getMessage());
        }
    }

    @GetMapping("/all")
    public List<RolePermission> getAllRolePermissions() {
        try {
            return rolePermissionService.getAllRolePermission();
        } catch (Exception e) {
            return null;
        }
    }

    @GetMapping("/{rolePermissionId}")
    public ResponseEntity getRolePermissionById(@PathVariable Long rolePermissionId) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(rolePermissionService.getByRolePermissionId(rolePermissionId));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Role permission not found for RolePermissionId#"
                    + rolePermissionId + " " + e.getMessage());
        }
    }

    @GetMapping("/role/{roleId}")
    public List<RolePermission> getByRoleId(@PathVariable Long roleId) {
        try {
            return rolePermissionService.getByRoleId(roleId);
        } catch (Exception e) {
            return null;
        }
    }

    @GetMapping("/permission/{permissionId}")
    public List<RolePermission> getByPermissionId(@PathVariable Long permissionId) {
        try {
            return rolePermissionService.getByPermissionId(permissionId);
        } catch (Exception e) {
            return null;
        }
    }

    @GetMapping("/user/{userId}")
    public List<RolePermission> getByUserId(@PathVariable Long userId) {
        try {
            return rolePermissionService.getByUserId(userId);
        } catch (Exception e) {
            return null;
        }
    }

    @GetMapping("/{roleId}/and/{userId}")
    public List<RolePermission> getByRoleIdOrUserId(@PathVariable Long roleId,
                                                    @PathVariable Long userId) {
        try {
            return rolePermissionService.getByRoleIdOrUserId(roleId,userId);
        } catch (Exception e) {
            return null;
        }
    }

    @GetMapping("/{roleId}/or/{userId}")
    public List<RolePermission> getByRoleIdAndUserId(@PathVariable Long roleId,
                                                    @PathVariable Long userId) {
        try {
            return rolePermissionService.getByRoleIdAndUserId(roleId,userId);
        } catch (Exception e) {
            return null;
        }
    }
}
