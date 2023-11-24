import { Logout } from "@mui/icons-material";
import { Button, IconButton, Stack, Toolbar, Typography } from "@mui/material";
import { useSelector } from "react-redux";

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
        <Button 
            variant="text" 
            sx={{
                position: 'relative',
                overflow: 'hidden',
                background: '#333',
                color: '#fff',
                width: "175px",
                "@keyframes loading": {
                    "0%": {
                        backgroundPosition: "-175px 0",
                    },
                    "100%": {
                        backgroundPosition: "175px 0"
                    }
                },
                '&:before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: `linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.08), transparent)`,
                  animation: 'loading 2s infinite linear',
                },
            }}
        >
            <span style={{ visibility: "hidden" }}>Loading</span>
        </Button>
    );
}

function AccountOption(props) {
    const { loading } = props;
    const { profile } = useSelector((state) => state.account);

    let content;

    if (loading || profile === null) {
        content = <AccountLoadingButton />;
    } else {
        console.log(profile)
        content = <AccountButton profile={profile} />;
    }

    return (
        <Toolbar sx={{ p: "0px 12px !important" }}>
            <Stack
                direction="row"
                spacing={0}
                alignItems="center"
            >
                { content }
                <IconButton aria-label="LogoutUser">
                    <Logout />
                </IconButton>
            </Stack>
        </Toolbar>
    );
}

export default AccountOption;