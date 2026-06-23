package com.stayhive.controller;

import com.stayhive.dto.*;
import com.stayhive.model.property.Property;
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

import java.net.URI;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/properties")
@RequiredArgsConstructor
@Slf4j
public class PropertyController {

    private final PropertyService propertyService;
    private final String FRONTEND_SUCCESS_URL = "http://localhost:5173/?status=confirmed";
    private final String FRONTEND_CANCEL_URL = "http://localhost:5173/?status=cancelled";

    @GetMapping("")
    public ResponseEntity<Page<Property>> getProperties(
            @ModelAttribute ListingFilterParams params,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size

    ) {


        return ResponseEntity.ok(propertyService.getListings(params, PageRequest.of(page, size)));
    }


    @GetMapping("/{id}")
    public ResponseEntity<PropertyDetailsResponseDTO> getPropertiesById(@PathVariable String id) {

        // 1. Change type from Property to PropertyDetailsResponseDTO
        PropertyDetailsResponseDTO listingDetails = propertyService.getListingById(id);

        // 2. Safely check if the underlying property record exists
        if (listingDetails.property() == null) {
            return ResponseEntity.notFound().build(); // Sends a clean HTTP 404 to React
        }

        // 3. Return the fully wrapped payload (Property + Reviews)
        return ResponseEntity.ok(listingDetails);
    }

    @GetMapping("/locations")
    public ResponseEntity<LocationMetadata> getLocations() {
        return ResponseEntity.ok(propertyService.getLocationsMetadata());
    }

    @PostMapping("")
    public ResponseEntity<?> createPropertyDraft(@ModelAttribute PropertyFormDTO dto, Authentication authentication) {
        try {
            // Extract the actual logged-in user's email from your Spring Security Context
            String ownerEmail = authentication.getName();

            propertyService.initiatePropertyCreation(dto, ownerEmail);

            // Return 202 Accepted, indicating the request is processing asynchronously via email
            return ResponseEntity.status(HttpStatus.ACCEPTED)
                    .body("Property draft created. Please check your email to confirm and activate the listing.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to initiate property creation: " + e.getMessage());
        }
    }

    @GetMapping("/verify/confirm")
    public ResponseEntity<Void> confirmPropertyListing(@RequestParam("token") String token) {
        try {
            propertyService.confirmProperty(token);
            return ResponseEntity.status(HttpStatus.FOUND)
                    .location(URI.create(FRONTEND_SUCCESS_URL))
                    .build();
        } catch (Exception e) {
            System.err.println("Property verification failed: " + e.getMessage());


            String errorRedirectUrl = "http://localhost:5173/?error=invalid_token";

            return ResponseEntity.status(HttpStatus.FOUND)
                    .location(URI.create(errorRedirectUrl))
                    .build();
        }
    }


    @GetMapping("/verify/cancel")
    public ResponseEntity<Void> cancelPropertyListing(@RequestParam("token") String token) {
        try {
            propertyService.cancelProperty(token);
            return ResponseEntity.status(HttpStatus.FOUND)
                    .location(URI.create(FRONTEND_CANCEL_URL))
                    .build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

     @GetMapping("/host")
    public ResponseEntity<?> getHostProperties(  Authentication authentication){

         String ownerEmail = authentication.getName();

         List<Property> hostProperties = propertyService.getPropertiesByHostEmail(ownerEmail);

         // 3. Return 200 OK along with the listing array payload
         return ResponseEntity.ok(hostProperties);

     }

     @PatchMapping("/{id}/status")
    public ResponseEntity<?> patchPropertyStatus(  @PathVariable String id,@RequestBody Map<String, Boolean> request){

         Boolean isActive = request.get("isActive");
         if (isActive == null) {
             return ResponseEntity.badRequest().body(Map.of("error", "Missing 'isActive' field in request body"));
         }



             Property updatedProperty = propertyService.updatePropertyStatus(id, isActive);


             return ResponseEntity.ok(updatedProperty);

     }

    @PutMapping("/{id}")
    public ResponseEntity<Property> updateProperty(
            @PathVariable String id,
            @RequestBody PropertyUpdateDTO updateDto
    ) {
        // 1. Process the update operation via the service layer
        Property updatedProperty = propertyService.updatePropertyDetails(id, updateDto);

        // 2. Return the fully updated MongoDB document back to React
        return ResponseEntity.ok(updatedProperty);
    }

    @PutMapping("/{id}/availability")
    public ResponseEntity<Property> updateAvailability(
            @PathVariable String id,
            @RequestBody List<LocalDate> incomingBlockedDates
    ) {
        // Jackson parses ["2026-06-24", "2026-06-25"] into List<LocalDate> safely
        Property updatedProperty = propertyService.saveBlockedDates(id, incomingBlockedDates);
        return ResponseEntity.ok(updatedProperty);
    }


}