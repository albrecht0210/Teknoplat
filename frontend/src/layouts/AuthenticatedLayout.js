import { Outlet, useNavigate } from "react-router-dom";
import { useGetProfileQuery, useReauthenticateMutation } from "../features/api/apiSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { deStoreAuthCredentials, storeAccessToken } from "../features/data/authSlice";
import { storeProfile } from "../features/data/accountSlice";

function AuthenticatedLayout() {
    const { data: profile, isSuccess, isError, refetch } = useGetProfileQuery();
    const [reauthenticate] = useReauthenticateMutation();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const reauthCallback = async () => {
            const data = { credentials: { refresh: Cookies.get("refresh") } }
            await reauthenticate(data).unwrap()
                .then((payload) => {
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

        if (isError) {
            reauthCallback();
        }
    }, [dispatch, refetch, navigate, reauthenticate, isError]);

    useEffect(() => {
        if (isSuccess) {
            dispatch(storeProfile({ profile: profile }));
        }
    }, [dispatch, profile, isSuccess]);

    return (
        <Outlet />
    );
}

export default AuthenticatedLayout;
