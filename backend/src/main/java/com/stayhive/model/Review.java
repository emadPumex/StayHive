package com.stayhive.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "reviews")
public class Review {

    @Id
    private String id;

    private String propertyId;

    private String userId;

    private String reviewerName;

    private String reviewerProfileImage;

    private Integer rating;

    private String comment;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDateTime createdAt;
}