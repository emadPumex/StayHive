package com.stayhive.service;


import com.stayhive.dto.*;
import com.stayhive.dto.ReviewRequestDTO;
import com.stayhive.model.Review;
import com.stayhive.model.User;
import com.stayhive.model.property.*;
import com.stayhive.repository.*;
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


import java.time.Instant;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;
import java.util.regex.Pattern;

import org.springframework.security.access.AccessDeniedException;

@Service
@RequiredArgsConstructor

public class PropertyService {
    private final PropertyRepository listingRepository;
    private final MongoTemplate mongoTemplate;
    private final CloudinaryService cloudinaryService;
    private final ReviewRepository reviewRepository;
    private final VerificationTokenRepository tokenRepository;
    private final EmailService emailService;
    private final UserRepository userRepository;
    private final PropertyRepository propertyRepository;

    public Page<Property> getListings(ListingFilterParams p, Pageable pageable) {
        Query query = buildQuery(p);
        long total = mongoTemplate.count(query, Property.class);
        query.with(pageable);
        List<Property> results = mongoTemplate.find(query, Property.class);
        return new PageImpl<>(results, pageable, total);
    }

    private Query buildQuery(ListingFilterParams p) {
        List<Criteria> criteria = new ArrayList<>();
        criteria.add(Criteria.where("isActive").is(true));
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
        if (hasVal(p.getRoomType())) criteria.add(Criteria.where("roomCategories.roomType").is(p.getRoomType()));
        if (hasVal(p.getCancellationPolicy()))
            criteria.add(Criteria.where("cancellationPolicy.type").is(p.getCancellationPolicy()));

        if (p.getMinPrice() != null) criteria.add(Criteria.where("roomCategories.basePrice").gte(p.getMinPrice()));
        if (p.getMaxPrice() != null) criteria.add(Criteria.where("roomCategories.basePrice").lte(p.getMaxPrice()));
        if (p.getMinAccommodates() != null)
            criteria.add(Criteria.where("roomCategories.accommodates").gte(p.getMinAccommodates()));
        if (p.getMinBedrooms() != null) criteria.add(Criteria.where("roomCategories.bedCount").gte(p.getMinBedrooms()));
        if (p.getMinBathrooms() != null)
            criteria.add(Criteria.where("roomCategories.bathrooms").gte(p.getMinBathrooms()));

        if (Boolean.TRUE.equals(p.getIsSuperhost()))
            criteria.add(Criteria.where("host.hostIsSuperhost").is(true));

        if (p.getMinRating() != null)
            criteria.add(Criteria.where("averageRating").gte(p.getMinRating()));

        if (p.getAmenities() != null && !p.getAmenities().isEmpty())
            criteria.add(Criteria.where("propertyAmenities.name").all(p.getAmenities()));

        // checkIn/checkOut — exclude properties with blocked dates overlapping range
        if (p.getCheckIn() != null && p.getCheckOut() != null) {
            Criteria overlapCriteria = new Criteria().andOperator(
                    Criteria.where("blockType").is("SPECIFIC_DATES"),
                    Criteria.where("startDate").lte(p.getCheckOut()),
                    Criteria.where("endDate").gte(p.getCheckIn())
            );
            criteria.add(Criteria.where("propertyBlockRules").not().elemMatch(overlapCriteria));
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


        List<Review> reviews = reviewRepository.findByPropertyId(id);


        return new PropertyDetailsResponseDTO(property, reviews);
    }


    public Property initiatePropertyCreation(PropertyDataDTO dto, List<MultipartFile> images, MultipartFile profileImageUrl, Map<Integer, List<MultipartFile>> roomImagesMap, String ownerEmail) {

        User user = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new RuntimeException("Logged-in account not found for: " + ownerEmail));

        Host host = dto.host();
        if (host == null) {
            host = Host.builder().build();
        }
        host.setHostId(user.getId());       // Store the verified User ID inside the embedded host block
        if (profileImageUrl != null && !profileImageUrl.isEmpty()) {
            host.setProfileImageUrl(cloudinaryService.uploadFile(profileImageUrl, "stayhive/hosts"));
        }

        Property property = Property.builder()
                .name(dto.name())
                .propertyType(dto.propertyType())
                .summary(dto.summary())
                .host(host)
                .address(dto.address())
                .roomCategories(dto.roomCategories() != null ? dto.roomCategories() : new ArrayList<>())
                .cancellationPolicy(dto.cancellationPolicy() != null ? dto.cancellationPolicy() : new CancellationPolicy())
                .propertyAmenities(dto.propertyAmenities() != null ? dto.propertyAmenities() : new ArrayList<>())
                .propertyBlockRules(dto.propertyBlockRules() != null ? dto.propertyBlockRules() : new ArrayList<>())
                .isActive(false)
                .build();

        Property savedProperty = listingRepository.save(property);
        String propertyId = savedProperty.getId();

        if (images != null && !images.isEmpty()) {
            List<String> uploadedGalleryUrls = new ArrayList<>();
            String folderStructure = "stayhive/listings/" + propertyId;

            for (MultipartFile imgFile : images) {
                if (imgFile != null && !imgFile.isEmpty()) {
                    uploadedGalleryUrls.add(cloudinaryService.uploadFile(imgFile, folderStructure));
                }
            }

            if (!uploadedGalleryUrls.isEmpty()) {
                savedProperty.setImages(Image.builder()
                        .coverImageUrl(uploadedGalleryUrls.get(0))
                        .imageUrls(uploadedGalleryUrls).build());
            }
        }

        if (roomImagesMap != null && !roomImagesMap.isEmpty()) {
            for (Map.Entry<Integer, List<MultipartFile>> entry : roomImagesMap.entrySet()) {
                int roomIndex = entry.getKey();
                if (roomIndex < savedProperty.getRoomCategories().size()) {
                    List<String> rUrls = new ArrayList<>();
                    String rFolder = "stayhive/listings/" + propertyId + "/rooms/" + dto.roomCategories().get(roomIndex).getId();
                    for (MultipartFile f : entry.getValue()) {
                        if (f != null && !f.isEmpty()) {
                            rUrls.add(cloudinaryService.uploadFile(f, rFolder));
                        }
                    }
                    if (!rUrls.isEmpty()) {
                        savedProperty.getRoomCategories().get(roomIndex).setImages(
                                Image.builder().coverImageUrl(rUrls.get(0)).imageUrls(rUrls).build()
                        );
                    }
                }
            }
        }

        // Always save property once again if images were attached to property or rooms
        if ((images != null && !images.isEmpty()) || (roomImagesMap != null && !roomImagesMap.isEmpty())) {
            listingRepository.save(savedProperty);
        }

        String token = UUID.randomUUID().toString();
        tokenRepository.save(new VerificationToken(token, propertyId));

        emailService.sendListingConfirmationEmail(ownerEmail, dto.name(), token);

        return savedProperty;
    }

    public void confirmProperty(String token) {
        VerificationToken verificationToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Invalid or expired token."));

        Property property = listingRepository.findById(verificationToken.getPropertyId())
                .orElseThrow(() -> new IllegalArgumentException("Property not found."));

        property.setIsActive(true);
        listingRepository.save(property);

        tokenRepository.delete(verificationToken);
    }


    public void cancelProperty(String token) {
        VerificationToken verificationToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Invalid or expired token."));

        Property property = listingRepository.findById(verificationToken.getPropertyId())
                .orElseThrow(() -> new IllegalArgumentException("Property not found."));

        if (property.getHost() != null && property.getHost().getProfileImageUrl() != null) {
            String profileUrl = property.getHost().getProfileImageUrl();

            if (profileUrl.contains("stayhive/hosts")) {
                String publicId = extractCloudinaryPublicId(profileUrl);
                cloudinaryService.deleteFile(publicId);
            }
        }

        // 2. CLEANUP: Delete all Property Gallery Images
        if (property.getImages() != null && property.getImages().getImageUrls() != null) {
            for (String imageUrl : property.getImages().getImageUrls()) {
                String publicId = extractCloudinaryPublicId(imageUrl);
                if (publicId != null) {
                    cloudinaryService.deleteFile(publicId);
                }
            }
        }


        listingRepository.deleteById(verificationToken.getPropertyId());
        tokenRepository.delete(verificationToken);


    }

    private String extractCloudinaryPublicId(String url) {
        if (url == null || !url.contains("/upload/")) {
            return null;
        }
        try {
            // Split at "/upload/"
            String path = url.split("/upload/")[1];

            // Remove the version tag (e.g., "v1623456789/") if it exists
            if (path.matches("^v\\d+/.*")) {
                path = path.replaceFirst("^v\\d+/", "");
            }

            // Remove the file extension (e.g., ".jpg", ".png")
            int lastDotIndex = path.lastIndexOf(".");
            if (lastDotIndex != -1) {
                path = path.substring(0, lastDotIndex);
            }

            return path;
        } catch (Exception e) {
            System.err.println("Failed to parse Cloudinary URL: " + url);
            return null;
        }
    }

    public List<Property> getPropertiesByHostEmail(String email) {
        // 1. Resolve the authenticated email string down to the core database User entity
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Host account profile not found for email: " + email));


        String hostId = user.getId();


        return propertyRepository.findByHostHostId(hostId);
    }


    public Property updatePropertyStatus(String propertyId, Boolean isActive) {
        // 1. Fetch the property from MongoDB or throw a clean 404 error if it doesn't exist
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new RuntimeException("Property listing not found with id: " + propertyId));

        // 2. Mutate the status field inside the entity object
        property.setIsActive(isActive);

        // 3. Persist the changes back to your 'properties' collection
        return propertyRepository.save(property);
    }

    public Property updatePropertyDetails(String id, PropertyUpdateDTO dto) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Property listing not found with id: " + id));

        property.setName(dto.name());
        property.setSummary(dto.summary());

        if (dto.propertyType() != null) {
            try {
                property.setPropertyType(Property.PropertyType.valueOf(dto.propertyType()));
            } catch (IllegalArgumentException ex) {
                throw new IllegalArgumentException("Invalid propertyType: " + dto.propertyType());
            }
        }

        // Address (nested sub-document) — city only, per current UI scope
        if (property.getAddress() != null && dto.city() != null) {
            property.getAddress().setCity(dto.city());
        }

        // Property-level amenities — full replace, ids/categories trusted from client catalog
        if (dto.propertyAmenities() != null) {
            List<Amenity> amenities = dto.propertyAmenities().stream()
                    .map(a -> Amenity.builder()
                            .id(a.id())
                            .name(a.name())
                            .category(a.category())
                            .build())
                    .toList();
            property.setPropertyAmenities(amenities);
        }

        // Cancellation policy — full replace including refund window tiers
        if (dto.cancellationPolicy() != null) {
            CancellationPolicyDTO cpDto = dto.cancellationPolicy();
            CancellationPolicy policy = new CancellationPolicy();

            try {
                policy.setType(CancellationPolicy.PolicyType.valueOf(cpDto.type()));
            } catch (IllegalArgumentException ex) {
                throw new IllegalArgumentException("Invalid cancellationPolicy.type: " + cpDto.type());
            }
            policy.setName(cpDto.name());
            policy.setDescription(cpDto.description());

            List<CancellationPolicy.CancellationWindow> windows = cpDto.windows() == null
                    ? Collections.emptyList()
                    : cpDto.windows().stream()
                    .map(w -> new CancellationPolicy.CancellationWindow(w.daysBeforeCheckIn(), w.refundPercentage()))
                    .toList();
            policy.setWindows(windows);

            property.setCancellationPolicy(policy);
        }

        if (dto.roomCategories() != null) {
            if (dto.roomCategories().isEmpty()) {
                throw new IllegalArgumentException("At least one room category is required.");
            }

            List<RoomCategory> categories = dto.roomCategories().stream()
                    .map(this::toRoomCategory)
                    .toList();

            boolean hasEntirePlace = categories.stream()
                    .anyMatch(rc -> rc.getRoomType() == RoomCategory.RoomType.ENTIRE_PLACE);
            if (hasEntirePlace && categories.size() > 1) {
                throw new IllegalArgumentException("Entire Place must be the only room category.");
            }

            property.setRoomCategories(categories);
        }

        return propertyRepository.save(property);
    }

    private RoomCategory toRoomCategory(RoomCategoryDTO dto) {
        RoomCategory.RoomType roomType;
        try {
            roomType = RoomCategory.RoomType.valueOf(dto.roomType());
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException("Invalid roomType: " + dto.roomType());
        }

        List<Amenity> roomAmenities = dto.roomAmenities() == null
                ? Collections.emptyList()
                : dto.roomAmenities().stream()
                .map(a -> Amenity.builder().id(a.id()).name(a.name()).category(a.category()).build())
                .toList();

        return RoomCategory.builder()
                .id(dto.id())
                .name(dto.name())
                .roomType(roomType)
                .bedroomCount(dto.bedroomCount())
                .basePrice(dto.basePrice())
                .totalInventory(dto.totalInventory())
                .accommodates(dto.accommodates())
                .bedCount(dto.bedCount())
                .bathrooms(dto.bathrooms())
                .roomAmenities(roomAmenities)
                .images(dto.images())
                .roomBlockRules(dto.roomBlockRules())
                .build();
    }

    public Property updateAvailability(String id, PropertyAvailabilityUpdateDTO dto) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Property listing not found with id: " + id));

        property.setPropertyBlockRules(toBlockRules(dto.propertyBlockRules()));

        if (dto.roomCategories() != null) {
            Map<String, List<BlockRule>> rulesByRoomId = dto.roomCategories().stream()
                    .collect(Collectors.toMap(RoomAvailabilityDTO::id, r -> toBlockRules(r.roomBlockRules())));

            for (RoomCategory room : property.getRoomCategories()) {
                if (rulesByRoomId.containsKey(room.getId())) {
                    room.setRoomBlockRules(rulesByRoomId.get(room.getId()));
                }
            }
        }

        return propertyRepository.save(property);
    }

    private List<BlockRule> toBlockRules(List<BlockRuleDTO> dtos) {
        if (dtos == null) return new ArrayList<>();
        return dtos.stream()
                .map(d -> BlockRule.builder()
                        .id(d.id() != null ? d.id() : UUID.randomUUID().toString())
                        .reason(d.reason())
                        .blockType(BlockRule.BlockType.valueOf(d.blockType()))
                        .startDate(d.startDate())
                        .endDate(d.endDate())
                        .daysOfWeek(d.daysOfWeek())
                        .monthlyRule(d.monthlyRule() != null ? d.monthlyRule(): null)
                        .build())
                .toList();
    }

    public Review submitReview(String propertyId, String userEmail, ReviewRequestDTO dto) {

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found: " + userEmail));

        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new RuntimeException("Property not found: " + propertyId));

        // Hosts cannot review their own property
        if (property.getHost() != null && user.getId().equals(property.getHost().getHostId())) {
            throw new IllegalArgumentException("Hosts cannot review their own property.");
        }

        Review review = new Review();
        review.setPropertyId(propertyId);
        review.setUserId(user.getId());

        String reviewerName = (user.getName() != null && !user.getName().isBlank())
                ? user.getName()
                : userEmail.split("@")[0];
        review.setReviewerName(reviewerName);
        review.setReviewerProfileImage(user.getPicture());
        review.setRating(dto.rating());
        review.setComment(dto.comment());
        review.setCreatedAt(Instant.now());

        Review saved = reviewRepository.save(review);

        recalculatePropertyStats(propertyId);
        return saved;
    }

    public Review updateReview(String reviewId, String userEmail, ReviewRequestDTO dto) {

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found: " + userEmail));

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found: " + reviewId));

        if (!review.getUserId().equals(user.getId())) {
            throw new AccessDeniedException("You can only edit your own reviews.");
        }

        review.setRating(dto.rating());
        review.setComment(dto.comment());
        Review saved = reviewRepository.save(review);

        recalculatePropertyStats(review.getPropertyId());
        return saved;
    }

    public void deleteReview(String reviewId, String userEmail) {

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found: " + userEmail));

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found: " + reviewId));

        if (!review.getUserId().equals(user.getId())) {
            throw new AccessDeniedException("You can only delete your own reviews.");
        }

        String propertyId = review.getPropertyId();
        reviewRepository.deleteById(reviewId);
        recalculatePropertyStats(propertyId);
    }

    private void recalculatePropertyStats(String propertyId) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new RuntimeException("Property not found: " + propertyId));
        List<Review> allReviews = reviewRepository.findByPropertyId(propertyId);
        double avg = allReviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);
        property.setAverageRating(Math.round(avg * 10.0) / 10.0);
        property.setReviewCount(allReviews.size());
        propertyRepository.save(property);
    }

}