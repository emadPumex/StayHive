package com.stayhive.dto;

import java.util.List;
import java.util.Map;

public record LocationMetadata(
        List<String> countries,
        Map<String, List<String>> citiesByCountry
) {}