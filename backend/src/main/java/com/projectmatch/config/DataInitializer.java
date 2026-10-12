package com.projectmatch.config;

import com.projectmatch.entity.Role;
import com.projectmatch.entity.User;
import com.projectmatch.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.email:admin@projectmatch.edu}")
    private String adminEmail;

    @Value("${app.admin.password:admin123}")
    private String adminPassword;

    @Value("${app.admin.name:System Administrator}")
    private String adminName;

    @Value("${spring.profiles.active:default}")
    private String activeProfiles;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        boolean isProduction = activeProfiles.toLowerCase().contains("prod");
        if (isProduction && "admin123".equals(adminPassword)) {
            log.warn("SECURITY WARNING: Using default admin password ('admin123') in production profile! Set APP_ADMIN_PASSWORD environment variable to a strong secret.");
        }

        String normalizedEmail = adminEmail.toLowerCase().trim();
        if (!userRepository.existsByEmail(normalizedEmail)) {
            User admin = new User();
            admin.setFullName(adminName);
            admin.setEmail(normalizedEmail);
            admin.setPassword(passwordEncoder.encode(adminPassword));
            admin.setRole(Role.ROLE_ADMIN);

            userRepository.save(admin);
            log.info("Default administrator account initialized with email: {}", normalizedEmail);
        } else {
            log.info("Default administrator account already exists ({})", normalizedEmail);
        }
    }
}
