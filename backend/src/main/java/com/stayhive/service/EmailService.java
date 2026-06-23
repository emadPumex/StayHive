package com.stayhive.service;


import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendOtp(String toEmail, String otp) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("StayHive Email Verification");

        message.setText(
                "Hello,\n\n" +
                        "Your OTP for email verification is: " + otp +
                        "\n\nThis OTP will expire in 5 minutes." +
                        "\n\nRegards,\nStayHive Team"
        );

        mailSender.send(message);
    }

    public void sendListingConfirmationEmail(String toEmail, String propertyName, String token) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            String confirmUrl = "http://localhost:8081/api/properties/verify/confirm?token=" + token;
            String cancelUrl = "http://localhost:8081/api/properties/verify/cancel?token=" + token;

            String htmlContent = """
                    <html>
                    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                        <h2>Verify Your Property Listing on StayHive</h2>
                        <p>Hello, please confirm your new listing request for <strong>%s</strong>:</p>
                        <div style="margin: 25px 0;">
                            <a href="%s" style="background-color: #22c55e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-right: 15px; display: inline-block;">
                                Confirm Listing
                            </a>
                            <a href="%s" style="background-color: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                                Cancel Listing
                            </a>
                        </div>
                        <p style="font-size: 12px; color: #777;">If you did not initiate this action, simply click Cancel or ignore this message.</p>
                    </body>
                    </html>
                    """.formatted(propertyName, confirmUrl, cancelUrl);

            helper.setTo(toEmail);
            helper.setSubject("Action Required: Confirm your StayHive Listing - " + propertyName);
            helper.setText(htmlContent, true); // true sets the content subtype to html

            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Failed to send action email", e);
        }
    }
}