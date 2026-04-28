package com.quizapp.quiz_system.config;

import com.quizapp.quiz_system.model.Role;
import com.quizapp.quiz_system.model.User;
import com.quizapp.quiz_system.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class AdminBootstrapConfig {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner adminBootstrapRunner(
            @Value("${app.bootstrap.admin-name}") String adminName,
            @Value("${app.bootstrap.admin-email}") String adminEmail,
            @Value("${app.bootstrap.admin-password}") String adminPassword
    ) {
        return args -> userRepository.findByEmail(adminEmail).ifPresentOrElse(
                user -> { },
                () -> userRepository.save(User.builder()
                        .name(adminName)
                        .email(adminEmail)
                        .password(passwordEncoder.encode(adminPassword))
                        .role(Role.ADMIN)
                        .build())
        );
    }
}
