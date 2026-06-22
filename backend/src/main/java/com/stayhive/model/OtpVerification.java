package com.stayhive.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;



    @Data
    @NoArgsConstructor

    @Document(collection = "otp_verifications")
    public class OtpVerification {

        @Id
        private String id;

        @Indexed
        private String email;

        private String otpCode;

        private int attemptCount;

        @Indexed(expireAfter = "0s")
        private LocalDateTime expiryDate;

        public OtpVerification(String email, String hashedOtp, int validMinutes) {
            this.email = email;
            this.otpCode = hashedOtp;
            this.expiryDate = LocalDateTime.now().plusMinutes(validMinutes);
            this.attemptCount = 0;
        }
        public void incrementAttempt() { this.attemptCount++; }
    }






