package com.stayhive.controller;

import com.stayhive.dto.PropertyDetailsResponseDTO;
import com.stayhive.dto.PropertyFormDTO;
import com.stayhive.model.property.Property;
import com.stayhive.dto.ListingFilterParams;
import com.stayhive.dto.LocationMetadata;
import com.stayhive.service.PropertyService;

import lombok.RequiredArgsConstructor;


import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;


@RestController
@RequestMapping("/api/properties")
@RequiredArgsConstructor
@Slf4j
public class PropertyController {

    private final PropertyService listingService;


    @GetMapping("")
    public ResponseEntity<Page<Property>> getListings(
            @ModelAttribute ListingFilterParams params,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size

    ) {


        return ResponseEntity.ok(listingService.getListings(params, PageRequest.of(page, size)));
    }


    @GetMapping("/{id}")
    public ResponseEntity<PropertyDetailsResponseDTO> getListing(@PathVariable String id) {

        // 1. Change type from Property to PropertyDetailsResponseDTO
        PropertyDetailsResponseDTO listingDetails = listingService.getListingById(id);

        // 2. Safely check if the underlying property record exists
        if (listingDetails.property() == null) {
            return ResponseEntity.notFound().build(); // Sends a clean HTTP 404 to React
        }

        // 3. Return the fully wrapped payload (Property + Reviews)
        return ResponseEntity.ok(listingDetails);
    }

    @GetMapping("/locations")
    public ResponseEntity<LocationMetadata> getLocations() {
        return ResponseEntity.ok(listingService.getLocationsMetadata());
    }

    @PostMapping("")
    public ResponseEntity<?> createProperty(@ModelAttribute PropertyFormDTO dto) {
        try {
            Property savedProperty = listingService.createPropertyListing(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedProperty);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to create property: " + e.getMessage());
        }
    }
}