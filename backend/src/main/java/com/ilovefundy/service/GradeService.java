package com.ilovefundy.service;

import com.siot.IamportRestClient.IamportClient;
import com.siot.IamportRestClient.exception.IamportResponseException;
import com.siot.IamportRestClient.response.AccessToken;
import com.siot.IamportRestClient.response.Certification;
import com.siot.IamportRestClient.response.IamportResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.util.*;

@Service
public class GradeService {
    private IamportClient client;
    @Value("${iamport.restApi.key}")
    private String api_key;
    @Value("${iamport.restApi.secret}")
    private String api_secret_key;

    @PostConstruct
    public void GradeServiceInit() {
        client = new IamportClient(api_key, api_secret_key);
    }

    public boolean isAdult(String imp_uid) throws IOException, IamportResponseException {
        // 아임포트 토큰 발급
        IamportResponse<AccessToken> getToken = client.getAuth();
        String access_token = getToken.getResponse().getToken();

        // imp_uid 로 인증 조회
        IamportResponse<Certification> getCertInfo = client.certificationByImpUid(imp_uid);
        Date birth = getCertInfo.getResponse().getBirth();
        Calendar calendar = new GregorianCalendar();
        calendar.setTime(birth);
        int year = calendar.get(Calendar.YEAR);

        // 성인 인증
        return year <= 2001;
    }

}