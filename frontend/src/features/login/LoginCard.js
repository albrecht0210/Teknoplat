import { useSnackbar } from "notistack";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAuthenticateMutation } from "../api/apiSlice";
import { useState } from "react";
import { Card, CardContent, Stack, Typography } from "@mui/material";
import LoginInput from "./LoginInput";
import LoginButton from "./LoginButton";
import Cookies from "js-cookie";
import { storeAuthCredentials } from "../data/authSlice";

function LoginCard() {
    const { enqueueSnackbar } = useSnackbar();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [authenticate, { isLoading }] = useAuthenticateMutation();

    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormData((previousFormData) => ({
            ...previousFormData,
            [name]: value
        }));
    }

    const canSave = [formData.username, formData.password].every(Boolean) && !isLoading;

    const handleOnFormSubmit = async (e) => {
        e.preventDefault();

        if (canSave) {
            const data = { credentials: { username: formData.username, password: formData.password } };
            await authenticate(data).unwrap()
                .then((payload) => {
                    Cookies.set("access", payload.access);
                    Cookies.set("refresh", payload.refresh);

                    dispatch(storeAuthCredentials(payload));
                    navigate("/");
                })
                .catch((error) => {
                    console.log(error)
                    // enqueueSnackbar(error.data?.detail, { variant: 'error' })
                    setFormData((previousFormData) => ({
                        ...previousFormData,
                        password: ""
                    }));
                });
        }
    }

    return (
        <Card
            raised={true}
            sx={{ 
                borderRadius: "8px", 
                width: { xs: "calc(100% * .75)", sm: "calc(100% * .45)", md: "calc(100% * .35)" } 
            }}
        >
            <CardContent sx={{ p: 3 }}>
                <form onSubmit={handleOnFormSubmit}>
                    <Stack spacing={3}>
                        <Typography
                            variant="h6"
                            textAlign="center"
                        >
                            Login
                        </Typography>
                        <LoginInput
                            name="username"
                            value={formData.username}
                            handleChange={handleInputChange}
                            disabled={isLoading}
                        />
                        <LoginInput
                            name="password"
                            type="password"
                            value={formData.password}
                            handleChange={handleInputChange}
                            disabled={isLoading}
                        />
                        <LoginButton disabled={isLoading} />
                    </Stack>
                </form>
            </CardContent>
        </Card>
    );
}

export default LoginCard;