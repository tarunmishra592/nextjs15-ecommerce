import { startLoading, logoutSuccess, stopLoading, loginSuccess } from '@/store/slices/authSlice';
import { AppDispatch } from '@/store/store';
import { apiFetch } from './api';



export const verifyAuth = async (dispatch: AppDispatch) => {
  try {
    dispatch(startLoading());
    const res: any = await apiFetch('/auth/verify', { credentials: 'include' });
    if (res.ok) {
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