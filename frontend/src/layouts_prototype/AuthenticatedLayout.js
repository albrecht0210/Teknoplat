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

const fetchCourses = async () => {
    const access = Cookies.get("access");

    const response = await axios.get("http://localhost:8080/api/account/profile/courses/", {
        headers: {
            Authorization: `Bearer ${access}`
        }
    });

    return response;
}

export async function authLoader() {
    try {
        const profileResponse = await fetchProfile();
        const coursesResponse = await fetchCourses();
        
        return {
            profile: profileResponse.data,
            courses: coursesResponse.data
        };
    } catch (error) {
        if (error.response && error.response.status === 401) {
            try {
                await refreshAccessToken();
                const profileResponse = await fetchProfile();
                const coursesResponse = await fetchCourses();

                return {
                    profile: profileResponse.data,
                    courses: coursesResponse.data
                };
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

    return (
        access ? <Outlet context={{ profile: data.profile, courses: data.courses }} /> : <Navigate to="/login" />
    );
}

export default AuthenticatedLayout;