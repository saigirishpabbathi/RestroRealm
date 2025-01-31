package com.letusbuild.restrorealm.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.letusbuild.restrorealm.dto.UserResponseDto;
import com.letusbuild.restrorealm.dto.UserUpdateDto;
import com.letusbuild.restrorealm.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
//    @PreAuthorize("hasAuthority('VIEW_ALL_USERS')")
    public ResponseEntity<List<UserResponseDto>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
//    @PreAuthorize("hasAuthority('VIEW_SINGLE_USER')")
    public ResponseEntity<UserResponseDto> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserByIdNoPermission(id));
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponseDto> getCurrentUser() {
        return ResponseEntity.ok(userService.getCurrentUser());
    }

    @PutMapping("/{id}")
//    @PreAuthorize("hasAuthority('UPDATE_USER')")
    public ResponseEntity<UserResponseDto> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UserUpdateDto userUpdateDto) {
        return ResponseEntity.ok(userService.updateUser(id, userUpdateDto));
    }


    @PutMapping("/me")
    public ResponseEntity<UserResponseDto> updateCurrentUser(@Valid @RequestBody UserUpdateDto userUpdateDto) {
        return ResponseEntity.ok(userService.updateCurrentUser(userUpdateDto));
    }


    @PutMapping(value = "/me/profile-image", consumes = { "multipart/form-data" })
    public ResponseEntity<String> uploadProfileImage(@RequestPart("image") MultipartFile imageFile) {
        return ResponseEntity.ok(userService.uploadProfileImage(imageFile));
    }

    @DeleteMapping("/{id}")
//    @PreAuthorize("hasAuthority('DELETE_USER')")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok("User deleted successfully.");
    }
}
