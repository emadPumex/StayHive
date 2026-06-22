package com.stayhive.model.property;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Host {

    private String hostId;

    private String hostName;

    @Builder.Default
    private Boolean hostIsSuperhost= false;

    @Builder.Default
    private String profileImageUrl="https://i.pinimg.com/736x/ba/2c/ec/ba2cec94582afaab654ebd4538224b29.jpg";
}