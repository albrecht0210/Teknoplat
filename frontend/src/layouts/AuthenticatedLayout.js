import { Outlet, useNavigate } from "react-router-dom";
import { useAuthenticateVideoMeetingQuery, useGetProfileQuery, useReauthenticateMutation } from "../features/api/apiSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { deStoreAuthCredentials, storeAccessToken, storeVideoToken } from "../features/data/authSlice";
import { storeProfile } from "../features/data/accountSlice";

function AuthenticatedLayout() {
    // Retrieve Auth
    const { access } = useSelector((state) => state.auth);
    // Fetch Profile
    const { data: profile, isSuccess: fetchProfileSuccess, isError, refetch: refetchProfile } = useGetProfileQuery();
    const { data: token, isSuccess: fetchTokenSuccess, refetch: refetchToken } = useAuthenticateVideoMeetingQuery();
    // Reauthenticate using refresh
    const [reauthenticate] = useReauthenticateMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const reauthCallback = async () => {
            const data = { credentials: { refresh: Cookies.get("refresh") } }
            await reauthenticate(data).unwrap()
                .then((payload) => {
                    Cookies.set("access", payload.access);
                    dispatch(storeAccessToken(payload));
                    refetchProfile();
                })
                .catch((error) => {
                    Cookies.remove("access");
                    Cookies.remove("refresh"); 
                    Cookies.remove("video"); 
                    dispatch(deStoreAuthCredentials());
                    navigate("/");
                });
        }

        // If Error in fetching profile, reauthenticate
        if (isError) {
            reauthCallback();
        }
    }, [dispatch, refetchProfile, navigate, reauthenticate, isError]);

    useEffect(() => {
        // If Succes in fetching profile, store to profile
        if (fetchProfileSuccess) {
            dispatch(storeProfile({ profile: profile }));
        }
    }, [dispatch, profile, fetchProfileSuccess]);

    useEffect(() => {
        // If success in fetching token, store to video
        if (fetchTokenSuccess) {
            dispatch(storeVideoToken({ video: token }));
        }
    }, [dispatch, token, fetchTokenSuccess]);

    useEffect(() => {
        refetchProfile();
        refetchToken();
    }, [refetchProfile, refetchToken, access]);

    return (
        <Outlet />
    );
}

export default AuthenticatedLayout;
