package com.stayhive.model.property;

import java.util.List;
import java.util.Map;

public record LocationMetadata(
        List<String> countries,
        Map<String, List<String>> marketsByCountry
) {}