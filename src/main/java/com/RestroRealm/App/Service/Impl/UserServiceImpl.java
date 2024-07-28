package com.RestroRealm.App.Service.Impl;

import com.RestroRealm.App.Beans.User;
import com.RestroRealm.App.Repository.UserRepository;
import com.RestroRealm.App.Security.JwtUtil;
import com.RestroRealm.App.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class UserServiceImpl implements UserService, UserDetailsService {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new UsernameNotFoundException("User not found");
        }
        return new org.springframework.security.core.userdetails.User(user.getUsername(), user.getPassword(), new ArrayList<>());
    }

    @Override
    public String login(String username, String password) throws AuthenticationException {
        User user = userRepository.findByUsername(username);
        if (user != null && user.getPassword().equals(password)) {
            return jwtUtil.generateToken(user);
        } else {
            throw new BadCredentialsException("Invalid username or password");
        }
    }

    @Override
    public User createUser(User user) throws Exception {
        try {
            User existingUser = userRepository.findByUsername(user.getUsername());
            if(existingUser == null || existingUser.equals(null)) {
                user.setPassword(passwordEncoder.encode(user.getPassword()));
                User createdUser = userRepository.save(user);
                return createdUser;
            } else if(existingUser.getEmail().equalsIgnoreCase(user.getEmail())) {
                throw  new Exception("User with same email exists already.");
            } else if(existingUser.getUsername().equalsIgnoreCase(user.getUsername())) {
                throw  new Exception("User with same username exists already.");
            }
            throw new Exception("Something went wrong, Unable to register user");
        } catch (Exception e) {
            throw new Exception("User registration failed");
        }
    }

    @Override
    public User getUserById(Long userId) {
        return userRepository.findByUserId(userId).orElse(null);
    }
}
