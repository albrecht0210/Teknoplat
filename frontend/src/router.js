import { useSelector } from "react-redux";
import NotAuthenticatedLayout from "./layouts/NotAuthenticatedLayout";
import AuthenticatedLayout from "./layouts/AuthenticatedLayout";
import DrawerLayout from "./layouts/DrawerLayout";
import CourseLayout from "./layouts/CourseLayout";

import LoginPage from "./features/login/LoginPage";
import DashboardPage from "./features/dashboard/DashboardPage";
import CoursePage from "./features/course/CoursePage";
import ErrorPage from "./features/error/ErrorPage";

import { RouterProvider, createBrowserRouter } from "react-router-dom";
import MeetingLayout from "./layouts/MeetingLayout";
import MeetingPage from "./features/meeting/MeetingPage";

function UrlPaths() {
    const { access } = useSelector((state) => state.auth);

    const routesForAuthenticatedOnly = [
        {
            path: "/",
            element: <AuthenticatedLayout />,
            errorElement: <ErrorPage />,
            children: [
                {
                    path: "/",
                    element: <DrawerLayout />,
                    children: [
                        {
                            path: "",
                            element: <DashboardPage />
                        },
                        {
                            path: "courses/",
                            element: <CourseLayout />,
                            children: [
                                {
                                    path: ":course/",
                                    element: <CoursePage />,
                                    children: [
                                        {
                                            path: "meetings/",
                                            element: <MeetingLayout />,
                                            children: [
                                                {
                                                    path: ":meeting/",
                                                    element: <MeetingPage />
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    path: "video_meet/",
                    element: <VideoLayout />,
                    children: [
                        {
                            path: "",
                            element: <VideoPage />
                        }
                    ]
                }
            ]
        }
    ];

    const routesForNotAuthenticatedOnly = [
        {
            path: "/",
            element: <NotAuthenticatedLayout />,
            errorElement: <ErrorPage />,
            children: [
                {
                    path: "",
                    element: <LoginPage />
                }
            ]
        }
    ];

    const router = createBrowserRouter([
        ...(!access ? routesForNotAuthenticatedOnly : []),
        ...routesForAuthenticatedOnly
    ]);

    return <RouterProvider router={router} />;
}

export default UrlPaths;