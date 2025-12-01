package com.uth.qbca.config;

import org.springframework.stereotype.Component;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.*;
import com.nimbusds.jwt.*;
import java.time.Instant;
import java.util.Date;




@Component
public class JWTUtils {
    private static final String SECRET_KEY = "qbcaSuperSecureKeyForJWT@2025!ABC";
    private static final long EXPIRATION_TIME_MS = 60 * 60 * 1000;

    public String generateToken(String userCode,String role, String fullName) {
        try {
            JWSSigner signer = new MACSigner(SECRET_KEY);
            
            JWTClaimsSet claimSet = new JWTClaimsSet.Builder()
                    .subject(userCode)
                    .claim("role", role)
                    .claim("fullName", fullName)
                    .issueTime(Date.from(Instant.now()))
                    .expirationTime(new Date(System.currentTimeMillis() + EXPIRATION_TIME_MS))
                    .build();

            JWSHeader header = new JWSHeader(JWSAlgorithm.HS256);
            SignedJWT signedJWT = new SignedJWT(header, claimSet);
            signedJWT.sign(signer);

            return signedJWT.serialize();  
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("JWT generation failed: " + e.getMessage());
        }
    }

    public boolean validateToken(String token) {
        try {
            SignedJWT signedJWT = SignedJWT.parse(token);
            JWSVerifier verifier = new MACVerifier(SECRET_KEY);

            return signedJWT.verify(verifier) && 
                   signedJWT.getJWTClaimsSet().getExpirationTime().after(new Date());
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public String getUserCodeFromToken(String token) {
        try {
            SignedJWT signedJWT = SignedJWT.parse(token);
            return signedJWT.getJWTClaimsSet().getSubject();

        } catch (Exception e) {
            return null;
        }
    }

    public String getRoleFromToken(String token) {
        try {
            SignedJWT signedJWT = SignedJWT.parse(token);
            return signedJWT.getJWTClaimsSet().getStringClaim("role");
        } catch (Exception e) {
            return null;
        }
    }
}
