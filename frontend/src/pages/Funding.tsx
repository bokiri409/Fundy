import React, { Component, useEffect, useRef, useState } from 'react';
import {
  createStyles,
  makeStyles,
  Theme,
  withStyles,
} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import LinearProgress from '@material-ui/core/LinearProgress';
import {
  Grid,
  Paper,
  Box,
  CircularProgress,
  TextField,
  Dialog,
  DialogContent,
  DialogProps,
} from '@material-ui/core';
import FundCard from '../components/FundCard';
import 'swiper/swiper.scss';
import SwiperCore, { Navigation, Pagination, Scrollbar } from 'swiper/core';
import { useHistory, withRouter } from 'react-router-dom';
import Banner from '../components/Banner';
import FundCreate from '../pages/funding/FundCreate';
import './Main.css';
import { getFundingList } from '../api/funding';
import { IFunding, FundingStatus, User, FundForm } from '../common/types';
import { useSelector } from 'react-redux';
import { rootState } from '../reducers';
import './Funding.css';
import FundItem from '../components/FundItem';
import bannerTip from '../assets/img/bannerTip.png';
import bannerCreate from '../assets/img/bannerCreate.png';
import fundyTuto from '../assets/img/fundyTuto.png';
import { getCerts } from '../api/user';

SwiperCore.use([Navigation, Pagination, Scrollbar]);

const BorderLinearProgress = withStyles((theme: Theme) =>
  createStyles({
    root: {
      height: 10,
      borderRadius: 5,
    },
    colorPrimary: {
      backgroundColor:
        theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
    },
    bar: {
      borderRadius: 5,
      backgroundColor: '#1a90ff',
    },
  })
)(LinearProgress);

const Funding = () => {
  const [open, setOpen] = React.useState(false);
  const [scroll, setScroll] = React.useState<DialogProps['scroll']>('paper');
  const [fundings, setFundings] = useState<IFunding[]>([]);
  const [failFundings, setFailFundings] = useState<IFunding[]>([]);
  const [fundingRank, setFundingRank] = useState<IFunding[]>([]);
  const [fundingStatus, setFundingStatus] = useState<FundingStatus>({
    page: 1,
    per_page: 3,
    status: 2,
    keyword: '',
  });
  const [header, setHeader] = useState<string>('???????????? ??????');
  const user: User = useSelector((state: rootState) => state.userReducer.user);

  const [isBottom, setIsBottom] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const containerRef = useRef(null);
  const [delay, setDelay] = useState<number>(700);
  const [isPlaying, setPlaying] = useState<boolean>(false);
  const [isEnd, setIsEnd] = useState<boolean>(false);
  const [searchWord, setSearchWord] = useState<string>('');
  const [buttonNumber, setButtonNumber] = useState<number>(1);
  const [show, setShow] = useState<boolean>(false);
  const token: string = useSelector(
    (state: rootState) => state.userReducer.token
  );
  const handleClickOpen = (scrollType: DialogProps['scroll']) => () => {
    setOpen(true);
    setScroll(scrollType);
  };

  function useInterval(callback: () => void, delay: number | null) {
    const savedCallback = useRef(callback);
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
      if (delay === null) {
        return;
      }

      const id = setInterval(() => savedCallback.current(), delay);

      return () => clearInterval(id);
    }, [delay]);
  }

  useInterval(
    () => {
      setFundingStatus({
        ...fundingStatus,
        per_page: fundingStatus.per_page + 3,
      });
    },
    isPlaying ? delay : null
  );

  useEffect(() => {
    if (isBottom) {
      setLoading(true);
      setPlaying(true);
    } else {
      setLoading(false);
      setPlaying(false);
    }
  }, [isBottom]);

  const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0,
  };

  const callback = (entries: any) => {
    const [entry] = entries;
    setIsBottom(entry.isIntersecting);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(callback, options);
    if (containerRef.current) {
      observer.observe(containerRef.current!);
    }
    return () => observer && observer.disconnect();
  }, [containerRef]);

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    setTimeout(() => {
      setShow(true);
    }, 10);
    getFundingList({
      page: 1,
      per_page: 1000,
      status: 2,
      keyword: '',
    }).then((resp) => {
      let data = resp.data;
      data = data.sort((a: FundForm, b: FundForm) => {
        const aAmount = Number(a.fundingParticipants);
        const bAmount = Number(b.fundingParticipants);
        if (aAmount === bAmount) {
          return a.fundingId - b.fundingId;
        } else {
          return bAmount - aAmount;
        }
      });
      setFundingRank(data.slice(0, 3));
    });
  }, []);

  const descriptionElementRef = React.useRef<HTMLElement>(null);
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  useEffect(() => {
    getFundingList(fundingStatus).then((resp) => {
      if (resp.data.length === fundings.length) {
        setIsEnd(true);
      }
      setFundings(resp.data);
    });
  }, [fundingStatus]);

  const handleWaitFunding = () => {
    setIsEnd(false);
    setSearchWord('');
    setFundingStatus({
      page: 1,
      per_page: 3,
      status: 1,
      keyword: '',
    });
    setButtonNumber(0);
    setHeader('???????????? ??????');
  };

  const handleProgressFunding = () => {
    setIsEnd(false);
    setSearchWord('');
    setFundingStatus({
      page: 1,
      per_page: 3,
      status: 2,
      keyword: '',
    });
    setButtonNumber(1);
    setHeader('???????????? ??????');
  };

  const handleEndFunding = () => {
    setIsEnd(false);
    setSearchWord('');
    setFundingStatus({
      page: 1,
      per_page: 3,
      status: 3,
      keyword: '',
    });
    setButtonNumber(2);
    setHeader('????????? ??????');
  };

  const loginRedirect = (msg: string, path: string) => {
    alert(msg);
    history.push({
      pathname: path,
      state: {},
    });
  };

  const createRedirect = () => {
    history.push({
      pathname: 'funding/create',
      state: {},
    });
  };

  const handleNeedAcceptFunding = () => {
    setIsEnd(false);
    setSearchWord('');
    setFundingStatus({
      page: 1,
      per_page: 3,
      status: 0,
      keyword: '',
    });
    setButtonNumber(3);
    setHeader('?????? ?????? ??????');
  };
  const handleDeclineFunding = () => {
    setIsEnd(false);
    setSearchWord('');
    setFundingStatus({
      page: 1,
      per_page: 3,
      status: 4,
      keyword: '',
    });
    setButtonNumber(4);
    setHeader('????????? ??????');
  };
  const handleSuccessFunding = () => {
    setIsEnd(false);
    setSearchWord('');
    setFundingStatus({
      page: 1,
      per_page: 3,
      status: 5,
      keyword: '',
    });
    setButtonNumber(5);
    setHeader('????????? ??????');
  };
  const handleFailFunding = () => {
    setIsEnd(false);
    setSearchWord('');
    setFundingStatus({
      page: 1,
      per_page: 3,
      status: 6,
      keyword: '',
    });
    setButtonNumber(6);
    setHeader('????????? ??????');
  };

  const handleSearch = () => {
    setIsEnd(false);
    setFundingStatus({ ...fundingStatus, per_page: 3, keyword: searchWord });
  };

  const handleKeyPress = (e: any) => {
    if (e.keyCode == 13) {
      handleSearch();
    }
  };

  const history = useHistory();

  const handleCreateBanner = () => {
    if (user === null) {
      loginRedirect('????????? ??? ?????? ????????? ???????????????.', '/login');
    } else {
      getCerts(token).then((resp) => {
        if (resp.data.isAdult === 'Y') {
          createRedirect();
        } else {
          loginRedirect('?????? ?????? ??? ????????? ???????????????.', '/mypage');
        }
      });
    }
  };

  return (
    <div
      style={{
        opacity: show ? 1 : 0,
        transition: show ? 'all 0.5s ease-in-out' : '',
      }}
    >
      <div id="bannerArea">
        <div>
          <Banner />
        </div>
      </div>

      <div className="row">
        <div className="col-md-1 col-sm-1"></div>
        <div className="col-md-10 col-sm-10">
          <div className="row">
            <div
              className="col-md-6"
              onClick={handleClickOpen('body')}
              style={{ padding: '5px' }}
            >
              <img
                src={bannerTip}
                style={{
                  width: '100%',
                  borderRadius: '10px',
                  cursor: 'pointer',
                }}
              />
            </div>
            <div
              className="col-md-6"
              onClick={handleCreateBanner}
              style={{ padding: '5px' }}
            >
              <img
                src={bannerCreate}
                style={{
                  width: '100%',
                  borderRadius: '10px',
                  cursor: 'pointer',
                }}
              />
            </div>
          </div>
          <Dialog
            className="dialogClass"
            open={open}
            onClose={handleClose}
            scroll={scroll}
            aria-labelledby="scroll-dialog-title"
            aria-describedby="scroll-dialog-description"
          >
            <DialogContent className="dialog" dividers={scroll === 'paper'}>
              <div className="modalDiv">
                <img onClick={handleClose} width="100%" src={fundyTuto}></img>
              </div>
            </DialogContent>
          </Dialog>

          <Box
            mt={4}
            mb={3}
            className="nbg_bold font-smooth"
            style={{ fontSize: '2em' }}
          >
            ?????? ?????? ???????????? ??????
          </Box>
          <Grid container spacing={3}>
            {fundingRank?.map((funding: IFunding, i: number) => {
              return (
                <div
                  className="col-md-4 col-sm-6 col-xs-12"
                  key={funding.fundingId}
                  style={{ padding: '10px' }}
                >
                  <FundCard funding={funding}></FundCard>
                </div>
              );
            })}
          </Grid>

          <Box
            mt={4}
            mb={3}
            className="nbg_bold font-smooth"
            style={{ fontSize: '2em', marginTop: '80px' }}
          >
            {header}
          </Box>
          <div className="row">
            <div className="col-md-4">
              <Box mb={1}>
                <Button
                  className={buttonNumber == 0 ? 'fundBtn' : 'unselect_fundBtn'}
                  variant="contained"
                  onClick={handleWaitFunding}
                >
                  ???????????? ??????
                </Button>
                <Button
                  className={
                    buttonNumber === 1 ? 'fundBtn' : 'unselect_fundBtn'
                  }
                  variant="contained"
                  onClick={handleProgressFunding}
                >
                  ???????????? ??????
                </Button>
                <Button
                  className={
                    buttonNumber === 2 ? 'fundBtn' : 'unselect_fundBtn'
                  }
                  variant="contained"
                  onClick={handleEndFunding}
                >
                  ????????? ??????
                </Button>
              </Box>
              {user !== null && user.role == 'ADMIN' ? (
                <>
                  <Button
                    className={
                      buttonNumber === 3 ? 'fundBtn' : 'unselect_fundBtn'
                    }
                    variant="contained"
                    onClick={handleNeedAcceptFunding}
                  >
                    ?????? ?????? ??????
                  </Button>
                  <Button
                    className={
                      buttonNumber === 4 ? 'fundBtn' : 'unselect_fundBtn'
                    }
                    variant="contained"
                    onClick={handleDeclineFunding}
                  >
                    ????????? ??????
                  </Button>
                  <Button
                    className={
                      buttonNumber === 5 ? 'fundBtn' : 'unselect_fundBtn'
                    }
                    variant="contained"
                    onClick={handleSuccessFunding}
                  >
                    ????????? ??????
                  </Button>
                  <Button
                    className={
                      buttonNumber === 6 ? 'fundBtn' : 'unselect_fundBtn'
                    }
                    variant="contained"
                    onClick={handleFailFunding}
                  >
                    ????????? ??????
                  </Button>
                </>
              ) : (
                <></>
              )}
            </div>
            <div className="col-md-4"></div>
            <div className="col-md-4" style={{ paddingBottom: '30px' }}>
              <TextField
                variant="outlined"
                value={searchWord}
                className="searchArea"
                onChange={(e) => {
                  setSearchWord(e.target.value);
                }}
                onKeyDown={handleKeyPress}
                inputProps={{
                  style: {
                    fontSize: '1.5em',
                    height: '10px',
                    borderRadius: '20px',
                  },
                }}
                style={{
                  paddingRight: '5px',
                  width: '400px',
                  borderRadius: '20px',
                }}
              ></TextField>
              <Button
                className="ml-2 btn_main"
                disableElevation
                variant="contained"
                onClick={handleSearch}
                style={{ fontSize: '1.4em', height: '45px', marginTop: '1px' }}
              >
                {' '}
                ??????{' '}
              </Button>
            </div>
          </div>
          <Box
            mt={5}
            display="flex"
            justifyContent="center"
            alignItems="center"
            style={{
              height: fundings.length === 0 ? '400px' : '0px',
            }}
          >
            <Box
              fontSize="3em"
              color="silver"
              className="nbg_bold font-smooth"
              style={{
                transition: 'opacity 0.5s ease-in-out',
                visibility: fundings.length === 0 ? 'visible' : 'hidden',
                opacity: fundings.length === 0 ? 1 : 0,
              }}
            >
              ????????? ?????? ????????? ?????? ??? ????????????.
            </Box>
          </Box>
          <Grid container spacing={3}>
            {fundings?.map((funding: IFunding, i: number) => (
              <div
                className="col-md-4 col-sm-6 col-xs-12"
                style={{ padding: '10px' }}
                key={funding.fundingId}
              >
                <FundCard funding={funding}></FundCard>
              </div>
            ))}
          </Grid>
          {failFundings.length !== 0 ? (
            <Box
              mx={1}
              my={2}
              className="nbg_bold"
              style={{ fontSize: '1.2em' }}
            >
              ????????? ??????
            </Box>
          ) : (
            <></>
          )}
          {failFundings.length !== 0 ? (
            failFundings?.map((funding: IFunding, i: number) => (
              <div className="col-lg-4" key={funding.fundingId}>
                <FundCard funding={funding}></FundCard>
              </div>
            ))
          ) : (
            <></>
          )}
        </div>
        <div className="col-md-1 col-sm-1"></div>
      </div>
      <div ref={containerRef}> </div>
      <Box mt={10} display="flex" justifyContent="center">
        <CircularProgress
          style={{
            height: !isEnd && loading ? '50px' : '0px',
            opacity: !isEnd && loading ? 1 : 0,
            transition: 'height 0.5s ease-in-out, opacity 0.5s ease-in-out',
          }}
        />
      </Box>
    </div>
  );
};

export default Funding;
