package com.stayhive.security;

import com.stayhive.model.User;
import com.stayhive.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Objects;
import java.util.Optional;

@Component
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    public OAuth2SuccessHandler(JwtUtil jwtUtil, UserRepository userRepository) {
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();
        String email = oauthUser.getAttribute("email");
        String name = oauthUser.getAttribute("name");
        String picture = oauthUser.getAttribute("picture");

        // 1. Look up user by email
        Optional<User> existingUser = userRepository.findByEmail(email);

        if (existingUser.isEmpty()) {
            // 2. Instantiate and save if new user found
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setName(name);
            newUser.setPicture(picture);
            // Referencing the nested Enum correctly
            newUser.setProvider(User.AuthProvider.google);

            userRepository.save(newUser);
        } else {
            // 3. Optional: Update metadata if profile picture or name changed on Google
            User user = existingUser.get();
            if (!Objects.equals(user.getPicture(), picture) || !Objects.equals(user.getName(), name)) {
                user.setPicture(picture);
                user.setName(name);
                userRepository.save(user);
            }
        }

        // Generate JWT token
        String token = jwtUtil.generateToken(email);

        // Build Cookie
        Cookie cookie = new Cookie("jwt_token", token);
        cookie.setHttpOnly(true);
        cookie.setSecure(false); // Set to false for local HTTP testing; change to true in production HTTPS
        cookie.setPath("/");
        cookie.setDomain("localhost");
        cookie.setMaxAge(24 * 60 * 60);
        cookie.setAttribute("SameSite", "Lax");

        response.addCookie(cookie);
        response.sendRedirect(frontendUrl + "/oauth2/redirect");
    }
}