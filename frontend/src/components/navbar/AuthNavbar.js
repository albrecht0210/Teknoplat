import { AppBar, IconButton, Toolbar } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import HistoryNavigator from "../../features/history/HistoryNavigator";

function AuthNavbar(props) {
    const { width, handleClick } = props;

    return (
        <AppBar 
            position="fixed"
            sx={{
                width: { sm: `calc(100% - ${width}px)` },
                ml: { sm: `${width}px` },
            }}
        >
            <Toolbar sx={{ p: "0px 12px !important" }}>
                {handleClick !== undefined && (
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleClick}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                )}
                <HistoryNavigator />
            </Toolbar>
        </AppBar>
    );
}

AuthNavbar.defaultProps = {
    width: 240
}

export default AuthNavbar;