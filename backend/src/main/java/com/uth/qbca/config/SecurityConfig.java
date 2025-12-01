package com.uth.qbca.config;

import com.uth.qbca.service.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.*;
import org.springframework.security.authentication.*;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.*;
import org.springframework.security.web.*;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    private JWTAuthenticationFilter jwtAuthenticationFilter;

    @Autowired
    private CustomUserDetailsService userDetailsService;
    
    @Autowired
    private CorsConfigurationSource corsConfigurationSource;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
            .cors(cors -> cors.configurationSource(corsConfigurationSource))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/login").permitAll()
                .requestMatchers("/api/auth/register").hasRole("RD_STAFF")

                .requestMatchers("/api/public/**").permitAll()
                .requestMatchers("/api/users/me").permitAll()
                .requestMatchers("/api/duplicate-detection/**").permitAll()
                .requestMatchers("/api/assignments/test").permitAll()
                .requestMatchers("/api/assignments/public").permitAll()

                
                .requestMatchers("/api/users/**").hasRole("RD_STAFF")
                .requestMatchers("/api/subjects/**", "/api/clo/**", "/api/difficulty/**").hasRole("RD_STAFF")
                .requestMatchers("/api/questions/**").hasAnyRole("LECTURER", "SUBJECT_HEAD", "RD_STAFF")
                .requestMatchers("/api/feedbacks/**").hasAnyRole("LECTURER", "SUBJECT_HEAD", "EXAM_OFFICE_HEAD", "RD_STAFF")
                .requestMatchers("/api/reviews/**").hasAnyRole("SUBJECT_HEAD", "DEPARTMENT_HEAD", "RD_STAFF")
                .requestMatchers("/api/approvals/**").hasAnyRole("DEPARTMENT_HEAD", "RD_STAFF")
                .requestMatchers("/api/exams/**").hasAnyRole("EXAM_OFFICE_HEAD", "RD_STAFF")
                .requestMatchers("/api/assignments/**").hasAnyRole("SUBJECT_HEAD", "DEPARTMENT_HEAD", "EXAM_OFFICE_HEAD", "RD_STAFF")
                .requestMatchers("/api/submissions/**").hasAnyRole("LECTURER", "SUBJECT_HEAD", "EXAM_OFFICE_HEAD", "RD_STAFF")
                .requestMatchers("/api/notifications/**").hasAnyRole("LECTURER", "SUBJECT_HEAD", "RD_STAFF", "DEPARTMENT_HEAD", "EXAM_OFFICE_HEAD")
                .requestMatchers("/api/reports/**").hasRole("RD_STAFF")

                
                .anyRequest().authenticated()
            )
            .userDetailsService(userDetailsService)
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
