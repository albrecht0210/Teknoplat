import { Divider, Stack, Tab, Tabs } from "@mui/material";

function TabContainer(props) {
    const { selected, handleChange, tabOptions, inputField } = props;

    return (
        <>
            <Stack direction="row">
                <Tabs value={selected} onChange={handleChange}>
                    { tabOptions.map((option, index) => (
                        <Tab 
                            key={option.value} 
                            label={option.name[0].toUpperCase() + option.name.slice(1)}
                            id={option.name + '-tab'} 
                            aria-controls={option.name + "-tabpanel"} 
                        />
                    )) }
                </Tabs>
                { inputField }
            </Stack>
            <Divider />
        </>
    );
}

TabContainer.defaultProps = {
    inputField: null,
}

export default TabContainer;