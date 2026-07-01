package com.stayhive.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;

import java.math.BigDecimal;
import java.time.Instant;
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
    private String roomCategoryId;
    private String guestId;

    private LocalDate checkIn;

    private LocalDate checkOut;

    private Integer guests;

    @Field(targetType = FieldType.DECIMAL128)
    private BigDecimal totalPrice;

    private BookingStatus status;

    private Instant createdAt;

    private Instant updatedAt;

    private PaymentMode paymentMode;


    private PaymentDetails paymentDetails;


    // Snapshot of the structural price components at the exact moment of booking
    private PriceBreakdownSnapshot priceBreakdown;

    public enum BookingStatus {

        PENDING_PAYMENT,

        CONFIRMED,

        CANCELLED,

        COMPLETED
    }


    public enum PaymentMode {
        CASH,
        RAZORPAY
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PriceBreakdownSnapshot {
        @Field(targetType = FieldType.DECIMAL128)
        private BigDecimal basePricePerNight;

        private Integer totalNights;

        @Field(targetType = FieldType.DECIMAL128)
        private BigDecimal cleaningFee;

        @Field(targetType = FieldType.DECIMAL128)
        private BigDecimal serviceFee;

        @Field(targetType = FieldType.DECIMAL128)
        private BigDecimal taxPaid;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PaymentDetails {
        private String gatewayPaymentId;  // e.g., Razorpay payment_id
        private String gatewayOrderId;    // e.g., Razorpay order_id
        private String gatewaySignature;  // Verifies payment tampering protection
        private Instant paidAt;
    }
}