package com.stayhive.repository;


import com.stayhive.model.property.Property;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PropertyRepository extends MongoRepository<Property, String> {

    List<Property> findByHostHostId(String hostId);
}
