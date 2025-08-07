import {StorageService} from '@leasing/domain'
import { TOKEN_KEY } from '../constants/constant';
class UserService {
  private storageService = new StorageService(localStorage)

  getToken(): string | null {
    return this.storageService.getStorageItem(TOKEN_KEY)
  }

  setToken(token: string | null): void {
    if(token){
      this.storageService.setStorageItem(TOKEN_KEY, token);
    }
  }

  isAuthenticate(): boolean {
    return this.getToken() != null;
  }

  logout(): void {
    this.storageService.clearItems();
    window.location.href = '/';
  }
}

export default new UserService();