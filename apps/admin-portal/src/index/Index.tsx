import { useEffect, useState } from "react";
import { UserInfo } from "../types/user.type";
import './Index.css';
import { LeasingLayout } from '@leasing/app-shell'
import clientLogo from '../assets/logos/logo_cca.png';
import routes from "../routes";

const Index = () => {
  const [currentUser, setCurrentUser] = useState<UserInfo>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const user: UserInfo = {
      firstname: 'Mouhamad',
      lastname: 'Diack',
      email: 'mouhamad.diack@talentsconsult.com',
      role: 'ADMIN'
    }
    setCurrentUser(user);
    setTimeout(() => {
      setIsLoading(false);
    }, 5000)
  }, []);

  return (
    <>
      <LeasingLayout
        appRoutes={routes}
        currentUser={currentUser}
        isLoading={isLoading}
        logoPath={clientLogo} />
    </>
  );
};

export default Index;