import { Outlet, useNavigate } from "react-router-dom";
import { useAuthenticateVideoMeetingMutation, useGetProfileQuery, useReauthenticateMutation } from "../features/api/apiSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { deStoreAuthCredentials, storeAccessToken, storeVideoToken } from "../features/data/authSlice";
import { storeProfile } from "../features/data/accountSlice";

function AuthenticatedLayout() {
    // Retrieve Auth
    const { access } = useSelector((state) => state.auth);
    // Fetch Profile
    const { data: profile, isSuccess, isError, refetch } = useGetProfileQuery();

    // Reauthenticate using refresh
    const [reauthenticate] = useReauthenticateMutation();
    
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const reauthCallback = async () => {
            const data = { credentials: { refresh: Cookies.get("refresh") } }
            try {
                const reAuthPayload = await reauthenticate(data).unwrap();
                Cookies.set("access", reAuthPayload.access);

                dispatch(storeAccessToken(reAuthPayload));

                refetch();
            } catch {
                Cookies.remove("access");
                Cookies.remove("refresh"); 
                Cookies.remove("video"); 

                dispatch(deStoreAuthCredentials());

                navigate("/");
                navigate(0);
            }
        }

        // If Error in fetching profile, reauthenticate
        if (isError) {
            reauthCallback();
        }
    }, [dispatch, refetch, navigate, reauthenticate, isError]);

    useEffect(() => {
        // If Succes in fetching profile, store to profile
        if (isSuccess) {
            dispatch(storeProfile({ profile: profile }));
        }
    }, [dispatch, profile, isSuccess]);

    return (
        <Outlet />
    );
}

export default AuthenticatedLayout;
