package com.example.mongo.controller;

import com.example.mongo.model.Listing.Listing;
import com.example.mongo.model.Listing.ListingFilterParams;
import com.example.mongo.model.Listing.LocationMetadata;
import com.example.mongo.service.ListingService;

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
    public ResponseEntity<Page<Listing>> getListings(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String country,
            @RequestParam(required = false) String market,
            @RequestParam(required = false) String propertyType,
            @RequestParam(required = false) String roomType,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) Integer accommodates,
            @RequestParam(required = false) Integer bedrooms,
            @RequestParam(required = false) Double bathrooms,
            @RequestParam(required = false) String amenities,   // comma-separated
            @RequestParam(required = false) Boolean isSuperhost,
            @RequestParam(required = false) Integer minRating,
            @RequestParam(required = false) Boolean available30,
            @RequestParam(required = false) String cancellationPolicy,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size

    ) {



        ListingFilterParams params = ListingFilterParams.builder()
                .search(search).country(country).market(market)
                .propertyType(propertyType).roomType(roomType)
                .minPrice(minPrice).maxPrice(maxPrice)
                .accommodates(accommodates).bedrooms(bedrooms).bathrooms(bathrooms)
                .amenities(amenities != null ? List.of(amenities.split(",")) : null)
                .isSuperhost(isSuperhost).minRating(minRating)
                .available30(available30).cancellationPolicy(cancellationPolicy)
                .build();

        return ResponseEntity.ok(listingService.getListings(params, PageRequest.of(page, size)));
    }


    @GetMapping("/{id}")
    public  ResponseEntity<Listing> getListing(@PathVariable String id){

        Listing listing = listingService.getListingById(id);

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