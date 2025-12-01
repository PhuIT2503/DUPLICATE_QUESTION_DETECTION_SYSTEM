package com.uth.qbca.dto.AuthDTO.Response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.uth.qbca.model.Role;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDTO {
    private Long id;
    private String userCode;
    private String email;
    private String firstName;
    private String lastName;
    private Role role;
}
