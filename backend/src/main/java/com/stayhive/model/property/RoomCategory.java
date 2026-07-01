package com.stayhive.model.property;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoomCategory {
    private String id;               // Unique category token (e.g., "deluxe_king")
    private String name;             // Marketing name (e.g., "Deluxe King Suite with Pool View")

    @Builder.Default
    private RoomType roomType = RoomType.PRIVATE_ROOM;

    private Integer bedroomCount;  // Structural bedroom count (e.g., a 3-bedroom house)
    private Double basePrice;
    private Integer totalInventory;  // Total physical rooms existing under this specific class layout
    private Integer accommodates;   // Max capacity allowance per room node
    private Integer bedCount;        // Actual number of beds in the room/unit
    private Integer bathrooms;

    // Specific amenities confined only to this room category layout (e.g., Nespresso Machine, Bathtub)
    private List<Amenity> roomAmenities;

    private Image images;

    // Blocks applied only to this specific inventory bucket (leaves other categories bookable)
    private List<BlockRule> roomBlockRules;


    public enum RoomType {
        ENTIRE_PLACE, PRIVATE_ROOM, SHARED_ROOM
    }


}
