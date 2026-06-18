package com.stayhive.model.property;

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
