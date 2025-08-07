import { HistoryEduOutlined } from "@mui/icons-material";
import { GroupRouteParamsType, SingleRouteParamsType, RouteParams } from "./types/route.type";
import { LeasingUi } from '@leasing/ui'
import { DashboardPage } from "./pages/dashboard/Dashboard.page";
import { SharedUIPage } from "./pages/ui/SharedUI.page";
import { PropositionListPage } from "./pages/propositions/PropositionList.page";
import { PropositionCreatePage } from "./pages/propositions/PropositionCreate.page";
import { PropositionDetailPage } from "./pages/propositions/PropositionDetail.page";
import { PropositionEditPage } from "./pages/propositions/PropositionEdit.page";

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
    name: "Propositions",
    icon: <HistoryEduOutlined />,
    component: <PropositionListPage />,
    layout: true,
    menu: true,
  },
  {
    tag: SingleRouteParamsType,
    path: "/leasing/propositions/new",
    name: "Créer une proposition",
    icon: <HistoryEduOutlined />,
    component: <PropositionCreatePage />,
    layout: true,
    menu: false,
  },
  {
    tag: SingleRouteParamsType,
    path: "/leasing/propositions/:id",
    name: "Détail proposition",
    icon: <HistoryEduOutlined />,
    component: <PropositionDetailPage />,
    layout: true,
    menu: false,
  },
  {
    tag: SingleRouteParamsType,
    path: "/leasing/propositions/:id/edit",
    name: "Modifier proposition",
    icon: <HistoryEduOutlined />,
    component: <PropositionEditPage />,
    layout: true,
    menu: false,
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