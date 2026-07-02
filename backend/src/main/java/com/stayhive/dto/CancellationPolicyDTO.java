package com.stayhive.dto;

import java.util.List;

public record CancellationPolicyDTO(
        String type,              // FLEXIBLE | MODERATE | STRICT | SUPER_STRICT
        String name,
        String description,
        List<CancellationWindowDTO> windows
) {
}
