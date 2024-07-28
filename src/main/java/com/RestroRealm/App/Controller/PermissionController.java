package com.RestroRealm.App.Controller;

import com.RestroRealm.App.Beans.Permission;
import com.RestroRealm.App.Service.PermissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/permission")
public class PermissionController {

    @Autowired
    private PermissionService permissionService;

    @PostMapping("/add")
    public ResponseEntity addPermission(@RequestBody Permission permission) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(permissionService.createPermission(permission));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unable to create permission: "+e.getMessage());
        }
    }

    @PutMapping("/update")
    public ResponseEntity updatePermission(@RequestBody Permission permission) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(permissionService.updatePermission(permission));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unable to update permission: "+e.getMessage());
        }
    }

    @DeleteMapping("/delete/{permissionId}")
    public ResponseEntity deletePermission(@PathVariable Long permissionId) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(permissionService.deletePermission(permissionId));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unable to delete permission: "+e.getMessage());
        }
    }

    @GetMapping("/all")
    public List<Permission> getAllPermissions() {
        try {
            return permissionService.getAllPermissions();
        } catch (Exception e) {
            return null;
        }
    }

    @GetMapping("/{permissionId}")
    public ResponseEntity getPermissionById(@PathVariable Long permissionId) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(permissionService.getPermissionById(permissionId));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Permission not found for PermissionId#" + permissionId + " "
                    + e.getMessage());
        }
    }
}
