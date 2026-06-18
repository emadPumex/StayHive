package com.stayhive.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;



@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {

    @Id
    private String id;
    private String email;
    private String name;
    private String picture;


    // Enforces that only valid, pre-defined providers can be saved
    private AuthProvider provider;

    // --- NESTED ENUM ---
    public enum AuthProvider {
        local,
        google,
        github,
        facebook
    }

}