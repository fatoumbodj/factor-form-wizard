import { createHttpClient } from "@leasing/infrastructure";
import userService from "../services/user.service";
import { PROXY_URI } from "../constants/constant";


export const httpClient = createHttpClient(
  {
    baseURL: PROXY_URI,
    token: userService.getToken(),
    onUnauthorized: () => {
      userService.setToken(null);
      window.location.replace('/');
    }
  }
);
