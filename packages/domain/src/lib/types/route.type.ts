import { ReactNode } from "react";

export type SingleRouteParams = {
    tag: "single",
    path: string,
    name: string,
    icon?: React.ReactElement,
    component: ReactNode,
    layout: boolean,
    menu?: boolean
} 

export type GroupRouteParams = {
    tag: "group",
    groupName: string,
    items: Array<SingleRouteParams>,
} 

export type RouteParams = SingleRouteParams | GroupRouteParams; 

export const SingleRouteParamsType = "single";
export const GroupRouteParamsType = "group";