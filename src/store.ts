import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import authReducer from './feature/auth/authSlice';
import { authApi } from './feature/auth/authApi';
import { userApi } from './feature/user/userApi';
import { employeeApi } from './feature/employee/employeeApi';
import { attendanceApi } from './feature/attendance/attendanceApi';
import { payrollApi } from './feature/payroll/payrollApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [employeeApi.reducerPath]: employeeApi.reducer,
    [attendanceApi.reducerPath]: attendanceApi.reducer,
    [payrollApi.reducerPath]: payrollApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(userApi.middleware)
      .concat(employeeApi.middleware)
      .concat(attendanceApi.middleware)
      .concat(payrollApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
