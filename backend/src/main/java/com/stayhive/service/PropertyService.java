package com.stayhive.service;

import com.cloudinary.Cloudinary;
import com.stayhive.dto.PropertyDetailsResponseDTO;
import com.stayhive.model.Review;
import com.stayhive.model.property.Property;
import com.stayhive.model.property.Address;
import com.stayhive.model.property.Host;
import com.stayhive.model.property.Availability;
import com.stayhive.model.property.Image;
import com.stayhive.dto.ListingFilterParams;
import com.stayhive.dto.LocationMetadata;
import com.stayhive.dto.PropertyFormDTO;
import com.stayhive.repository.PropertyRepository;
import com.stayhive.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.PageImpl;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;


import java.util.Map;

import java.util.stream.Collectors;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor

public class PropertyService {
    private final PropertyRepository listingRepository;
    private final MongoTemplate mongoTemplate;
    private final CloudinaryService cloudinaryService;
    private final ReviewRepository reviewRepository;

    public Page<Property> getListings(ListingFilterParams p, Pageable pageable) {
        Query query = buildQuery(p);
        long total = mongoTemplate.count(query, Property.class);
        query.with(pageable);
        List<Property> results = mongoTemplate.find(query, Property.class);
        return new PageImpl<>(results, pageable, total);
    }

    private Query buildQuery(ListingFilterParams p) {
        List<Criteria> criteria = new ArrayList<>();

        // Text search — name, city, country
        if (hasVal(p.getSearch())) {
            String regex = ".*" + Pattern.quote(p.getSearch()) + ".*";
            criteria.add(new Criteria().orOperator(
                    Criteria.where("name").regex(regex, "i"),
                    Criteria.where("address.city").regex(regex, "i"),
                    Criteria.where("address.country").regex(regex, "i")
            ));
        }

        if (hasVal(p.getCountry())) criteria.add(Criteria.where("address.country").is(p.getCountry()));
        if (hasVal(p.getCity())) criteria.add(Criteria.where("address.city").is(p.getCity()));

        // Enums — stored as string in MongoDB
        if (hasVal(p.getPropertyType())) criteria.add(Criteria.where("propertyType").is(p.getPropertyType()));
        if (hasVal(p.getRoomType())) criteria.add(Criteria.where("roomType").is(p.getRoomType()));
        if (hasVal(p.getCancellationPolicy()))
            criteria.add(Criteria.where("cancellationPolicy").is(p.getCancellationPolicy()));

        if (p.getMinPrice() != null) criteria.add(Criteria.where("price").gte(p.getMinPrice()));
        if (p.getMaxPrice() != null) criteria.add(Criteria.where("price").lte(p.getMaxPrice()));
        if (p.getMinAccommodates() != null) criteria.add(Criteria.where("accommodates").gte(p.getMinAccommodates()));
        if (p.getMinBedrooms() != null) criteria.add(Criteria.where("bedrooms").gte(p.getMinBedrooms()));
        if (p.getMinBathrooms() != null) criteria.add(Criteria.where("bathrooms").gte(p.getMinBathrooms()));

        if (Boolean.TRUE.equals(p.getIsSuperhost()))
            criteria.add(Criteria.where("host.hostIsSuperhost").is(true));

        if (p.getMinRating() != null)
            criteria.add(Criteria.where("averageRating").gte(p.getMinRating()));  // ← was reviewScores.reviewScoresRating

        if (p.getAmenities() != null && !p.getAmenities().isEmpty())
            criteria.add(Criteria.where("amenities").all(p.getAmenities()));

        // checkIn/checkOut — exclude properties with blocked dates overlapping range
        if (p.getCheckIn() != null && p.getCheckOut() != null) {
            criteria.add(Criteria.where("availability.blockedDates").not().elemMatch(
                    new Criteria().gte(p.getCheckIn()).lte(p.getCheckOut())
            ));
        }

        Query query = new Query();
        if (!criteria.isEmpty())
            query.addCriteria(new Criteria().andOperator(criteria.toArray(new Criteria[0])));

        return query;
    }

    private boolean hasVal(String s) {
        return s != null && !s.isBlank();
    }

    public LocationMetadata getLocationsMetadata() {
        List<Property> all = listingRepository.findAll();

        List<String> countries = all.stream()
                .map(l -> l.getAddress().getCountry())
                .filter(c -> c != null && !c.isBlank())
                .distinct().sorted()
                .collect(Collectors.toList());

        Map<String, List<String>> citiesByCountry = all.stream()
                .filter(l -> l.getAddress().getCountry() != null && l.getAddress().getCity() != null)
                .collect(Collectors.groupingBy(
                        l -> l.getAddress().getCountry(),
                        Collectors.mapping(
                                l -> l.getAddress().getCity(),
                                Collectors.filtering(
                                        c -> !c.isBlank(),
                                        Collectors.collectingAndThen(
                                                Collectors.toList(),
                                                list -> list.stream().distinct().sorted().collect(Collectors.toList())
                                        )
                                )
                        )
                ));

        return new LocationMetadata(countries, citiesByCountry);
    }

    public PropertyDetailsResponseDTO getListingById(String id) {

        Property property = listingRepository.findById(id).orElse(null);


        // 2. Fetch all reviews tied to this specific property ID

        List<Review> reviews = reviewRepository.findByPropertyId(id);

        // 3. Combine them into the unified presentation DTO
        return new PropertyDetailsResponseDTO(property, reviews);
    }


    public Property createPropertyListing(PropertyFormDTO dto) {
        // 1. Setup Host object (Pinterest default fallback URL applied naturally if file is missing)
        Host host = Host.builder()
                .hostName(dto.hostName())
                .build();
        if (dto.profileImageUrl() != null && !dto.profileImageUrl().isEmpty()) {
            String hostUrl = cloudinaryService.uploadFile(dto.profileImageUrl(), "stayhive/hosts");
            host.setProfileImageUrl(hostUrl);
        }

        // 2. Setup Address sub-document object
        Address address = Address.builder()
                .country(dto.country())
                .state(dto.state())
                .city(dto.city())
                .latitude(dto.latitude())
                .longitude(dto.longitude())
                .build();

        // 3. Map directly into the main Property Entity using clean DTO Enum formats
        Property property = Property.builder()
                .name(dto.name())
                .propertyType(dto.propertyType())
                .roomType(dto.roomType())
                .price(dto.price())
                .accommodates(dto.accommodates())
                .bedrooms(dto.bedrooms())
                .bathrooms(dto.bathrooms())
                .summary(dto.summary())
                .amenities(dto.amenities())
                .cancellationPolicy(dto.cancellationPolicy())
                .host(host)
                .address(address) // Linked nested address document
                .isActive(true)
                .build();

        // 4. Persist initial shell to fetch MongoDB's unique reference ID
        Property savedProperty = listingRepository.save(property);
        String propertyId = savedProperty.getId();

        // 5. Upload multiple property files to "stayhive/listings/{propertyId}"
        if (dto.images() != null && !dto.images().isEmpty()) {
            List<String> uploadedGalleryUrls = new ArrayList<>();
            String folderStructure = "stayhive/listings/" + propertyId;

            for (MultipartFile imgFile : dto.images()) {
                if (imgFile != null && !imgFile.isEmpty()) {
                    String url = cloudinaryService.uploadFile(imgFile, folderStructure);
                    uploadedGalleryUrls.add(url);
                }
            }

            // 6. Build and bind the image schema details if files exist
            if (!uploadedGalleryUrls.isEmpty()) {
                Image propertyImageContainer = Image.builder()
                        .coverImageUrl(uploadedGalleryUrls.get(0)) // Set first image as cover layout
                        .imageUrls(uploadedGalleryUrls)            // Full list map
                        .build();

                savedProperty.setImages(propertyImageContainer);
                savedProperty = listingRepository.save(savedProperty);
            }
        }

        return savedProperty;
    }
}