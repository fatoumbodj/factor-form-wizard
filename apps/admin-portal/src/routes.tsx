import { HistoryEduOutlined } from "@mui/icons-material";
import { GroupRouteParamsType, SingleRouteParamsType, RouteParams } from "./types/route.type";
import { LeasingUi } from '@leasing/ui'
import { DashboardPage } from "./pages/dashboard/Dashboard.page";
import { SharedUIPage } from "./pages/ui/SharedUI.page";

var routes: Array<RouteParams> = [
  {
    tag: SingleRouteParamsType,
    path: "/",
    name: "Dashboard",
    icon: <HistoryEduOutlined />,
    component: <DashboardPage />,
    layout: true,
    menu: true,
  },
  {
    tag: SingleRouteParamsType,
    path: "/leasing/propositions",
    name: "Proposition",
    icon: <HistoryEduOutlined />,
    component: <LeasingUi />,
    layout: true,
    menu: true,
  },
  {
    tag: SingleRouteParamsType,
    path: "/leasing/folder",
    name: "Dossiers",
    icon: <HistoryEduOutlined />,
    component: <LeasingUi />,
    layout: true,
    menu: true,
  },
  {
    tag: GroupRouteParamsType,
    groupName: "Paramétrage",
    items: [
      {
        tag: SingleRouteParamsType,
        path: "/leasing/config/leasing-type",
        name: "Type de leasing",
        icon: <HistoryEduOutlined />,
        component: <LeasingUi />,
        layout: true,
        menu: true,
      },
      {
        tag: SingleRouteParamsType,
        path: "/leasing/config/scale",
        name: "Barème",
        icon: <HistoryEduOutlined />,
        component: <LeasingUi />,
        layout: true,
        menu: true,
      },
      {
        tag: SingleRouteParamsType,
        path: "/leasing/config/convention",
        name: "Convention",
        icon: <HistoryEduOutlined />,
        component: <LeasingUi />,
        layout: true,
        menu: true,
      },
      {
        tag: SingleRouteParamsType,
        path: "/leasing/config/campaign",
        name: "Campagne",
        icon: <HistoryEduOutlined />,
        component: <LeasingUi />,
        layout: true,
        menu: true,
      },
      {
        tag: SingleRouteParamsType,
        path: "/leasing/config/equipment",
        name: "Matériel",
        icon: <HistoryEduOutlined />,
        component: <LeasingUi />,
        layout: true,
        menu: true,
      },
    ]
  },
  {
    tag: SingleRouteParamsType,
    path: "/leasing/ui/example",
    name: "Shared UI Exapme",
    icon: <HistoryEduOutlined />,
    component: <SharedUIPage />,
    layout: true,
    menu: true,
  },

];

export default routes;