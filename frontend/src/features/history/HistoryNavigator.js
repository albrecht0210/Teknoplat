import { Breadcrumbs, Link, Typography } from "@mui/material";
import { useSelector } from "react-redux";

function HistoryNavigator() {
    const { history, current } = useSelector((state) => state.path);

    return (
        <Breadcrumbs aria-label="history-nav">
            { history.map((link, index) => (
                <Link
                    key={index}
                    underline="hover"
                    color="inherit"
                    href={link.to}
                >
                    {link.name}
                </Link>
            )) }
            <Typography color="text.primary">{ current?.name }</Typography>
        </Breadcrumbs>
    );
}

export default HistoryNavigator;