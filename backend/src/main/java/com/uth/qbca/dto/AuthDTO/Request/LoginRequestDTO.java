package com.uth.qbca.dto.AuthDTO.Request;

import jakarta.validation.constraints.NotBlank;

public class LoginRequestDTO {
    
    @NotBlank(message = "Mã người dùng không được để trống")
    private String userCode;
    
    @NotBlank(message = "Mật khẩu không được để trống")
    private String password;
    
    public LoginRequestDTO() {}
    
    public LoginRequestDTO(String userCode, String password) {
        this.userCode = userCode;
        this.password = password;
    }
    
    public String getUserCode() {
        return userCode;
    }
    
    public void setUserCode(String userCode) {
        this.userCode = userCode;
    }
    
    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
}