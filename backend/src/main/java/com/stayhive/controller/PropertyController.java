package com.stayhive.controller;

import com.stayhive.dto.*;
import com.stayhive.dto.ReviewRequestDTO;
import com.stayhive.model.Review;
import com.stayhive.model.property.Property;
import com.stayhive.service.PropertyService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
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
import java.util.HashMap;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
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
            @RequestParam(defaultValue = "6") int limit

    ) {


        return ResponseEntity.ok(propertyService.getListings(params, PageRequest.of(page, limit)));
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
    public ResponseEntity<?> createPropertyDraft(
            @RequestPart("data") PropertyDataDTO dto,
            @RequestPart(value = "images", required = false) List<MultipartFile> images,
            @RequestPart(value = "profileImageUrl", required = false) MultipartFile profileImageUrl,
            HttpServletRequest rawRequest,
            Authentication authentication) {
        try {


            String ownerEmail = authentication.getName();

            // Cast the already-wrapped servlet request — safe, Spring wraps it at filter level
            Map<Integer, List<MultipartFile>> roomImagesMap = new HashMap<>();
            if (rawRequest instanceof MultipartHttpServletRequest multipartRequest
                    && dto.roomCategories() != null) {
                for (int i = 0; i < dto.roomCategories().size(); i++) {
                    List<MultipartFile> rImages = multipartRequest.getFiles("roomImages_" + i);
                    if (rImages != null && !rImages.isEmpty()) {
                        roomImagesMap.put(i, rImages);
                    }
                }
            }

            propertyService.initiatePropertyCreation(dto, images, profileImageUrl, roomImagesMap, ownerEmail);

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
        Property updatedProperty = propertyService.updatePropertyDetails(id, updateDto);
        return ResponseEntity.ok(updatedProperty);
    }

    @PutMapping("/{id}/availability")
    public ResponseEntity<Property> updateAvailability(
            @PathVariable String id,
            @RequestBody PropertyAvailabilityUpdateDTO dto
    ) {
        Property updated = propertyService.updateAvailability(id, dto);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/{id}/reviews")
    public ResponseEntity<?> submitReview(
            @PathVariable String id,
            @RequestBody ReviewRequestDTO dto,
            Authentication authentication
    ) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("Please log in to leave a review.");
        }
        if (dto.rating() == null || dto.rating() < 1 || dto.rating() > 5) {
            return ResponseEntity.badRequest().body("Rating must be between 1 and 5.");
        }
        if (dto.comment() == null || dto.comment().isBlank()) {
            return ResponseEntity.badRequest().body("Comment cannot be empty.");
        }
        try {
            String userEmail = authentication.getName();
            var review = propertyService.submitReview(id, userEmail, dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(review);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        }
    }

    @PutMapping("/{id}/reviews/{reviewId}")
    public ResponseEntity<?> updateReview(
            @PathVariable String id,
            @PathVariable String reviewId,
            @RequestBody ReviewRequestDTO dto,
            Authentication authentication
    ) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("Please log in.");
        }
        if (dto.rating() == null || dto.rating() < 1 || dto.rating() > 5) {
            return ResponseEntity.badRequest().body("Rating must be between 1 and 5.");
        }
        if (dto.comment() == null || dto.comment().isBlank()) {
            return ResponseEntity.badRequest().body("Comment cannot be empty.");
        }
        try {
            String userEmail = authentication.getName();
            Review updated = propertyService.updateReview(reviewId, userEmail, dto);
            return ResponseEntity.ok(updated);
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}/reviews/{reviewId}")
    public ResponseEntity<?> deleteReview(
            @PathVariable String id,
            @PathVariable String reviewId,
            Authentication authentication
    ) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("Please log in.");
        }
        try {
            String userEmail = authentication.getName();
            propertyService.deleteReview(reviewId, userEmail);
            return ResponseEntity.noContent().build();
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

}
