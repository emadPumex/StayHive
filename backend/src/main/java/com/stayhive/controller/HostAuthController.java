package com.stayhive.controller;

import com.stayhive.model.OtpVerification;
import com.stayhive.repository.OtpRepository;
import com.stayhive.service.EmailService;
import com.stayhive.security.JwtUtil; // your existing JWT util — adjust pkg if diff
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class HostAuthController {

    private static final int OTP_LENGTH = 6;
    private static final int OTP_VALID_MINUTES = 5;
    private static final int MAX_ATTEMPTS = 5;
    private static final int RESEND_COOLDOWN_SECONDS = 60;

    private final SecureRandom secureRandom = new SecureRandom();
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    @Autowired
    private OtpRepository otprepo;

    @Autowired
    private EmailService emailService;

    @Autowired
    private JwtUtil jwtService; // must expose generateToken(String email)

    private String generateOtp() {
        int num = secureRandom.nextInt((int) Math.pow(10, OTP_LENGTH)); // 0 .. 999999
        return String.format("%0" + OTP_LENGTH + "d", num);
    }

    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email is required"));
        }
        email = email.trim().toLowerCase();

        // server-side resend cooldown — don't trust frontend timer alone

        var existing = otprepo.findByEmail(email);
        if (existing.isPresent()) {
            LocalDateTime createdWindow = existing.get().getExpiryDate().minusMinutes(OTP_VALID_MINUTES);
            long secondsSinceSend = java.time.Duration.between(createdWindow, LocalDateTime.now()).getSeconds();
            if (secondsSinceSend < RESEND_COOLDOWN_SECONDS) {
                long wait = RESEND_COOLDOWN_SECONDS - secondsSinceSend;
                return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                        .body(Map.of("error", "Please wait " + wait + "s before requesting another code."));
            }
        }

        otprepo.deleteByEmail(email);

        String rawCode = generateOtp();
        String hashedCode = encoder.encode(rawCode);

        OtpVerification newOtp = new OtpVerification(email, hashedCode,OTP_VALID_MINUTES);
        otprepo.save(newOtp);

        try {
            emailService.sendOtp(email, rawCode);
        } catch (Exception ex) {
            otprepo.deleteByEmail(email);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to send email. Try again."));
        }

        return ResponseEntity.ok(Map.of("message", "Verification code dispatched successfully."));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String enteredCode = request.get("code");

        if (email == null || enteredCode == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email and code are required"));
        }
        email = email.trim().toLowerCase();

        OtpVerification otpRecord = otprepo.findByEmail(email).orElse(null);

        if (otpRecord == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "No code requested or token records expired."));
        }

        if (LocalDateTime.now().isAfter(otpRecord.getExpiryDate())) {
            otprepo.delete(otpRecord);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Code expired."));
        }

        if (otpRecord.getAttemptCount() >= MAX_ATTEMPTS) {
            otprepo.delete(otpRecord);
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                    .body(Map.of("error", "Too many attempts. Request a new code."));
        }

        if (!encoder.matches(enteredCode, otpRecord.getOtpCode())) {
            otpRecord.incrementAttempt();
            otprepo.save(otpRecord);
            int remaining = MAX_ATTEMPTS - otpRecord.getAttemptCount();
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Incorrect code. " + remaining + " attempt(s) left."));
        }

        // success — burn the OTP, can't be replayed
        otprepo.delete(otpRecord);

     return   ResponseEntity.ok(
                Map.of(
                        "status", "success",
                        "message", "OTP verified"
                )
        );
}
}