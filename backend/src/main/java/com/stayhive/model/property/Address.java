package com.stayhive.model.property;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Address {

    private String country;

    private String state;

    private String city;

    private Double latitude;

    private Double longitude;
}