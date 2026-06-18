package com.stayhive.model.property;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Review {

    private String reviewerName;
    private Integer rating;
    private String comment;
    private String reviewDate;
}