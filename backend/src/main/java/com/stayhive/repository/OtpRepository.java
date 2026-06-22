package com.stayhive.repository;

import com.stayhive.model.OtpVerification;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface OtpRepository extends MongoRepository<OtpVerification, String> {
    Optional<OtpVerification> findByEmail(String email);
    void deleteByEmail(String email);
}