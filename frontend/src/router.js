import { useSelector } from "react-redux";
// import NotAuthenticatedLayout from "./layouts/NotAuthenticatedLayout";
// import AuthenticatedLayout from "./layouts/AuthenticatedLayout";
// import MainLayout from "./layouts/MainLayout";
// import CourseLayout from "./layouts/CourseLayout";

// import LoginPage from "./features/login/LoginPage";
// import DashboardPage from "./features/dashboard/DashboardPage";
// import CoursePage from "./features/course/CoursePage";
import ErrorPage from "./features/error/ErrorPage";

import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import MainLayout from "./layouts_prototype/MainLayout";
import AuthenticatedLayout, { authLoader } from "./layouts_prototype/AuthenticatedLayout";
import DrawerLayout, { drawerLoader } from "./layouts_prototype/DrawerLayout";
import NotAuthenticatedLayout from "./layouts_prototype/NotAuthenticatedLayout";
import DashboardPage from "./features/dashboard/DashboardPage";
import LoginPage, { loginAction } from "./features/login/LoginPage";
// import MeetingLayout from "./layouts/MeetingLayout";
// import MeetingPage from "./features/meeting/MeetingPage";
// import VideoLayout from "./layouts/VideoLayout";
// import VideoPage from "./features/video/VideoPage";

function UrlPaths() {
    const routes = createRoutesFromElements(
        <Route path="/" element={<MainLayout />} errorElement={<ErrorPage />}>
            <Route path="/" element={<AuthenticatedLayout />} loader={authLoader}>
                <Route path="/" element={<DrawerLayout />} loader={drawerLoader}>
                    <Route index element={<DashboardPage />} />
                    {/* <Route index lazy={() => import("./features/dashboard/DashboardPage")} /> */}
                    {/* <Route path="/" lazy={() => import("./features/dashboard/DashboardPage")} /> */}
                    {/* <Route path="courses/:courseCodeAndSection/meetings/">
                        <Route index lazy={() => import("./features/course/CoursePage")} />
                        <Route path="pending" lazy={() => import("./features/course/MeetingTable")} />
                        <Route path="in_progress" lazy={() => import("./features/course/MeetingTable")} />
                        <Route path="completed" lazy={() => import("./features/course/MeetingTable")} />
                        <Route path=":meetingName" lazy={() => import("./features/meeting/MeetingPage")}>
                            <Route index lazy={() => import("./features/meeting/PitchList")} />
                            <Route path="pitch" lazy={() => import("./features/meeting/PitchList")} />
                            <Route path="criteria" lazy={() => import("./features/meeting/CriteriaList")} />
                            <Route path="comment" lazy={() => import("./features/meeting/CommentCard")} />
                        </Route>
                    </Route> */}
                </Route>
                {/* <Route path="live/:meetingName" lazy={() => import("./features/video/VideoPage")}>
                    <Route path="rate" lazy={() => import("./features/video/RatePanel")} />
                    <Route path="paricipants" lazy={() => import("./features/video/ParticipantPanel")} />
                    <Route path="chat" lazy={() => import("./features/video/ChatPanel")} />
                </Route> */}
            </Route>
            <Route path="login" element={<LoginPage />} action={loginAction} />
        </Route>
    )

    // const routesForAuthenticatedOnly = [
    //     {
    //         path: "/",
    //         element: <AuthenticatedLayout />,
    //         errorElement: <ErrorPage />,
    //         children: [
    //             {
    //                 path: "/",
    //                 element: <MainLayout />,
    //                 children: [
    //                     {
    //                         path: "",
    //                         element: <DashboardPage />
    //                     },
    //                     {
    //                         path: "courses/",
    //                         element: <CourseLayout />,
    //                         children: [
    //                             {
    //                                 path: ":course/meetings/",
    //                                 element: <CoursePage />,
    //                             }
    //                         ]
    //                     }
    //                     //             children: [
    //                     //                 {
    //                     //                     path: "meetings/",
    //                     //                     element: <MeetingLayout />,
    //                     //                     children: [
    //                     //                         {
    //                     //                             path: ":meeting/",
    //                     //                             element: <MeetingPage />
    //                     //                         }
    //                     //                     ]
    //                     //                 }
    //                     //             ]
    //                     //         }
    //                     //     ]
    //                     // }
    //                 ]
    //             },
    //             {
    //                 path: "video_meet/",
    //                 element: <VideoLayout />,
    //                 children: [
    //                     {
    //                         path: ":meeting",
    //                         element: <VideoPage />
    //                     }
    //                 ]
    //             }
    //         ]
    //     }
    // ];

    // const routesForNotAuthenticatedOnly = [
    //     {
    //         path: "/",
    //         element: <NotAuthenticatedLayout />,
    //         errorElement: <ErrorPage />,
    //         children: [
    //             {
    //                 path: "",
    //                 element: <LoginPage />
    //             }
    //         ]
    //     }
    // ];

    // const router = createBrowserRouter([
    //     ...(!access ? routesForNotAuthenticatedOnly : []),
    //     ...routesForAuthenticatedOnly
    // ]);
    
    const router = createBrowserRouter(routes);

    return <RouterProvider router={router} />;
}

export default UrlPaths;