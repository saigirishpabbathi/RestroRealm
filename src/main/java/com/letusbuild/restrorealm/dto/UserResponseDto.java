package com.letusbuild.restrorealm.dto;

import lombok.Data;

@Data
public class UserResponseDto {
    private Long userId;
    private String name;
    private String email;
    private String roleName;
    private String profileImageUrl;
}
