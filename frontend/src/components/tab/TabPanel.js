import { Box } from "@mui/material";

function TabPanel(props) {
    const { selected, name, value, children } = props;
    
    return (
        <div 
            role="tabpanel" 
            hidden={selected !== value} 
            id={`${name}-tabpanel`}
            aria-labelledby={`${name}-tab`}
            style={{ height: "72.2%" }}
        >
            <Box sx={{ p: 3, height: "100%" }}>
                { children }
            </Box>
        </div>
    );
}

export default TabPanel;