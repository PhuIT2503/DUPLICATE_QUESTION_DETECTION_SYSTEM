package com.uth.qbca.dto.AuthDTO.Request;

import com.uth.qbca.model.Role;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RegisterRequestDTO {
    
    @NotBlank(message = "Mã người dùng không được để trống")
    private String userCode;
    
    @NotBlank(message = "Mật khẩu không được để trống")
    @Size(min = 6, message = "Mật khẩu phải có ít nhất 6 ký tự")
    private String password;
    
    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không hợp lệ")
    private String email;
    
    @NotBlank(message = "Tên không được để trống")
    private String firstName;
    
    @NotBlank(message = "Họ không được để trống")
    private String lastName;
    
    private String phoneNumber;

    private Role role;

    public RegisterRequestDTO() {}

    public RegisterRequestDTO(String userCode, String password, String email, String firstName,
                          String lastName, String phoneNumber, Role role) {
        this.userCode = userCode;
        this.password = password;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phoneNumber = phoneNumber;
        this.role = role;
    }
    
    // Getters and Setters
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
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getFirstName() {
        return firstName;
    }
    
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }
    
    public String getLastName() {
        return lastName;
    }
    
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
    
    public String getPhoneNumber() {
        return phoneNumber;
    }
    
    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }
    
    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }
}