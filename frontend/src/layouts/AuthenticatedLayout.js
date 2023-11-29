import { Outlet, useNavigate } from "react-router-dom";
import { useGetProfileQuery, useReauthenticateMutation } from "../features/api/apiSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { deStoreAuthCredentials, storeAccessToken } from "../features/data/authSlice";
import { storeProfile } from "../features/data/accountSlice";

function AuthenticatedLayout() {
    // Fetch Profile
    const { data: profile, isSuccess, isError, refetch } = useGetProfileQuery();
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
                    refetch();
                })
                .catch((error) => {
                    Cookies.remove("access");
                    Cookies.remove("refresh");
                    dispatch(deStoreAuthCredentials());
                    navigate("/");
                });
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
