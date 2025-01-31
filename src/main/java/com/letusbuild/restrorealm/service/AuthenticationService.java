package com.letusbuild.restrorealm.service;

import com.letusbuild.restrorealm.dto.*;

public interface AuthenticationService {
    AuthResponseDto login(LoginDto login);
    UserDto signUp(SignUpDto signup);
    AuthResponseDto generateAccessToken(String refreshToken);

    UserDto validateToken(String accessToken);
}
