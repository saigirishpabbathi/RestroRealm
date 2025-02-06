package com.letusbuild.restrorealm.dto;

<<<<<<< HEAD
import lombok.Data;

=======
import com.letusbuild.restrorealm.entity.Role;
import lombok.Data;

import java.util.Date;

>>>>>>> 146a590 (Role Permission UI, Users list and minor bug fixes)
@Data
public class UserResponseDto {
    private Long userId;
    private String name;
    private String email;
<<<<<<< HEAD
    private String roleName;
=======
    private Date dateOfBirth;
    private Role role;
>>>>>>> 146a590 (Role Permission UI, Users list and minor bug fixes)
    private String profileImageUrl;
}
