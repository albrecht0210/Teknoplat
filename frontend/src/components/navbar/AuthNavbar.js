import { AppBar, Toolbar } from "@mui/material";
import HistoryNavigator from "../../features/history/HistoryNavigator";

function AuthNavbar(props) {
    const { width } = props;

    return (
        <AppBar 
            position="fixed"
            sx={{ width: `calc(100% - ${width}px)`, ml: `${width}px` }}
        >
            <Toolbar sx={{ p: "0px 12px !important" }}>
                <HistoryNavigator />
            </Toolbar>
        </AppBar>
    );
}

AuthNavbar.defaultProps = {
    width: 240
}

export default AuthNavbar;