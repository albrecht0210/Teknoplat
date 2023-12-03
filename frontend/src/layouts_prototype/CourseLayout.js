import { Box } from "@mui/material";
import { Outlet, redirect, useLoaderData, useLocation, useNavigate, useOutletContext } from "react-router-dom";
import TabContainer from "../components/tab/TabContainer";
import SearchInput from "../features/course/SearchInput";
import { useState } from "react";
import { refreshAccessToken } from "../services/services";
import Cookies from "js-cookie";
import axios from "axios";

const fetchCourse = async (code, section) => {
    const access = Cookies.get("access");

    const response = await axios.get(`http://localhost:8080/api/account/profile/course/?code=${code}&section=${section}`, {
        headers: {
            Authorization: `Bearer ${access}`
        }
    });

    return response;
}


export async function courseLoader({ request, params }) {
    const courseParams = params.courseCodeAndSection.split("_");
    const code = courseParams[0].toUpperCase();
    const section = courseParams[1].toUpperCase();

    try {
        const courseResponse = await fetchCourse(code, section);
        
        localStorage.setItem("course", courseResponse.data.id);
        return courseResponse.data;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            try {
                await refreshAccessToken();
                const courseResponse = await fetchCourse(code, section);
                
                localStorage.setItem("course", courseResponse.data.id);
                return courseResponse.data;
            } catch (refreshError) {
                Cookies.remove("access");
                Cookies.remove("refresh");
                Cookies.remove("video");
                return redirect("/login");
            }
        }
        return redirect("/");
    }
}

function CourseLayout() {
    const data = useLoaderData();
    const { profile } = useOutletContext();

    const navigate = useNavigate();
    const location = useLocation();
    const currentUrl = location.pathname;
    const urlPath = currentUrl.split("meetings/");
    const validUrl = ["", "pending", "in_progress", "completed"];

    const tabOptions = [
        { value: 0, name: "Pending", stringValue: "pending" },
        { value: 1, name: "In Progress", stringValue: "in_progress" },
        { value: 2, name: "Completed", stringValue: "completed" }
    ];
    const initTabValue = localStorage.getItem("statusTabValue") ? Number(localStorage.getItem("statusTabValue")) : 1;
    const [statusTabValue, setStatusTabValue] = useState(initTabValue);
    const [searchMeeting, setSearchMeeting] = useState(localStorage.getItem("searchMeeting") ?? "");

    const handleTabChange = (event, value) => {
        const option = tabOptions.find((option) => option.value === value);
        console.log(option.stringValue);
        localStorage.setItem("statusTabValue", value);
        setStatusTabValue(value);

        navigate(urlPath[0].concat("meetings/".concat(option.stringValue)));
    }

    const handleSearchInput = (event) => {
        localStorage.setItem("searchMeeting", event.target.value);
        setSearchMeeting(event.target.value);
    }

    return (
        validUrl.includes(urlPath[1]) ? (
                <Box p={3}>
                    <TabContainer 
                        tabOptions={tabOptions}
                        handleChange={handleTabChange}
                        selected={statusTabValue}
                        inputField={
                            <SearchInput value={searchMeeting} handleChange={handleSearchInput} />
                        }
                    />
                    <Outlet context={{ course: data }} />
                </Box>
            ) : (
                <Box p={3}>
                    <Outlet context={{ profile: profile, course: data }} />
                </Box>
            )
    );
}

export default CourseLayout;
