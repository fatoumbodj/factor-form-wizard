import { Route, Routes, Navigate, useLocation, useNavigate } from "react-router-dom";
import React, { ReactNode, cloneElement, useState } from "react";
import { Sidebar, Header } from "@leasing/ui";
import { RouteParams, SingleRouteParamsType, UserInfo } from "@leasing/domain";

type Props = {
  appRoutes: Array<RouteParams>;
  logoPath: string;
  currentUser: UserInfo;
  isLoading: boolean;
}
export const LeasingLayout = ({ appRoutes, logoPath, currentUser, isLoading }: Props) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [openProfileDialog, setOpenProfileDialog] = useState(false);

  const passPropsToReactNode = (node: ReactNode): ReactNode => {
    if (!React.isValidElement(node)) {
      return node;
    }

    var element = cloneElement(node);
    return element;
  };

  const flatRoutes = (routes: Array<RouteParams>) => routes.flatMap(route => {
    if (route.tag === SingleRouteParamsType) {
      return route;
    } else {
      return route.items;
    }
  })

  const getRoutes = (routes: Array<RouteParams>) => {
    return flatRoutes(routes).map((param, key) => {
      return param.layout
        ? <Route path={param.path}
          element={passPropsToReactNode(param.component)} key={key} />
        : null;
    });
  };

  const getBrandText = () => {
    const allRoutes = flatRoutes(appRoutes);
    for (let i = 0; i < allRoutes.length; i++) {
      const currentPath = location?.pathname;
      let locationMatchRoute = currentPath === allRoutes[i].path;
      if (locationMatchRoute) {
        return allRoutes[i].name;
      }
    }
    return "";
  };


  return (
    <>
      <Sidebar
        routes={appRoutes}
        routeSelected={location.pathname}
        logoPath={logoPath}
        currentUser={currentUser}
        isLoading={isLoading}
        onNavigate={(route) => navigate(route)}
        onLogout={() => { }}
        onOpenProfile={() => setOpenProfileDialog(true)}
        onOpenPasswordDialog={() => setOpenPasswordDialog(true)}
      />
      <div className="main-content" style={{ position: 'relative', marginLeft: '300px', padding: '20px' }}>
        <Header 
        brand={getBrandText()} 
        currentUser={currentUser} 
        isLoading={isLoading} 
        onLogout={() => { }}
        onOpenProfile={() => setOpenProfileDialog(true)}
        onOpenPasswordDialog={() => setOpenPasswordDialog(true)
        }/>
        <Routes>
          {getRoutes(appRoutes)}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {/* <UserProfileDialog open={openProfileDialog} onClose={() => setOpenProfileDialog(false)} />
      <UpdatePasswordDialog open={openPasswordDialog} onClose={() => setOpenPasswordDialog(false)} /> */}
    </>
  );
}
