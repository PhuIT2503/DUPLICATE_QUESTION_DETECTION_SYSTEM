package com.uth.qbca.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/public")
public class PublicTestController {

    @GetMapping("/test")
    public ResponseEntity<String> publicTest() {
        return ResponseEntity.ok("✅ Access without authentication!");
    }
}
