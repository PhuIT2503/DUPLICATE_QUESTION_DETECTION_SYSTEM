package com.uth.qbca.service;

import com.uth.qbca.config.JWTUtils;
import com.uth.qbca.dto.AuthDTO.Request.LoginRequestDTO;
import com.uth.qbca.dto.AuthDTO.Request.RegisterRequestDTO;
import com.uth.qbca.dto.AuthDTO.Response.AuthResponseDTO;
import com.uth.qbca.dto.AuthDTO.Response.UserResponseDTO;
import com.uth.qbca.model.User;
import com.uth.qbca.repository.UserRepository;
import com.uth.qbca.model.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JWTUtils jwtUtils;

    @Autowired
    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JWTUtils jwtUtils) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    @Transactional
    public AuthResponseDTO register(RegisterRequestDTO request) {
        try {
            if (userRepository.existsByUserCode(request.getUserCode())) {
                return new AuthResponseDTO(false, "Mã người dùng đã tồn tại", null, null);
            }

            if (userRepository.existsByEmail(request.getEmail())) {
                return new AuthResponseDTO(false, "Email đã được sử dụng", null, null);
            }

            Role role = request.getRole(); 
            if (role == null) {
                role = Role.LECTURER;
            }

            User user = User.builder()
                    .userCode(request.getUserCode())
                    .password(passwordEncoder.encode(request.getPassword()))
                    .email(request.getEmail())
                    .firstName(request.getFirstName())
                    .lastName(request.getLastName())
                    .phoneNumber(request.getPhoneNumber())
                    .role(role) 
                    .isActive(true)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();

            userRepository.save(user);

            String fullName = user.getLastName() + " " + user.getFirstName();
            String token = jwtUtils.generateToken(
                    user.getUserCode(),
                    user.getRole().name(), 
                    fullName
            );

            UserResponseDTO responseUser = UserResponseDTO.builder()
                    .userCode(user.getUserCode())
                    .role(user.getRole()) 
                    .build();

            return new AuthResponseDTO(true, "Đăng ký thành công", responseUser, token);

        } catch (Exception ex) {
            ex.printStackTrace();
            return new AuthResponseDTO(false, "Lỗi đăng ký: " + ex.getMessage(), null, null);
        }
    }

    @Transactional(readOnly = true)
    public AuthResponseDTO login(LoginRequestDTO request) {
        try {
            Optional<User> userOpt = userRepository.findByUserCode(request.getUserCode());
            if (userOpt.isEmpty()) {
                return new AuthResponseDTO(false, "Mã người dùng không tồn tại", null, null);
            }

            User user = userOpt.get();

            if (!isPasswordValid(request.getPassword(), user.getPassword())) {
                return new AuthResponseDTO(false, "Mật khẩu không đúng", null, null);
            }
            String fullName = user.getLastName() + " " + user.getFirstName();
            String token = jwtUtils.generateToken(
                    user.getUserCode(),
                    user.getRole().name(),
                    fullName

            );

            UserResponseDTO responseUser = UserResponseDTO.builder()
                    .id(user.getId())
                    .userCode(user.getUserCode())
                    .firstName(user.getFirstName())
                    .lastName(user.getLastName())
                    .role(user.getRole())
                    .build();

            return new AuthResponseDTO(true, "Đăng nhập thành công", responseUser, token);

        } catch (Exception e) {
            return new AuthResponseDTO(false, "Lỗi trong quá trình đăng nhập: " + e.getMessage(), null, null);
        }
    }

    private boolean isPasswordValid(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }
}
 