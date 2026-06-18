package com.stayhive.service;


import com.stayhive.model.property.Property;
import com.stayhive.model.property.ListingFilterParams;
import com.stayhive.model.property.LocationMetadata;
import com.stayhive.repository.ListingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class ListingService {
    private final ListingRepository listingRepository;

    private final MongoTemplate mongoTemplate;

    public Page<Property> getListings(ListingFilterParams p, Pageable pageable) {
        Query query = buildQuery(p);

        long total = mongoTemplate.count(query, Property.class);

        query.with(pageable);

        List<Property> results = mongoTemplate.find(query, Property.class);

        return new PageImpl<>(results, pageable, total);
    }

    private Query buildQuery(ListingFilterParams p) {
        List<Criteria> criteria = new ArrayList<>();

        // Text search — name, market, country
        if (hasVal(p.getSearch())) {
            String regex = ".*" + Pattern.quote(p.getSearch()) + ".*";
            criteria.add(new Criteria().orOperator(
                    Criteria.where("name").regex(regex, "i"),
                    Criteria.where("address.market").regex(regex, "i"),
                    Criteria.where("address.country").regex(regex, "i")
            ));
        }

        if (hasVal(p.getCountry()))            criteria.add(Criteria.where("address.country").is(p.getCountry()));
        if (hasVal(p.getMarket()))             criteria.add(Criteria.where("address.market").is(p.getMarket()));
        if (hasVal(p.getPropertyType()))       criteria.add(Criteria.where("propertyType").is(p.getPropertyType()));
        if (hasVal(p.getRoomType()))           criteria.add(Criteria.where("roomType").is(p.getRoomType()));
        if (hasVal(p.getCancellationPolicy())) criteria.add(Criteria.where("cancellationPolicy").is(p.getCancellationPolicy()));

        if (p.getMinPrice() != null)    criteria.add(Criteria.where("price").gte(p.getMinPrice()));
        if (p.getMaxPrice() != null)    criteria.add(Criteria.where("price").lte(p.getMaxPrice()));
        if (p.getAccommodates() != null) criteria.add(Criteria.where("accommodates").gte(p.getAccommodates()));
        if (p.getBedrooms() != null)    criteria.add(Criteria.where("bedrooms").gte(p.getBedrooms()));
        if (p.getBathrooms() != null)   criteria.add(Criteria.where("bathrooms").gte(p.getBathrooms()));

        if (Boolean.TRUE.equals(p.getIsSuperhost()))
            criteria.add(Criteria.where("host.hostIsSuperhost").is(true));

        if (p.getMinRating() != null)
            criteria.add(Criteria.where("reviewScores.reviewScoresRating").gte(p.getMinRating()));

        if (Boolean.TRUE.equals(p.getAvailable30()))
            criteria.add(Criteria.where("availability.availability30").gt(0));

        // All amenities must exist in array
        if (p.getAmenities() != null && !p.getAmenities().isEmpty())
            criteria.add(Criteria.where("amenities").all(p.getAmenities()));

        Query query = new Query();
        if (!criteria.isEmpty())
            query.addCriteria(new Criteria().andOperator(criteria.toArray(new Criteria[0])));

        return query;
    }

    private boolean hasVal(String s) {
        return s != null && !s.isBlank();
    }



    public LocationMetadata getLocationsMetadata() {
        // Fetch only address info if optimization is required, or all listings for simplicity
        List<Property> allListings = listingRepository.findAll();

        // 1. Extract unique, sorted countries
        List<String> countries = allListings.stream()
                .map(listing -> listing.getAddress().getCountry())
                .filter(c -> c != null && !c.isBlank())
                .distinct()
                .sorted()
                .collect(Collectors.toList());

        // 2. Group sorted cities/markets by country
        Map<String, List<String>> marketsByCountry = allListings.stream()
                .filter(l -> l.getAddress().getCountry() != null && l.getAddress().getMarket() != null)
                .collect(Collectors.groupingBy(
                        listing -> listing.getAddress().getCountry(),
                        Collectors.mapping(
                                listing -> listing.getAddress().getMarket(),
                                Collectors.filtering(
                                        m -> !m.isBlank(),
                                        Collectors.collectingAndThen(
                                                Collectors.toList(),
                                                list -> list.stream().distinct().sorted().collect(Collectors.toList())
                                        )
                                )
                        )
                ));

        return new LocationMetadata(countries, marketsByCountry);
    }



    public Property getListingById(String id) {
        // repo.findById() automatically wraps the result in an Optional container
        Optional<Property> optionalListing = listingRepository.findById(id);

        // Return the object inside the Optional, or null if the container is empty
        return optionalListing.orElse(null);
    }


}