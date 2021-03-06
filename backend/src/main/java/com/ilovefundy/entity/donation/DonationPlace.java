package com.ilovefundy.entity.donation;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import lombok.*;
import org.hibernate.annotations.BatchSize;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@JsonIdentityInfo(generator= ObjectIdGenerators.PropertyGenerator.class, property="donationPlaceId")
@Entity
@Getter
@Setter
@Table(name = "donation_place")
@AllArgsConstructor
@NoArgsConstructor
public class DonationPlace {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "donation_place_id")
    private Integer donationPlaceId;

    @BatchSize(size = 10)
    @OneToMany(mappedBy = "donationPlace")
    private List<Donation> donations = new ArrayList<>();

    @Column(name = "place_name")
    private String placeName;
    @Column(name = "place_address")
    private String placeAddress;
    @Column(name = "place_picture")
    private String placePicture;    // 기부처 사진
    @Column(name = "place_desciption")
    private String placeDescription;
    @Column(name = "place_total_amount")
    private Long placeTotalAmount; // 총기부금액
    @Column(name = "account_number")
    private String accountNumber; // 기부처 계좌번호
}
