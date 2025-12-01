package com.uth.qbca.controller.AuthController;

import com.uth.qbca.dto.AuthDTO.Request.LoginRequestDTO;
import com.uth.qbca.dto.AuthDTO.Response.AuthResponseDTO;
import com.uth.qbca.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class LoginController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@Valid @RequestBody LoginRequestDTO request,
                                                 BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            StringBuilder errorMsg = new StringBuilder();
            bindingResult.getFieldErrors().forEach(error ->
                    errorMsg.append(error.getDefaultMessage()).append("; ")
            );

            AuthResponseDTO response = new AuthResponseDTO(false, errorMsg.toString(), null, null);
            return ResponseEntity.badRequest().body(response);
        }

        AuthResponseDTO response = authService.login(request);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }
}
