import { Box, Toolbar } from "@mui/material";
import LoginCard from "./LoginCard";
import { Navigate, redirect, useActionData } from "react-router-dom";
import Cookies from "js-cookie";
import PublicNavbar from "../../components/navbar/PublicNavbar";
import axios from "axios";
import { useEffect } from "react";
import { useSnackbar } from "notistack";

const authenticate = async (credentials) => {
    const response = await axios.post("http://localhost:8000/api/token/", {
        username: credentials.username,
        password: credentials.password
    });

    return response;
}

const authenticateVideoSDK = async (access) => {
    const response = await axios.post("http://localhost:8008/api/video/authenticate/", null, {
        headers: {
            Authorization: `Bearer ${access}`
        }
    });

    return response;
}

export async function loginAction({ request }) {
    const formData = await request.formData();
    const username = formData.get("username");
    const password = formData.get("password");
    console.log("Login Action");
    console.log(username);
    console.log(password);
    const errors = {};

    if (password === "") {
        errors.password = "Password can't be blank.";
    }

    if (username === "") {
        errors.username = "Username can't be blank.";
    }

    if (Object.keys(errors).length) {
        return errors;
    }
    try {
        const authResponse = await authenticate({ username: username, password: password });
        Cookies.set("access", authResponse.data.access);
        Cookies.set("refresh", authResponse.data.refresh);
        console.log(authResponse.data.access)
        const authVideoResponse = await authenticateVideoSDK(authResponse.data.access);
        Cookies.set("video", authVideoResponse.data.token);
        return redirect("/");
    } catch(error) {
        console.log(error.response.data);
        return error.response.data;
    }
}

function LoginPage() {
    const access = Cookies.get("access");
    const errors = useActionData();
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        if (typeof errors === 'object') {
            Object.keys(errors).forEach((key) => {
                enqueueSnackbar(errors[key], { variant: 'error' });
            });
        }
    }, [errors]);

    return (
        access ? 
            <Navigate to="/" />
        :
            <Box>
                <PublicNavbar />
                <Box component="main">
                    <Toolbar />
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "calc(100vh - 64px)"
                        }}
                    >
                        <LoginCard errors={errors} />
                    </Box>
                </Box>
            </Box>
    );
}

export default LoginPage;