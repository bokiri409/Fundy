package com.ilovefundy.model.funding;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

@NoArgsConstructor
@Valid
@Data
public class NoticeRequest {
    @NotNull
    String title;
    @NotNull
    String nickname;
    @NotNull
    String content;

    String picture;
}
