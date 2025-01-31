package com.letusbuild.restrorealm.service;

        import com.letusbuild.restrorealm.dto.UserDto;
        import com.letusbuild.restrorealm.dto.UserResponseDto;
        import com.letusbuild.restrorealm.dto.UserUpdateDto;
        import com.letusbuild.restrorealm.entity.User;
        import org.springframework.security.core.userdetails.UserDetails;
        import org.springframework.security.core.userdetails.UsernameNotFoundException;
        import org.springframework.web.multipart.MultipartFile;

        import java.util.List;
        import java.util.Optional;

public interface UserService {
    UserDto getUserById(Long userId);
    User getUserEntityById(Long id);
    UserResponseDto getUserByIdNoPermission(Long id);
    List<UserResponseDto> getAllUsers();

    User createUser(User newUser);

    Optional<User> getUserByEmail(String email);

    UserDetails loadUserByUsername(String email) throws UsernameNotFoundException;

    UserResponseDto getCurrentUser();
    UserResponseDto updateUser(Long id, UserUpdateDto userUpdateDto);
    UserResponseDto updateCurrentUser(UserUpdateDto userUpdateDto);
    String uploadProfileImage(MultipartFile imageFile);
    void deleteUser(Long id);
}
