import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import {
    Avatar,
    Button,
    Divider,
    FormControl,
    Link,
    makeStyles,
    Paper,
    TextField,
    Typography,
} from "@material-ui/core";
import { Link as RouterLink, useHistory } from "react-router-dom";
import API from "../../middleware/Api";
import Auth from "../../middleware/Auth";
import { bufferDecode, bufferEncode } from "../../utils/index";
import {
    EmailOutlined,
    Fingerprint,
    VpnKey,
    VpnKeyOutlined,
} from "@material-ui/icons";
import VpnIcon from "@material-ui/icons/VpnKeyOutlined";
import { useLocation } from "react-router";
import { useCaptcha } from "../../hooks/useCaptcha";
import {
    applyThemes,
    setSessionStatus,
    toggleSnackbar,
} from "../../redux/explorer";
import { useTranslation } from "react-i18next";
import InputAdornment from "@material-ui/core/InputAdornment";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import { SvgIcon } from "@material-ui/core";
import { CloudUpload, Folder, Share, Settings } from "@material-ui/icons";
import { Tv, VideoLibrary, OndemandVideo, MusicVideo, Search } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
    layout: {
        width: "auto",
        marginTop: "10px",
        marginLeft: theme.spacing(3),
        marginRight: theme.spacing(3),
        [theme.breakpoints.up("sm")]: {
            width: '100%', // 将这里改为 100%
            maxWidth: '90%', // 可以设置一个最大宽度，如果需要的话
            marginLeft: "auto",
            marginRight: "auto",
        },
        marginBottom: 110,
    },
    paper: {
        //marginTop: theme.spacing(8),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${theme.spacing(
            3
        )}px`,
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: "100%", // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        marginTop: theme.spacing(3),
    },
    link: {
        marginTop: "20px",
        display: "flex",
        width: "100%",
        justifyContent: "space-between",
    },
    buttonContainer: {
        display: "flex",
    },
    authnLink: {
        textAlign: "center",
        marginTop: 16,
    },
}));

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function Welcome() {
    const { t } = useTranslation();

    const [email, setEmail] = useState("");
    const [pwd, setPwd] = useState("");
    const [loading, setLoading] = useState(false);
    const [useAuthn, setUseAuthn] = useState(false);
    const [twoFA, setTwoFA] = useState(false);
    const [faCode, setFACode] = useState("");

    const loginCaptcha = useSelector((state) => state.siteConfig.loginCaptcha);
    const registerEnabled = useSelector(
        (state) => state.siteConfig.registerEnabled
    );
    const title = useSelector((state) => state.siteConfig.title);
    const authn = useSelector((state) => state.siteConfig.authn);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const dispatch = useDispatch();
    const ToggleSnackbar = useCallback(
        (vertical, horizontal, msg, color) =>
            dispatch(toggleSnackbar(vertical, horizontal, msg, color)),
        [dispatch]
    );
    const ApplyThemes = useCallback(
        (theme) => dispatch(applyThemes(theme)),
        [dispatch]
    );
    const SetSessionStatus = useCallback(
        (status) => dispatch(setSessionStatus(status)),
        [dispatch]
    );

    const history = useHistory();
    const location = useLocation();
    const {
        captchaLoading,
        isValidate,
        validate,
        CaptchaRender,
        captchaRefreshRef,
        captchaParamsRef,
    } = useCaptcha();
    const query = useQuery();

    const classes = useStyles();

    useEffect(() => {
        setEmail(query.get("username"));
    }, [location]);

    const openExternalLink = (url) => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <div >


                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'flex-start',
                            marginTop: '20px',
                            marginLeft: '10px',
                            width: '100%'
                        }}><b>网址导航</b></div>
                        <div style={{ 
                            display: 'flex', 
                            flexWrap: 'wrap', 
                            justifyContent: 'flex-start', 
                            marginTop: '20px',
                            width: '100%'
                        }}>
                            {[
                                { Icon: Tv, name: '优酷视频', color: '#00A3FF', onClick: () => openExternalLink('https://www.youku.com') },
                                { Icon: VideoLibrary, name: '腾讯视频', color: '#FF9900', onClick: () => openExternalLink('https://v.qq.com') },
                                { Icon: OndemandVideo, name: '爱奇艺', color: '#00BE06', onClick: () => openExternalLink('https://www.iqiyi.com') },
                                { Icon: MusicVideo, name: '抖音', color: '#000000', onClick: () => openExternalLink('https://www.douyin.com') },
                            ].map((item, index) => (
                                <div 
                                    key={index} 
                                    style={{ 
                                        display: 'flex', 
                                        flexDirection: 'column', 
                                        alignItems: 'center', 
                                        margin: '5px',
                                        cursor: 'pointer',
                                        width: '60px' // 固定宽度以确保对齐
                                    }}
                                    onClick={item.onClick}
                                >
                                    <SvgIcon component={item.Icon} style={{ fontSize: 40, color: item.color }} />
                                    <Typography variant="caption">{item.name}</Typography>
                                </div>
                            ))}
                        </div>

                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'flex-start',
                            marginTop: '20px',
                            width: '100%'
                        }}>
                            {[
                                { Icon: Search, name: '必应', color: '#008373', onClick: () => openExternalLink('https://www.bing.com') },
                                { Icon: Search, name: '搜狗', color: '#FD6853', onClick: () => openExternalLink('https://www.sogou.com') },
                                { Icon: Search, name: '百度', color: '#3388FF', onClick: () => openExternalLink('https://www.baidu.com') },
                            ].map((item, index) => (
                                <div
                                    key={index}
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        margin: '5px',
                                        cursor: 'pointer',
                                        width: '60px' // 固定宽度以确保对齐
                                    }}
                                    onClick={item.onClick}
                                >
                                    <SvgIcon component={item.Icon} style={{ fontSize: 40, color: item.color }} />
                                    <Typography variant="caption">{item.name}</Typography>
                                </div>
                            ))}
                        </div>






        </div>
    );
}

export default Welcome;
