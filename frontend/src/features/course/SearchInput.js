import { TextField } from "@mui/material";

function SearchInput(props) {
    const { value, handleChange } = props;

    return (
        <TextField 
            id="searchMeeting"
            name="searchMeeting"
            type="text"
            value={value}
            label="Search Meetings"
            onChange={handleChange}
            autoComplete="off"
            variant="outlined"
            size="small"
        />
    );
}

export default SearchInput;