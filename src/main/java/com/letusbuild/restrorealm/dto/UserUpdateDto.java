package com.letusbuild.restrorealm.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
<<<<<<< HEAD
import lombok.Data;

=======
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.Date;

>>>>>>> 146a590 (Role Permission UI, Users list and minor bug fixes)
@Data
public class UserUpdateDto {
    @NotBlank(message = "Name cannot be blank")
    private String name;

    @Email(message = "Invalid email format")
    private String email;
<<<<<<< HEAD
=======

    @NotNull(message = "Date of Birth cannot be empty")
    private Date dateOfBirth;


    @NotNull(message = "Role Id cannot be empty")
    private Long roleId;
>>>>>>> 146a590 (Role Permission UI, Users list and minor bug fixes)
}
