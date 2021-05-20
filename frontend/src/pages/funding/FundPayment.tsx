import { Box, Button, CardMedia, Modal, TextField } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { RouteComponentProps, useParams } from "react-router-dom";
import { getFundDetail, getFundNotice } from "../../api/fund";
import { setPayment } from "../../api/funding";
import { FundForm, FundingNotice, User } from "../../common/types";
import Banner from "../../components/Banner";
import FullWidthTabs from "../../components/fundComponent/FullWidthTabs";
import { rootState } from "../../reducers";
import "./FundingDetail.css";

declare global {
  interface Window {
    IMP: any;
  }
}
const { IMP } = window;
interface MatchParams {
  num: string;
}

const FundPayment = ({ match }: RouteComponentProps<MatchParams>) => {
  const params: Params = useParams();
  interface Params {
    fund_id: string;
  }
  const [Fund, setFund] = useState<FundForm>();
  console.log(match.params.num);
  useEffect(() => {
    console.log("fundDetailPage");

    getFundDetail(Number(match.params.num)).then((response) => {
      console.log(">>>>" + response.data);
      setFund(response.data);
    });
  }, [params]);

  const [money, setMoney] = useState<number>(10000);

  const handlerMoney = (e: any) => {
    setMoney(Number(e.target.value));
  };

  console.log(match.params.num);

  const user: User = useSelector((state: rootState) => state.userReducer.user);
  const [percentage, setPercentage] = useState<number>();

  const history = useHistory();

  interface Params {
    fund_id: string;
  }

  interface Props {
    fundInfo: FundForm | undefined;
  }
  const [open, setOpen] = React.useState(false);

  const [notices, setNotices] = useState<FundingNotice[]>([]);

  const token: string = useSelector(
    (state: rootState) => state.userReducer.token
  );

  useEffect(() => {
    console.log("fundDetailPage");

    getFundDetail(Number(match.params.num)).then((response) => {
      console.log(">>>>" + response.data);
      setFund(response.data);
    });

    if (Fund?.fundingAchievementRate != null) {
      if (Number(Fund?.fundingAchievementRate) >= 100) {
        setPercentage(100);
      } else setPercentage(Number(Fund?.fundingAchievementRate));
    }
  }, [params]);

  useEffect(() => {
    console.log("fundNotices Request");
    getFundNotice(Number(match.params.num)).then((response) => {
      console.log(response.data);
      setNotices(response.data);
    });
  }, [params]);

  const payment_test = () => {
    IMP.init("imp09514011");


    IMP.request_pay(
      {
        pg: "inicis", // version 1.1.0부터 지원.
        pay_method: "card",
        merchant_uid: "merchant_" + new Date().getTime(),
        name: "펀디 결제: "+Fund?.fundingName,
        amount: money, //판매 가격
        buyer_email: "iamport@siot.do",
        buyer_name: "구매자이름",
        buyer_tel: "010-1234-5678",
        buyer_addr: "서울특별시 강남구 삼성동",
        buyer_postcode: "123-456",
      },
      function (rsp: any) {
        if (rsp.success) {
          var msg = "결제가 완료되었습니다.";
          alert(msg);
          setPayment(token, Number(match.params.num), rsp.imp_uid, money);
          history.push("/mypage");
        } else {
          var msg = "결제에 실패하였습니다.";
          msg += "에러내용 : " + rsp.error_msg;
          setPayment(token, Number(match.params.num), "imp09514011", money);
          var urlBack = "/funding/detail/" + Fund?.fundingId;
          alert(msg);
          history.push(urlBack);
        }
      }
    );
  };

  return (
    <div>
      <div></div>
      <div
        className="titleArea"
        style={{ height: "158px" }} //background: `url(${Fund?.fundingThumbnail})`}}
      >
        <h3 className="fundingTitle">{Fund?.fundingName}</h3>
        <h5 className="fundingSub">{Fund?.fundingSubtitle}</h5>
      </div>
      <div className="col-md-1"></div>
      <div className="col-md-10">
        <Box mx={1} my={2} className="nbg_bold" style={{ fontSize: "2em" }}>
          펀딩 결제하기
        </Box>
        <div className="row">
          <div className="col-md-4 imgArea">
            <CardMedia
              className="cardImg"
              component="img"
              alt="펀딩 카드 이미지"
              width="100%"
              image={Fund?.fundingThumbnail}
              title="Card Image"
            />
          </div>
          <div className="col-md-8">
            <TextField
              value={money}
              onChange={handlerMoney}
              label="후원금"
              type="number"
            ></TextField>
            <Button
              className="btn_main"
              variant="contained"
              onClick={payment_test}
            >
              후원하기
            </Button>
          </div>
        </div>

        <div>
          <FullWidthTabs
            detail={Fund?.fundingContent}
            notices={notices}
          ></FullWidthTabs>
        </div>
      </div>
    </div>
  );
};

export default FundPayment;
