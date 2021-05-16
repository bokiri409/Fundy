package com.ilovefundy.dto.funding;

import com.ilovefundy.entity.funding.FundingProject;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;

@NoArgsConstructor
@Valid
@Data
public class FundingRequest {
    @NotNull
    FundingProject.FundingType fundingType;
//    @NotNull
//    Integer userId;
    @NotNull
    String fundingName;
    @NotNull
    String fundingSubtitle;
    @NotNull
    Integer idolId;
//    @NotNull
//    String idolName;
    @NotNull
    Integer goalAmount;
    @NotNull
    LocalDateTime startTime;
    @NotNull
    LocalDateTime endTime;
    @NotNull
    String fundingContent;

    String Thumbnail;
    @NotNull
    Integer donationRate;

    Integer donationPlaceId;
}
