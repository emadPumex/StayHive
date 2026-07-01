package com.stayhive.model.property;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Amenity {
    private String id;       // References PropertyAmenitiesRegistry key tokens (e.g., "room_ac")
    private String name;     // Explicit descriptive UI string (e.g., "Air Conditioning")
    private String category; // Organizing bucket grouping code (e.g., "ROOM_COMFORT")
}