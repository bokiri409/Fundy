package com.ilovefundy.service;

import com.ilovefundy.dao.*;
import com.ilovefundy.dao.user.UserDao;
import com.ilovefundy.entity.donation.Donation;
import com.ilovefundy.entity.donation.DonationPlace;
import com.ilovefundy.entity.funding.FundingProject;
import com.ilovefundy.entity.funding.FundingRegister;
import com.ilovefundy.entity.idol.Idol;
import com.ilovefundy.entity.pay.PayInfo;
import com.ilovefundy.entity.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;

@RequiredArgsConstructor
@Service
public class AdminService {
    private final FundingRegisterDao fundingRegisterDao;
    private final UserDao userDao;
    private final FundingDao fundingDao;
    private final DonationPlaceDao donationPlaceDao;
    private final IdolDao idolDao;
    private final DonationDao donationDao;

    private final MailService mailService;

    public List<Object> getFanAuthList(int page, int per_page) {
        List<Object> fanAuthList = new LinkedList<>();
        Page<FundingRegister> fundingRegisters = fundingRegisterDao
                .findByUser_IsOfficialFanAndOfficialFanHistoryIsNotNull
                        (User.IsCertification.Waiting, PageRequest.of(page-1, per_page));
        for(FundingRegister auth : fundingRegisters) {
            User user = auth.getUser();
            Map<String, Object> userInfo = new LinkedHashMap<>();
            userInfo.put("userId", user.getUserId());
            userInfo.put("userNickname", user.getUserNickname());
            userInfo.put("userPicture", user.getUserPicture());
            Map<String, Object> tmp = new LinkedHashMap<>();
            tmp.put("user", userInfo);
            tmp.put("officialFanHistory", auth.getOfficialFanHistory());
            fanAuthList.add(tmp);
        }
        return fanAuthList;
    }

    public void patchFanAuth(int user_id, boolean isAccept) { //????????? ????????????
        User user = userDao.getOne(user_id);
        // ??????
        if(isAccept) {
            user.setIsOfficialFan(User.IsCertification.Approve);
            user.setUserLevel(User.Level.LevelUp(user.getUserLevel()));
            userDao.save(user);
        }
        // ??????
        else {
            Optional<FundingRegister> fundingRegisterOpt = fundingRegisterDao.findByUser_UserId(user_id);
            if(fundingRegisterOpt.isPresent()) {
                fundingRegisterOpt.get().setOfficialFanHistory(null);
                user.setIsOfficialFan(User.IsCertification.Decline);
                fundingRegisterDao.save(fundingRegisterOpt.get());
            }
        }
    }

    public List<Object> getProfileAuthList(int page, int per_page) {
        List<Object> profileAuthList = new LinkedList<>();
        Page<FundingRegister> fundingRegisters = fundingRegisterDao
                .findByUser_IsProfileAndFundingRegisterNameIsNotNull(User.IsCertification.Waiting, PageRequest.of(page-1, per_page));
        for(FundingRegister auth : fundingRegisters) {
            User user = auth.getUser();
            Map<String, Object> userInfo = new LinkedHashMap<>();
            userInfo.put("userId", user.getUserId());
            userInfo.put("userNickname", user.getUserNickname());
            Map<String, Object> profile = new LinkedHashMap<>();
            profile.put("profileName", auth.getFundingRegisterName());
            profile.put("profilePicture", auth.getFundingRegisterPicture());
            profile.put("profileAge", auth.getFundingRegisterAge());
            profile.put("profileHistory", auth.getFundingRegisterHistory());
            Map<String, Object> tmp = new LinkedHashMap<>();
            tmp.put("user", userInfo);
            tmp.put("profile", profile);
            profileAuthList.add(tmp);
        }
        return profileAuthList;
    }

    public void patchProfileAuth(int user_id, boolean isAccept) { //????????? ????????????
        User user = userDao.getOne(user_id);
        // ??????
        if(isAccept) {
            user.setIsProfile(User.IsCertification.Approve);
            user.setUserLevel(User.Level.LevelUp(user.getUserLevel()));
            userDao.save(user);
        }
        // ??????
        else {
            Optional<FundingRegister> fundingRegisterOpt = fundingRegisterDao.findByUser_UserId(user_id);
            if(fundingRegisterOpt.isPresent()) {
                fundingRegisterOpt.get().setFundingRegisterName(null);
                fundingRegisterOpt.get().setFundingRegisterPicture(null);
                fundingRegisterOpt.get().setFundingRegisterAge(null);
                fundingRegisterOpt.get().setFundingRegisterHistory(null);
                user.setIsProfile(User.IsCertification.Decline);
                fundingRegisterDao.save(fundingRegisterOpt.get());
            }
        }
    }

    @Transactional
    public boolean completeFunding(int funding_id) {
        FundingProject fundingProject = fundingDao.findByFundingId(funding_id);
        // ????????? ?????? ???, ?????? ????????? ????????? ?????? ???
        if(fundingProject.getIsConfirm() != FundingProject.FundingConfirm.ApprovePost) {
            return false;
        }
        // ?????? ?????????
        long fundingAmount = 0;
        List<PayInfo> fundingPayInfoList = fundingProject.getUserPays();
        for(PayInfo payInfo : fundingPayInfoList) {
            fundingAmount += payInfo.getPayAmount();
        }
        // ?????? ??????
        if(fundingAmount >= fundingProject.getFundingGoalAmount()) {
            // ????????????
            fundingProject.setIsConfirm(FundingProject.FundingConfirm.Success);
        }
        else {
            fundingProject.setIsConfirm(FundingProject.FundingConfirm.Fail);
        }
        // ????????? ????????? ??????????????????
        if(fundingProject.getDonationRate() > 0) {
            DonationPlace donationPlace = donationPlaceDao.findByDonationPlaceId(fundingProject.getDonationPlaceId());
            fundingAmount *= (fundingProject.getDonationRate() * 0.01); // ????????????
            donationPlace.setPlaceTotalAmount(donationPlace.getPlaceTotalAmount() + fundingAmount);
            donationPlaceDao.save(donationPlace);

            Idol idol = idolDao.getOne(fundingProject.getIdolId());
            Donation donation = new Donation();
            donation.setIdol(idol);
            donation.setDonationPlace(donationPlace);
            donation.setIdolDonationAmount(fundingAmount);
            donation.setDonationDate(LocalDate.now());
            donationDao.save(donation);
        }
        fundingDao.save(fundingProject);
        return true;
    }

    public void sendSuccessMail(int funding_id) {
        FundingProject fundingProject = fundingDao.findByFundingId(funding_id);
        User user = userDao.findByUserId(fundingProject.getUserId());
        String email = user.getUserEmail();
        // ????????????
        mailService.sendSuccessMessage(email);
    }

    public void sendFailMail(int funding_id) {
        FundingProject fundingProject = fundingDao.findByFundingId(funding_id);
        User user = userDao.findByUserId(fundingProject.getUserId());
        String email = user.getUserEmail();
        // ????????????
        mailService.sendFailMessage(email);
    }
}
