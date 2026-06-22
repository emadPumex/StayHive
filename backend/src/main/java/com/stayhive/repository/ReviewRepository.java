package com.stayhive.repository;

import com.stayhive.model.Review;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ReviewRepository extends MongoRepository<Review, String> {

    List<Review> findByPropertyId(String propertyId);
}
