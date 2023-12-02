import { Button } from "@mui/material";

function LoginButton(props) {
    const { disabled, handleClick } = props;

    return (
        <Button
            variant="contained"
            type="submit"
            disabled={disabled}
            // onClick={handleClick}
        >
            { disabled ? "Logging In..." : "Login" }
        </Button>
    );
}

export default LoginButton;