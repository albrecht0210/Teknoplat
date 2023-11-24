import { Button } from "@mui/material";

function LoginButton(props) {
    const { disabled } = props;

    return (
        <Button
            variant="contained"
            type="submit"
            disabled={disabled}
        >
            { disabled ? "Logging In..." : "Login" }
        </Button>
    );
}

export default LoginButton;