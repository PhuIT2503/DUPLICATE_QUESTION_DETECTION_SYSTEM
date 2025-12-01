package com.uth.qbca.dto.AuthDTO.Response;

public class AuthResponseDTO {
    
    private boolean success;
    private String message;
    private String token;
    
    public AuthResponseDTO() {}
    
    public AuthResponseDTO(boolean success, String message, UserResponseDTO user, String token) {
        this.success = success;
        this.message = message;
        this.token = token;
    }
    
    public boolean isSuccess() {
        return success;
    }
    
    public void setSuccess(boolean success) {
        this.success = success;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    public String getToken() {
        return token;
    }
    public void setToken(String token) {
        this.token = token;
    }
}