package com.RestroRealm.App.Controller;

import com.RestroRealm.App.Beans.Dto.LoginDto;
import com.RestroRealm.App.Beans.User;
import com.RestroRealm.App.Security.JwtUtil;
import com.RestroRealm.App.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<String> authenticate(@RequestBody LoginDto loginDto){
        try {
            return ResponseEntity.status(HttpStatus.OK).body(userService.login(loginDto.getUsername(), loginDto.getPassword()));
        }
        catch (UsernameNotFoundException e) {
//            RequestResponseMessageDto requestResponseMessageDto = new RequestResponseMessageDto();
//            requestResponseMessageDto.setShortMessage("User not found");
//            requestResponseMessageDto.setMessageCode(401);
//            requestResponseMessageDto.setLongMessage(e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found: " + e.getMessage());
        }
        catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid login details: " + e.getMessage());
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("User login failed due to an error: " + e.getMessage());
        }
    }

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody User user) {
        try {
            User createdUser = userService.createUser(user);
            if (createdUser != null) {
                return ResponseEntity.status(HttpStatus.CREATED).body("User registered successfully");
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("User registration failed");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("User registration failed due to an error: " + e.getMessage());
        }
    }

}

