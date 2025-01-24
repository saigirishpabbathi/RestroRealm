package com.letusbuild.restrorealm.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {

    private Long userId;

    @NotBlank
    @Size(max = 50)
    private String name;

    @Email
    @Size(max = 50)
    private String email;

    private boolean deleted;

}
