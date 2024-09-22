import {
    Divider,
    ListItemIcon,
    MenuItem,
    Typography,
    withStyles,
} from "@material-ui/core";
import Menu from "@material-ui/core/Menu";
import { Archive, InfoOutlined, Unarchive } from "@material-ui/icons";
import RenameIcon from "@material-ui/icons/BorderColor";
import DownloadIcon from "@material-ui/icons/CloudDownload";
import UploadIcon from "@material-ui/icons/CloudUpload";
import NewFolderIcon from "@material-ui/icons/CreateNewFolder";
import DeleteIcon from "@material-ui/icons/Delete";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import OpenFolderIcon from "@material-ui/icons/FolderOpen";
import MoveIcon from "@material-ui/icons/Input";
import LinkIcon from "@material-ui/icons/InsertLink";
import OpenIcon from "@material-ui/icons/OpenInNew";
import ShareIcon from "@material-ui/icons/Share";
import {
    FolderDownload,
    FolderUpload,
    MagnetOn,
    FilePlus,
} from "mdi-material-ui";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { isCompressFile, isPreviewable, isTorrent } from "../../config";
import Auth from "../../middleware/Auth";
import pathHelper from "../../utils/page";
import RefreshIcon from "@material-ui/icons/Refresh";
import {
    batchGetSource,
    openParentFolder,
    openPreview,
    openTorrentDownload,
    setSelectedTarget,
    startBatchDownload,
    startDirectoryDownload,
    startDownload,
    toggleObjectInfoSidebar,
} from "../../redux/explorer/action";
import {
    changeContextMenu,
    navigateTo,
    openCompressDialog,
    openCopyDialog,
    openCreateFileDialog,
    openCreateFolderDialog,
    openDecompressDialog,
    openLoadingDialog,
    openMoveDialog,
    openMusicDialog,
    openRemoteDownloadDialog,
    openRemoveDialog,
    openRenameDialog,
    openShareDialog,
    refreshFileList,
    setNavigatorLoadingStatus,
    showImgPreivew,
    toggleSnackbar,
} from "../../redux/explorer";
import { pathJoin } from "../Uploader/core/utils";
import {
    openFileSelector,
    openFolderSelector,
} from "../../redux/viewUpdate/action";
import { withTranslation } from "react-i18next";

const styles = () => ({
    propover: {},
    divider: {
        marginTop: 4,
        marginBottom: 4,
    },
});

const StyledListItemIcon = withStyles({
    root: {
        minWidth: 38,
    },
})(ListItemIcon);

const mapStateToProps = (state) => {
    return {
        menuType: state.viewUpdate.contextType,
        menuOpen: state.viewUpdate.contextOpen,
        isMultiple: state.explorer.selectProps.isMultiple,
        withFolder: state.explorer.selectProps.withFolder,
        withFile: state.explorer.selectProps.withFile,
        withSourceEnabled: state.explorer.selectProps.withSourceEnabled,
        path: state.navigator.path,
        selected: state.explorer.selected,
        search: state.explorer.search,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        changeContextMenu: (type, open) => {
            dispatch(changeContextMenu(type, open));
        },
        setNavigatorLoadingStatus: (status) => {
            dispatch(setNavigatorLoadingStatus(status));
        },
        setSelectedTarget: (targets) => {
            dispatch(setSelectedTarget(targets));
        },
        navigateTo: (path) => {
            dispatch(navigateTo(path));
        },
        openCreateFolderDialog: () => {
            dispatch(openCreateFolderDialog());
        },
        openCreateFileDialog: () => {
            dispatch(openCreateFileDialog());
        },
        openRenameDialog: () => {
            dispatch(openRenameDialog());
        },
        openMoveDialog: () => {
            dispatch(openMoveDialog());
        },
        openRemoveDialog: () => {
            dispatch(openRemoveDialog());
        },
        openShareDialog: () => {
            dispatch(openShareDialog());
        },
        showImgPreivew: (first) => {
            dispatch(showImgPreivew(first));
        },
        openMusicDialog: () => {
            dispatch(openMusicDialog());
        },
        toggleSnackbar: (vertical, horizontal, msg, color) => {
            dispatch(toggleSnackbar(vertical, horizontal, msg, color));
        },
        openRemoteDownloadDialog: () => {
            dispatch(openRemoteDownloadDialog());
        },
        openTorrentDownloadDialog: () => {
            dispatch(openTorrentDownload());
        },
        openCopyDialog: () => {
            dispatch(openCopyDialog());
        },
        openLoadingDialog: (text) => {
            dispatch(openLoadingDialog(text));
        },
        openDecompressDialog: () => {
            dispatch(openDecompressDialog());
        },
        openCompressDialog: () => {
            dispatch(openCompressDialog());
        },
        refreshFileList: () => {
            dispatch(refreshFileList());
        },
        openPreview: (share) => {
            dispatch(openPreview(share));
        },
        toggleObjectInfoSidebar: (open) => {
            dispatch(toggleObjectInfoSidebar(open));
        },
        startBatchDownload: (share) => {
            dispatch(startBatchDownload(share));
        },
        openFileSelector: () => {
            dispatch(openFileSelector());
        },
        openFolderSelector: () => {
            dispatch(openFolderSelector());
        },
        startDownload: (share, file) => {
            dispatch(startDownload(share, file));
        },
        batchGetSource: () => {
            dispatch(batchGetSource());
        },
        startDirectoryDownload: (share) => {
            dispatch(startDirectoryDownload(share));
        },
        openParentFolder: () => {
            dispatch(openParentFolder());
        },
    };
};

class ContextMenuCompoment extends Component {
    X = 0;
    Y = 0;

    state = {};

    componentDidMount = () => {
        window.document.addEventListener("mousemove", this.setPoint);
    };

    setPoint = (e) => {
        this.Y = e.clientY;
        this.X = e.clientX;
    };

    openArchiveDownload = () => {
        this.props.startBatchDownload(this.props.share);
    };

    openDirectoryDownload = () => {
        this.props.startDirectoryDownload(this.props.share);
    };

    openDownload = () => {
        this.props.startDownload(this.props.share, this.props.selected[0]);
    };

    enterFolder = () => {
        this.props.navigateTo(
            pathJoin([this.props.path, this.props.selected[0].name])
        );
    };

    // 暂时只对空白处右键菜单使用这个函数，疑似有bug会导致的一个菜单被默认选中。
    // 相关issue： https://github.com/mui-org/material-ui/issues/23747
    renderMenuItems = (items) => {
        const res = [];
        let key = 0;

        ["top", "center", "bottom"].forEach((position) => {
            let visibleCount = 0;
            items[position].forEach((item) => {
                if (item.condition) {
                    res.push(
                        <MenuItem dense key={key} onClick={item.onClick}>
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <Typography variant="inherit">
                                {item.text}
                            </Typography>
                        </MenuItem>
                    );
                    key++;
                    visibleCount++;
                }
            });
            if (visibleCount > 0 && position != "bottom") {
                res.push(
                    <Divider key={key} className={this.props.classes.divider} />
                );
                key++;
            }
        });

        return res;
    };

    render() {
        const { classes, t } = this.props;
        const user = Auth.GetUser();
        const isHomePage = pathHelper.isHomePage(this.props.location.pathname);
        const emptyMenuList = {
            top: [
                {
                    condition: true,
                    onClick: () => {
                        this.props.refreshFileList();
                        this.props.changeContextMenu(
                            this.props.menuType,
                            false
                        );
                    },
                    icon: <RefreshIcon />,
                    text: "刷新",
                },
            ],
            center: [
                {
                    condition: true,
                    onClick: () => this.props.openFileSelector(),
                    icon: <UploadIcon />,
                    text: "上传文件",
                },
                {
                    condition: true,
                    onClick: () => this.props.openFolderSelector(),
                    icon: <FolderUpload />,
                    text: "上传目录",
                },
                {
                    condition: user.group.allowRemoteDownload,
                    onClick: () => this.props.openRemoteDownloadDialog(),
                    icon: <DownloadIcon />,
                    text: "离线下载",
                },
            ],
            bottom: [
                {
                    condition: true,
                    onClick: () => this.props.openCreateFolderDialog(),
                    icon: <NewFolderIcon />,
                    text: "创建文件夹",
                },
                {
                    condition: true,
                    onClick: () => this.props.openCreateFileDialog(),
                    icon: <FilePlus />,
                    text: "创建文件",
                },
            ],
        };

        return (
            <div>
                <Menu
                    keepMounted
                    open={this.props.menuOpen}
                    onClose={() =>
                        this.props.changeContextMenu(this.props.menuType, false)
                    }
                    anchorReference="anchorPosition"
                    anchorPosition={{ top: this.Y, left: this.X }}
                    anchorOrigin={{
                        vertical: "top",
                        horizontal: "left",
                    }}
                    transformOrigin={{
                        vertical: "top",
                        horizontal: "left",
                    }}
                >
                    {this.props.menuType === "empty" && (
                        <div>
                            <MenuItem
                                dense
                                onClick={() => {
                                    this.props.refreshFileList();
                                    this.props.changeContextMenu(
                                        this.props.menuType,
                                        false
                                    );
                                }}
                            >
                                <StyledListItemIcon>
                                    <RefreshIcon />
                                </StyledListItemIcon>
                                <Typography variant="inherit">
                                    {t("fileManager.refresh")}
                                </Typography>
                            </MenuItem>
                            <Divider className={classes.divider} />
                            <MenuItem
                                dense
                                onClick={() => this.props.openFileSelector()}
                            >
                                <StyledListItemIcon>
                                    <UploadIcon />
                                </StyledListItemIcon>
                                <Typography variant="inherit">
                                    {t("fileManager.uploadFiles")}
                                </Typography>
                            </MenuItem>
                            <MenuItem
                                dense
                                onClick={() => this.props.openFolderSelector()}
                            >
                                <StyledListItemIcon>
                                    <FolderUpload />
                                </StyledListItemIcon>
                                <Typography variant="inherit">
                                    {t("fileManager.uploadFolder")}
                                </Typography>
                            </MenuItem>
                            {user.group.allowRemoteDownload && (
                                <MenuItem
                                    dense
                                    onClick={() =>
                                        this.props.openRemoteDownloadDialog()
                                    }
                                >
                                    <StyledListItemIcon>
                                        <DownloadIcon />
                                    </StyledListItemIcon>
                                    <Typography variant="inherit">
                                        {t("fileManager.newRemoteDownloads")}
                                    </Typography>
                                </MenuItem>
                            )}

                            <Divider className={classes.divider} />
                            <MenuItem
                                dense
                                onClick={() =>
                                    this.props.openCreateFolderDialog()
                                }
                            >
                                <StyledListItemIcon>
                                    <NewFolderIcon />
                                </StyledListItemIcon>
                                <Typography variant="inherit">
                                    {t("fileManager.newFolder")}
                                </Typography>
                            </MenuItem>
                            <MenuItem
                                dense
                                onClick={() =>
                                    this.props.openCreateFileDialog()
                                }
                            >
                                <StyledListItemIcon>
                                    <FilePlus />
                                </StyledListItemIcon>
                                <Typography variant="inherit">
                                    {t("fileManager.newFile")}
                                </Typography>
                            </MenuItem>
                        </div>
                    )}
                    {this.props.menuType !== "empty" && (
                        <div>
                            {!this.props.isMultiple && this.props.withFolder && (
                                <div>
                                    <MenuItem dense onClick={this.enterFolder}>
                                        <StyledListItemIcon>
                                            <OpenFolderIcon />
                                        </StyledListItemIcon>
                                        <Typography variant="inherit">
                                            {t("fileManager.enter")}
                                        </Typography>
                                    </MenuItem>
                                    {isHomePage && (
                                        <Divider className={classes.divider} />
                                    )}
                                </div>
                            )}
                            {!this.props.isMultiple &&
                                this.props.withFile &&
                                (!this.props.share ||
                                    this.props.share.preview) &&
                                isPreviewable(this.props.selected[0].name) && (
                                    <div>
                                        <MenuItem
                                            dense
                                            onClick={() =>
                                                this.props.openPreview()
                                            }
                                        >
                                            <StyledListItemIcon>
                                                <OpenIcon />
                                            </StyledListItemIcon>
                                            <Typography variant="inherit">
                                                {t("fileManager.open")}
                                            </Typography>
                                        </MenuItem>
                                    </div>
                                )}

                            {this.props.search && !this.props.isMultiple && (
                                <div>
                                    <MenuItem
                                        dense
                                        onClick={() =>{

                                            if(this.props.search.keywords == "magnet/internal"){
                                            alert('此格式不支持网页请求，请下载APP再试！')
                                            } else {
                                            this.props.openParentFolder()
                                            }
                                          }
                                        }

                                    >
                                        <StyledListItemIcon>
                                            <OpenFolderIcon />
                                        </StyledListItemIcon>
                                        <Typography variant="inherit">
                                            {t("fileManager.openParentFolder")}
                                        </Typography>
                                    </MenuItem>
                                </div>
                            )}

                            {!this.props.isMultiple && this.props.withFile && (
                                <div>
                                    <MenuItem
                                        dense
                                        onClick={() =>{
                                        if(this.props.search.keywords != "magnet/internal")
                                        {
                                        this.openDownload(this.props.share)
                                        }
                                        else{
                                            alert('此文件格式仅支持使用 APP 下载，请下载安装后再试！');
                                        }
                                        }


                                        }
                                    >
                                        <StyledListItemIcon>
                                            <DownloadIcon />
                                        </StyledListItemIcon>
                                        <Typography variant="inherit">
                                            {t("fileManager.download")}
                                        </Typography>
                                    </MenuItem>
                                    {isHomePage && (
                                        <Divider className={classes.divider} />
                                    )}
                                </div>
                            )}

                            {(this.props.isMultiple || this.props.withFolder) &&
                                window.showDirectoryPicker &&
                                window.isSecureContext && (
                                    <MenuItem
                                        dense
                                        onClick={() =>
                                            this.openDirectoryDownload()
                                        }
                                    >
                                        <StyledListItemIcon>
                                            <FolderDownload />
                                        </StyledListItemIcon>
                                        <Typography variant="inherit">
                                            {t("fileManager.download")}
                                        </Typography>
                                    </MenuItem>
                                )}

                            {(this.props.isMultiple ||
                                this.props.withFolder) && (
                                <MenuItem
                                    dense
                                    onClick={() => this.openArchiveDownload()}
                                >
                                    <StyledListItemIcon>
                                        <DownloadIcon />
                                    </StyledListItemIcon>
                                    <Typography variant="inherit">
                                        {t("fileManager.batchDownload")}
                                    </Typography>
                                </MenuItem>
                            )}

                            {isHomePage &&
                                user.group.sourceBatch > 0 &&
                                this.props.withSourceEnabled && (
                                    <MenuItem
                                        dense
                                        onClick={() =>
                                            this.props.batchGetSource()
                                        }
                                    >
                                        <StyledListItemIcon>
                                            <LinkIcon />
                                        </StyledListItemIcon>
                                        <Typography variant="inherit">
                                            {this.props.isMultiple ||
                                            (this.props.withFolder &&
                                                !this.props.withFile)
                                                ? t(
                                                      "fileManager.getSourceLinkInBatch"
                                                  )
                                                : t(
                                                      "fileManager.getSourceLink"
                                                  )}
                                        </Typography>
                                    </MenuItem>
                                )}

                            {!this.props.isMultiple &&
                                isHomePage &&
                                user.group.allowRemoteDownload &&
                                this.props.withFile &&
                                isTorrent(this.props.selected[0].name) && (
                                    <MenuItem
                                        dense
                                        onClick={() =>
                                            this.props.openTorrentDownloadDialog()
                                        }
                                    >
                                        <StyledListItemIcon>
                                            <MagnetOn />
                                        </StyledListItemIcon>
                                        <Typography variant="inherit">
                                            {t(
                                                "fileManager.createRemoteDownloadForTorrent"
                                            )}
                                        </Typography>
                                    </MenuItem>
                                )}
                            {!this.props.isMultiple &&
                                isHomePage &&
                                user.group.compress &&
                                this.props.withFile &&
                                isCompressFile(this.props.selected[0].name) && (
                                    <MenuItem
                                        dense
                                        onClick={() =>
                                            this.props.openDecompressDialog()
                                        }
                                    >
                                        <StyledListItemIcon>
                                            <Unarchive />
                                        </StyledListItemIcon>
                                        <Typography variant="inherit">
                                            {t("fileManager.decompress")}
                                        </Typography>
                                    </MenuItem>
                                )}

                            {isHomePage && user.group.compress && (
                                <MenuItem
                                    dense
                                    onClick={() =>
                                        this.props.openCompressDialog()
                                    }
                                >
                                    <StyledListItemIcon>
                                        <Archive />
                                    </StyledListItemIcon>
                                    <Typography variant="inherit">
                                        {t("fileManager.compress")}
                                    </Typography>
                                </MenuItem>
                            )}

                            {!this.props.isMultiple && isHomePage && (
                                <MenuItem
                                    dense
                                    onClick={() => this.props.openShareDialog()}
                                >
                                    <StyledListItemIcon>
                                        <ShareIcon />
                                    </StyledListItemIcon>
                                    <Typography variant="inherit">
                                        {t("fileManager.createShareLink")}
                                    </Typography>
                                </MenuItem>
                            )}

                            {!this.props.isMultiple && isHomePage && (
                                <MenuItem
                                    dense
                                    onClick={() =>
                                        this.props.toggleObjectInfoSidebar(true)
                                    }
                                >
                                    <StyledListItemIcon>
                                        <InfoOutlined />
                                    </StyledListItemIcon>
                                    <Typography variant="inherit">
                                        {t("fileManager.viewDetails")}
                                    </Typography>
                                </MenuItem>
                            )}

                            {!this.props.isMultiple && isHomePage && (
                                <Divider className={classes.divider} />
                            )}

                            {!this.props.isMultiple && isHomePage && (
                                <div>
                                    <MenuItem
                                        dense
                                        onClick={() =>
                                            this.props.openRenameDialog()
                                        }
                                    >
                                        <StyledListItemIcon>
                                            <RenameIcon />
                                        </StyledListItemIcon>
                                        <Typography variant="inherit">
                                            {t("fileManager.rename")}
                                        </Typography>
                                    </MenuItem>
                                    {!this.props.search && (
                                        <MenuItem
                                            dense
                                            onClick={() =>
                                                this.props.openCopyDialog()
                                            }
                                        >
                                            <StyledListItemIcon>
                                                <FileCopyIcon />
                                            </StyledListItemIcon>
                                            <Typography variant="inherit">
                                                {t("fileManager.copy")}
                                            </Typography>
                                        </MenuItem>
                                    )}
                                </div>
                            )}
                            {isHomePage && (
                                <div>
                                    {!this.props.search && (
                                        <MenuItem
                                            dense
                                            onClick={() =>
                                                this.props.openMoveDialog()
                                            }
                                        >
                                            <StyledListItemIcon>
                                                <MoveIcon />
                                            </StyledListItemIcon>
                                            <Typography variant="inherit">
                                                {t("fileManager.move")}
                                            </Typography>
                                        </MenuItem>
                                    )}

                                    <Divider className={classes.divider} />
                                    <MenuItem
                                        dense
                                        className={classes.propover}
                                        onClick={() =>
                                            this.props.openRemoveDialog()
                                        }
                                    >
                                        <StyledListItemIcon>
                                            <DeleteIcon />
                                        </StyledListItemIcon>
                                        <Typography variant="inherit">
                                            {t("fileManager.delete")}
                                        </Typography>
                                    </MenuItem>
                                </div>
                            )}
                        </div>
                    )}
                </Menu>
            </div>
        );
    }
}

ContextMenuCompoment.propTypes = {
    classes: PropTypes.object.isRequired,
    menuType: PropTypes.string.isRequired,
};

const ContextMenu = connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(withRouter(withTranslation()(ContextMenuCompoment))));

export default ContextMenu;
