import { Logout } from "@mui/icons-material";
import { Box, Button, IconButton, Stack, Toolbar, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { deStoreAuthCredentials } from "../../features/data/authSlice";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

let AccountButton = ({ profile }) => {
    return (
        <Button variant="text" sx={{ width: "175px" }}>
            <img 
                // src={ profile.avatar !== null ? profile.avatar : "/sample/default_avatar.png" }
                src="/sample/default_avatar.png"
                alt="AccountProfile"
                style={{ width: "30px", height: "30px", marginRight: "5px", borderRadius: "5px" }}
            />
            <Stack spacing={0}>
                <Typography
                    variant="caption"
                    noWrap={true}
                    sx={{ width: "calc(240px * .52)" }}
                    textAlign="left"
                >
                    { profile.full_name }
                </Typography>
                <Typography
                    variant="caption"
                    textAlign="left"
                    fontSize={10}
                >
                    { profile.username }
                </Typography>
            </Stack>
        </Button>
    );
}

let AccountLoadingButton = () => {
    return (
        <Button variant="text" sx={{ width: "175px", justifyContent: "flex-start" }}>
            <Box
                style={{ width: "30px", height: "30px", marginRight: "5px", borderRadius: "5px" }}
                className="loadingSlide"
            />
            <Stack spacing={0}>
                <Typography
                    variant="caption"
                    textAlign="left"
                    sx={{ width: "calc(240px * .52)" }}
                    className="loadingSlide"
                >
                    <span style={{ visibility: "hidden" }}>Loading...</span>
                </Typography>
                <Typography
                    variant="caption"
                    textAlign="left"
                    fontSize={10}
                    sx={{ width: "calc((240px * .52) / 2)" }}
                    className="loadingSlide"
                >
                    <span style={{ visibility: "hidden" }}>Loading...</span>
                </Typography>
            </Stack>
        </Button>
    );
}

function AccountOption(props) {
    const { profile } = useSelector((state) => state.account);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    let content;

    if (profile === null) {
    // if (true) {
        content = <AccountLoadingButton />;
    } else {
        content = <AccountButton profile={profile} />;
    }

    const handleLogoutClick = () => {
        Cookies.remove("refresh");
        Cookies.remove("access");
        dispatch(deStoreAuthCredentials());
        navigate("/");
    }

    return (
        <Toolbar sx={{ p: "0px 12px !important" }}>
            <Stack
                direction="row"
                spacing={0}
                alignItems="center"
            >
                { content }
                <IconButton onClick={handleLogoutClick} aria-label="LogoutUser">
                    <Logout />
                </IconButton>
            </Stack>
        </Toolbar>
    );
}

export default AccountOption;