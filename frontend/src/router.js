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
import CourseLayout, { courseLoader } from "./layouts_prototype/CourseLayout";
import MeetingTable, { meetingsLoader } from "./features/course/MeetingTable";
import MeetingPage, { meetingAction, meetingLoader } from "./features/meeting/MeetingPage";
import PitchAccordionList, { pitchLoader } from "./features/meeting/PitchAccordionList";
import CriteriaAccordionList from "./features/meeting/CriteriaAccordionList";
import CommentCard from "./features/meeting/CommentCard";
import VideoPage, { videoLoader } from "./features/video/VideoPage";
import ParticipantPanel from "./features/video/ParticipantPanel";
// import MeetingLayout from "./layouts/MeetingLayout";
// import MeetingPage from "./features/meeting/MeetingPage";
// import VideoLayout from "./layouts/VideoLayout";
// import VideoPage from "./features/video/VideoPage";

function UrlPaths() {
    const routes = createRoutesFromElements(
        <Route path="/" element={<MainLayout />} errorElement={<ErrorPage />}>
            <Route path="/" element={<AuthenticatedLayout />} loader={authLoader}>
                <Route path="/" element={<DrawerLayout />}>
                    <Route index element={<DashboardPage />} />
                    <Route path="/" element={<DashboardPage />} />
                    <Route path="courses/:courseCodeAndSection/meetings/" element={<CourseLayout />} loader={courseLoader}>
                        <Route index element={<MeetingTable />} loader={meetingsLoader} />
                        <Route path="pending" element={<MeetingTable />} loader={meetingsLoader} />
                        <Route path="in_progress" element={<MeetingTable />} loader={meetingsLoader} />
                        <Route path="completed" element={<MeetingTable />} loader={meetingsLoader} />
                        <Route path=":meetingName" element={<MeetingPage />} loader={meetingLoader} action={meetingAction}>
                            <Route index element={<PitchAccordionList />} loader={pitchLoader} />
                            <Route path="pitch" element={<PitchAccordionList />} loader={pitchLoader} />
                            <Route path="criteria" element={<CriteriaAccordionList />} />
                            <Route path="comments" element={<CommentCard />} />
                        </Route>
                    </Route>
                </Route>
                <Route path="live/:meetingName/" element={<VideoPage />} loader={videoLoader} >
                    <Route path="participants" element={<ParticipantPanel />} />
                    {/* <Route path="rate" lazy={() => import("./features/video/RatePanel")} />
                    <Route path="paricipants" lazy={() => import("./features/video/ParticipantPanel")} />
                    <Route path="chat" lazy={() => import("./features/video/ChatPanel")} /> */}
                </Route>
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