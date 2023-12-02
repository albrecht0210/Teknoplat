import { Form } from "react-router-dom";
import { useState } from "react";
import { Card, CardContent, Stack, Typography } from "@mui/material";
import LoginInput from "./LoginInput";
import LoginButton from "./LoginButton";

function LoginCard(props) {

    // const dispatch = useDispatch();
    // const navigate = useNavigate();

    // const [authenticate, { isLoading }] = useAuthenticateMutation();
    // const [authenticateVideoMeeting] = useAuthenticateVideoMeetingMutation();

    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormData((previousFormData) => ({
            ...previousFormData,
            [name]: value
        }));
    }

    const handleLoginClick = () => {
        setLoading(true);
    }
    // const canSave = [formData.username, formData.password].every(Boolean) && !isLoading;

    // const handleOnFormSubmit = async (e) => {
    //     e.preventDefault();

    //     if (!canSave) {
    //         return;
    //     }

    //     try {
    //         const data = { credentials: { username: formData.username, password: formData.password } };
    //         const authPayload = await authenticate(data).unwrap();

    //         Cookies.set("access", authPayload.access);
    //         Cookies.set("refresh", authPayload.refresh);

    //         dispatch(storeAuthCredentials(authPayload));

    //         const videoPayload = await authenticateVideoMeeting().unwrap();
            
    //         Cookies.set("video", videoPayload.token);
    //         dispatch(storeVideoToken({ video: videoPayload.token }));

    //         navigate("/", { replace: true });
    //     } catch(error) {
    //         const errorMessage = "detail" in error.data ? error.data.detail : "";
    //         enqueueSnackbar(errorMessage, { variant: 'error' });
    
    //         setFormData((previousFormData) => ({
    //             ...previousFormData,
    //             password: ""
    //         }));
    //     }
    // }

    return (
        <Card
            raised={true}
            sx={{ 
                borderRadius: "8px", 
                width: { xs: "calc(100% * .75)", sm: "calc(100% * .45)", md: "calc(100% * .35)" } 
            }}
        >
            <CardContent sx={{ p: 3 }}>
                <Form method="post">
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
                            disabled={loading}
                        />
                        <LoginInput
                            name="password"
                            type="password"
                            value={formData.password}
                            handleChange={handleInputChange}
                            disabled={loading}
                        />
                        <LoginButton disabled={loading} handleClick={handleLoginClick} />
                    </Stack>
                </Form>
            </CardContent>
        </Card>
    );
}

export default LoginCard;