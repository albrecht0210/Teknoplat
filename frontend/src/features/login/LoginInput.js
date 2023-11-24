import { TextField } from "@mui/material";

function LoginInput(props) {
    const { name, type, value, handleChange, disabled } = props;
    const label = name.charAt(0).toUpperCase() + name.slice(1);

    return (
        <TextField
            id={name}
            name={name}
            label={label}
            type={type}
            value={value}
            onChange={handleChange}
            disabled={disabled}
            autoComplete="off"
            variant="outlined"
        />
    );
}

LoginInput.defaultProps = {
    type: 'text'
};

export default LoginInput;