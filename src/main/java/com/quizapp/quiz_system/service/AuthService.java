package com.quizapp.quiz_system.service;

import com.quizapp.quiz_system.dto.AuthDtos.AuthResponse;
import com.quizapp.quiz_system.dto.AuthDtos.LoginRequest;
import com.quizapp.quiz_system.dto.AuthDtos.RegisterRequest;
import com.quizapp.quiz_system.exception.ApiException;
import com.quizapp.quiz_system.model.Role;
import com.quizapp.quiz_system.model.User;
import com.quizapp.quiz_system.repository.UserRepository;
import com.quizapp.quiz_system.security.CustomUserDetails;
import com.quizapp.quiz_system.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email().toLowerCase())) {
            throw new ApiException("Email is already registered");
        }

        User user = userRepository.save(User.builder()
                .name(request.name().trim())
                .email(request.email().toLowerCase().trim())
                .password(passwordEncoder.encode(request.password()))
                .role(Role.USER)
                .build());

        return toAuthResponse(user);
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email().toLowerCase().trim(), request.password())
        );

        User user = userRepository.findByEmail(request.email().toLowerCase().trim())
                .orElseThrow(() -> new ApiException("Invalid credentials"));

        return toAuthResponse(user);
    }

    private AuthResponse toAuthResponse(User user) {
        String token = jwtService.generateToken(new CustomUserDetails(user));
        return new AuthResponse(token, user.getId(), user.getName(), user.getEmail(), user.getRole());
    }
}
