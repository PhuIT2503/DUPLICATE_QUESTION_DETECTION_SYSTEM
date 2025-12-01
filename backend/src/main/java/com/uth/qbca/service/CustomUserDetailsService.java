package com.uth.qbca.service;

import com.uth.qbca.model.User;
import com.uth.qbca.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String userCode) throws UsernameNotFoundException {
        User user = userRepository.findByUserCode(userCode)
                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy người dùng: " + userCode));

        GrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + user.getRole().name());

        return new org.springframework.security.core.userdetails.User(
                user.getUserCode(),
                user.getPassword(),
                Collections.singletonList(authority)
        );
    }
}
