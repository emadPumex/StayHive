package com.stayhive.controller;

import com.stayhive.model.property.Property;
import com.stayhive.model.property.ListingFilterParams;
import com.stayhive.model.property.LocationMetadata;
import com.stayhive.service.ListingService;

import lombok.RequiredArgsConstructor;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/properties")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ListingController {

    private final ListingService listingService;

    @GetMapping("")
    public ResponseEntity<Page<Property>> getListings(
            @ModelAttribute ListingFilterParams params,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size

    ) {




        return ResponseEntity.ok(listingService.getListings(params, PageRequest.of(page, size)));
    }


    @GetMapping("/{id}")
    public  ResponseEntity<Property> getListing(@PathVariable String id){

        Property listing = listingService.getListingById(id);

        // 2. Add a null check to handle missing database records safely
        if (listing == null) {
            return ResponseEntity.notFound().build(); // Sends a clean HTTP 404 to React
        }

        // 3. If found, wrap it and send it back
        return ResponseEntity.ok(listing);

    }

    @GetMapping("/locations")
    public ResponseEntity<LocationMetadata> getLocations() {
        return ResponseEntity.ok(listingService.getLocationsMetadata());
    }


}