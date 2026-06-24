package com.stayhive.dto;

public record ReviewRequestDTO(
        Integer rating,
        String comment
) {
}
