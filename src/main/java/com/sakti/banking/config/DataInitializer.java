package com.sakti.banking.config;

import com.sakti.banking.entity.AppUser;
import com.sakti.banking.entity.Role;
import com.sakti.banking.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner seedAdmin(
            UserRepository users,
            PasswordEncoder encoder,
            @Value("${fincore.admin.email}") String email,
            @Value("${fincore.admin.password}") String password
    ) {
        return args -> {
            if (!users.existsByEmailIgnoreCase(email)) {

                AppUser admin = new AppUser();

                admin.setFullName("System Administrator");
                admin.setEmail(email);
                admin.setPassword(encoder.encode(password));
                admin.setRole(Role.ADMIN);

                users.save(admin);
            }
        };
    }
}