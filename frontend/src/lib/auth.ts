import { startLoading, logoutSuccess, stopLoading, loginSuccess } from '@/store/slices/authSlice';
import { AppDispatch } from '@/store/store';
import { apiFetch } from './client-api';



export const verifyAuth = async (dispatch: AppDispatch) => {
  try {
    dispatch(startLoading());
    const res: any = await apiFetch('/auth/verify', {method: 'POST', credentials: 'include' });
    if (res) {
      dispatch(loginSuccess(res));
    } else {
      dispatch(logoutSuccess());
    }
    return res
  } catch (error) {
    dispatch(logoutSuccess());
  } finally {
    dispatch(stopLoading());
  }
};