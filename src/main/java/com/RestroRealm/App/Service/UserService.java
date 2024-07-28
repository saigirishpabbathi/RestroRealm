package com.RestroRealm.App.Service;

import com.RestroRealm.App.Beans.User;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetailsService;

public interface UserService extends UserDetailsService {
    String login(String username, String password)  throws AuthenticationException;

    User createUser(User user) throws Exception;

    User getUserById(Long userId);
}

