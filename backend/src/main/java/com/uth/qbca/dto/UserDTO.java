package com.uth.qbca.dto;
import com.uth.qbca.model.Role;

public class UserDTO {
    private Long id;
    private String userCode;
    private String email;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private Role role;

    //Constructor mặc định
    public UserDTO() {}
    //Constructor với tham số
    public UserDTO(Long id, String userCode, String email, String firstName, String lastName, String phoneNumber, Role role) {
        this.id = id;
        this.userCode = userCode;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phoneNumber = phoneNumber;
        this.role = role;
    }

    //Các method getter và setter
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUserCode() {
        return userCode;
    }

    public void setUserCode(String userCode) {
        this.userCode = userCode;
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
