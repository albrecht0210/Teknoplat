import axios from 'axios';
import Cookies from 'js-cookie';
import { Navigate, Outlet, redirect, useLoaderData } from "react-router-dom";
import { refreshAccessToken } from '../services/services';

const fetchProfile = async () => {
    const access = Cookies.get("access");

    const response = await axios.get("http://localhost:8000/api/account/profile/", {
        headers: {
            Authorization: `Bearer ${access}`
        }
    });

    return response;
}

export async function authLoader() {
    try {
        const profileResponse = await fetchProfile();
        
        return profileResponse.data;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            try {
                await refreshAccessToken();
                const profileResponse = await fetchProfile();

                return profileResponse.data;
            } catch (refreshError) {
                Cookies.remove("access");
                Cookies.remove("refresh");
                Cookies.remove("video");
                return redirect("/login");
            }
        } else {
            console.log(error.response.data);
        }
    }
}

function AuthenticatedLayout() {
    const data = useLoaderData();
    const access = Cookies.get("access");
    console.log("Test");
    console.log(access);
    return (
        access ? <Outlet context={{ profile: data }} /> : <Navigate to="/login" />
    );
}

export default AuthenticatedLayout;