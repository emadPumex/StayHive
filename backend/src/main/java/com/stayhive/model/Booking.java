package com.stayhive.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "bookings")
public class Booking {

    @Id
    private String id;

    private String propertyId;

    private String guestId;

    private LocalDate checkIn;

    private LocalDate checkOut;

    private Integer guests;

    private Double totalPrice;

    private BookingStatus status;

    private LocalDateTime createdAt;


    public enum BookingStatus {

        PENDING_PAYMENT,

        CONFIRMED,

        CANCELLED,

        COMPLETED
    }
}