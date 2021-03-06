import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Collapse,
  Divider,
  Grid,
  IconButton,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import LockIcon from '@material-ui/icons/Lock';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import EmojiPeopleIcon from '@material-ui/icons/EmojiPeople';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import styles from './Profile.module.css';
import classNames from 'classnames';
import { ResponseUser, User } from '../../../common/types';
import { useDispatch, useSelector } from 'react-redux';
import { rootState } from '../../../reducers';
import ModifyPassword from './ModifyPassword';
import ModifyNickname from './ModifyNickname';
import { getCerts, setThumbnail } from '../../../api/user';
import CertUserInfo from './CertUserInfo';
import CertFan from './CertFan';
import { setUser } from '../../../reducers/user';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';

interface Cert {
  isAdult: string;
  isOfficialFan: string;
  isPlus: string;
  isProfile: string;
}

const Profile = () => {
  const [fold, setFold] = useState(true);
  const user: User = useSelector((state: rootState) => state.userReducer.user);
  const token: string = useSelector(
    (state: rootState) => state.userReducer.token
  );
  const [openPw, setOpenPw] = useState(false);
  const [openN, setOpenN] = useState(false);
  const [openCertFan, setOpenCertFan] = useState(false);
  const [openCertUserInfo, setOpenCertUserInfo] = useState(false);
  const [cert, setCert] = useState<Cert>();
  const dispatch = useDispatch();
  const [show, setShow] = useState<boolean>(false);

  useEffect(() => {
    getCerts(token).then((resp) => {
      const certObj: Cert = {
        isAdult: resp.data.isAdult,
        isOfficialFan: resp.data.isOfficialFan,
        isPlus: resp.data.isPlus,
        isProfile: resp.data.isProfile,
      };
      setCert(certObj);
    });
  }, [token]);

  const handleOpenFan = () => {
    setOpenCertFan(true);
  };

  const handleCloseFan = () => {
    setOpenCertFan(false);
  };

  const handleOpenUserInfo = () => {
    setOpenCertUserInfo(true);
  };

  const handleCloseUserInfo = () => {
    setOpenCertUserInfo(false);
  };

  const handleOpenPw = () => {
    setOpenPw(true);
  };

  const handleClosePw = () => {
    setOpenPw(false);
  };

  const handleOpenN = () => {
    setOpenN(true);
  };

  const handleCloseN = () => {
    setOpenN(false);
  };

  const handleImage = (e: any) => {
    setThumbnail(e.target.files[0], token).then((resp: any) => {
      const newUser: ResponseUser = {
        userEmail: user.email,
        userId: user.user_id,
        userLevel: user.level,
        userAddress: user.address,
        userNickname: user.nickname,
        userPicture: resp.data.userPicture,
        role: user.role,
      };
      dispatch(setUser(newUser, token));
    });
  };

  useEffect(() => {
    setTimeout(() => {
      setShow(true);
    }, 200);
  }, []);

  return (
    <div
      style={{
        opacity: show ? 1 : 0,
        transition: 'all 0.5s ease-in-out',
      }}
    >
      <ModifyPassword open={openPw} onClose={handleClosePw} />
      <ModifyNickname open={openN} onClose={handleCloseN} />
      <CertFan open={openCertFan} onClose={handleCloseFan} />
      <CertUserInfo open={openCertUserInfo} onClose={handleCloseUserInfo} />
      <Box
        mx={1}
        mt={6}
        className="nbg_bold font-smooth"
        style={{ fontSize: '2em', color: 'white', opacity: 0.95 }}
      ></Box>
      <Card
        className="hover-big card-zone"
        elevation={0}
        style={{ position: 'relative' }}
      >
        <CardContent style={{ paddingBottom: '0px' }}>
          <Box display="flex" justifyContent="space-between">
            <Box display="flex">
              <Box>
                <IconButton component="label">
                  <input
                    type="file"
                    accept=".gif, .jpg, .png"
                    onChange={handleImage}
                    style={{ display: 'none' }}
                  />
                  <Avatar className={styles.avatar}></Avatar>
                </IconButton>
              </Box>
              <Box ml={2} mt={2}>
                <Box display="flex">
                  <LockIcon
                    style={{ color: 'red', fontSize: '1.4em', opacity: 0.6 }}
                  ></LockIcon>
                  <Box
                    className="nbg_m font-smooth"
                    style={{ color: '#f5f5f5', fontSize: '1em', opacity: 0.85 }}
                  >
                    ???????????? {user.level}
                  </Box>
                </Box>
                <Box
                  className="nbg_bold font-smooth"
                  style={{
                    color: 'white',
                    fontSize: '1.7em',
                    marginTop: '10px',
                    opacity: 0.9,
                  }}
                >
                  {user.nickname}???
                </Box>
                <Box
                  className="nbg_m font-smooth"
                  style={{ fontSize: '1em', opacity: 0.8, color: '#f5f5f5' }}
                >
                  {user.email}
                </Box>
              </Box>
            </Box>
            <Box mr={2} style={{ marginTop: '12px' }}>
              <Box display="flex" justifyContent="flex-end">
                <Button
                  variant="contained"
                  style={{
                    fontSize: '0.9em',
                  }}
                  className="mypage-btn nbg_bold font-smooth"
                  onClick={handleOpenN}
                >
                  ????????? ??????
                </Button>
                <Button
                  variant="contained"
                  className="mypage-btn nbg_bold font-smooth"
                  style={{
                    fontSize: '0.9em',
                    marginLeft: '15px',
                  }}
                  onClick={handleOpenPw}
                >
                  ???????????? ??????
                </Button>
              </Box>
            </Box>
          </Box>
        </CardContent>
        <Collapse in={!fold}>
          <Divider />
          <CardContent style={{ paddingBottom: '0px' }}>
            <Grid container>
              <Grid container item xs={12}>
                <VerifiedUserIcon
                  style={{
                    color: 'white',
                    fontSize: '1.6em',
                    marginRight: '3px',
                    marginLeft: '10px',
                    opacity: 0.8,
                  }}
                />
                <Box
                  style={{ color: 'white', opacity: 0.8 }}
                  className="nbg_bold font-smooth"
                  fontSize="1.2em"
                >
                  ????????????
                </Box>
              </Grid>
              <Grid item container xs={12} style={{ margin: '5px' }}>
                <Grid item xs={3}>
                  <Grid item container xs={12} justify="center">
                    <IconButton size="small" disabled={cert?.isAdult !== 'N'}>
                      <PersonOutlineIcon
                        className={
                          cert?.isAdult === 'Y'
                            ? styles.cert_icon
                            : cert?.isAdult === 'Waiting'
                            ? styles.waiting_icon
                            : styles.uncert_icon
                        }
                      />
                    </IconButton>
                  </Grid>
                  <Grid item container xs={12} justify="center">
                    <Box
                      style={{
                        color: 'white',
                        opacity: 0.8,
                        fontSize: '1.2em',
                      }}
                      className="nbg_bold font-smooth"
                    >
                      ?????? ??????
                    </Box>
                  </Grid>
                </Grid>
                <Grid item xs={3}>
                  <Grid item container xs={12} justify="center">
                    <IconButton
                      size="small"
                      disabled={
                        cert?.isOfficialFan !== 'N' &&
                        cert?.isOfficialFan !== 'Decline'
                      }
                      onClick={handleOpenFan}
                    >
                      <FavoriteBorderIcon
                        className={
                          cert?.isOfficialFan === 'Approve'
                            ? styles.cert_icon
                            : cert?.isOfficialFan === 'Waiting'
                            ? styles.waiting_icon
                            : styles.uncert_icon
                        }
                      />
                    </IconButton>
                  </Grid>
                  <Grid item container xs={12} justify="center">
                    <Box
                      style={{
                        color: 'white',
                        opacity: 0.8,
                        fontSize: '1.2em',
                      }}
                      className="nbg_bold font-smooth"
                    >
                      ????????? ??????
                    </Box>
                  </Grid>
                </Grid>
                <Grid item xs={3}>
                  <Grid item container xs={12} justify="center">
                    <IconButton
                      size="small"
                      disabled={
                        cert?.isProfile !== 'N' && cert?.isProfile !== 'Decline'
                      }
                      onClick={handleOpenUserInfo}
                    >
                      <EmojiPeopleIcon
                        className={
                          cert?.isProfile === 'Approve'
                            ? styles.cert_icon
                            : cert?.isProfile === 'Waiting'
                            ? styles.waiting_icon
                            : styles.uncert_icon
                        }
                      />
                    </IconButton>
                  </Grid>
                  <Grid item container xs={12} justify="center">
                    <Box
                      style={{
                        color: 'white',
                        opacity: 0.8,
                        fontSize: '1.2em',
                      }}
                      className="nbg_bold font-smooth"
                    >
                      ?????? ?????? ??????
                    </Box>
                  </Grid>
                </Grid>
                <Grid item xs={3}>
                  <Grid item container xs={12} justify="center">
                    <IconButton size="small" disabled={cert?.isPlus !== 'N'}>
                      <AddCircleOutlineIcon
                        className={
                          cert?.isPlus === 'Y'
                            ? styles.cert_icon
                            : cert?.isPlus === 'Waiting'
                            ? styles.waiting_icon
                            : styles.uncert_icon
                        }
                      />
                    </IconButton>
                  </Grid>
                  <Grid
                    style={{
                      color: 'white',
                      opacity: 0.8,
                      fontSize: '1.2em',
                    }}
                    item
                    container
                    xs={12}
                    justify="center"
                  >
                    <Box className="nbg_bold font-smooth">????????? ??????</Box>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Collapse>
        <Box display="flex" justifyContent="center">
          <Button
            fullWidth
            size="small"
            style={{ borderRadius: 0 }}
            onClick={() => {
              setFold(!fold);
            }}
          >
            {fold ? (
              <KeyboardArrowDownIcon style={{ fontSize: '2.5em' }} />
            ) : (
              <KeyboardArrowUpIcon style={{ fontSize: '2.5em' }} />
            )}
          </Button>
        </Box>
      </Card>
    </div>
  );
};

export default Profile;
