package com.example.mongo.model.Listing;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Host {

    private String hostName;
    private Boolean hostIsSuperhost;
    private String hostThumbnailUrl;
}
