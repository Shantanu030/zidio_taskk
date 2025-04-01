import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../index';

interface UIState {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  isMobile: boolean;
  currentView: string;
}

const initialState: UIState = {
  theme: 'light',
  sidebarOpen: false,
  isMobile: window.innerWidth < 768,
  currentView: 'list',
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    setIsMobile: (state, action: PayloadAction<boolean>) => {
      state.isMobile = action.payload;
    },
    setCurrentView: (state, action: PayloadAction<string>) => {
      state.currentView = action.payload;
    },
  },
});

export const {
  toggleTheme,
  setTheme,
  toggleSidebar,
  setSidebarOpen,
  setIsMobile,
  setCurrentView,
} = uiSlice.actions;

export const selectTheme = (state: RootState) => state.ui.theme;
export const selectSidebarOpen = (state: RootState) => state.ui.sidebarOpen;
export const selectIsMobile = (state: RootState) => state.ui.isMobile;
export const selectCurrentView = (state: RootState) => state.ui.currentView;

export default uiSlice.reducer; 