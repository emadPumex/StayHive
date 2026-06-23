package com.stayhive.model.property;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "verification_tokens")
public class VerificationToken {
    @Id
    private String id;
    private String token;
    private String propertyId;
    private LocalDateTime expiryDate;

    public VerificationToken(String token, String propertyId) {
        this.token = token;
        this.propertyId = propertyId;
        this.expiryDate = LocalDateTime.now().plusHours(24); // Token expires in 24 hours
    }
}