import { create } from "zustand";


// 定義 Zustand 狀態的型別
interface AppState {
  currentPage: string; // 當前頁面名稱
  guestName: string;   // 訪客名稱
  setPage: (page: string) => void; // 切換頁面
  setGuestName: (name: string) => void; // 設定訪客名稱
  volume: number; // 音量大小 (0 ~ 1)
  setVolume: (newVolume: number) => void; // 設定音量
  account: string; // 儲存使用者帳號
  setAccount: (account: string) => void; // 設定帳號的方法
  roomId: string; //儲存房間號碼
  setRoomId: (roomId: string) => void; //設定房間號碼
}

// 使用 Zustand 創建狀態，並提供明確的類型
export const useAppStore = create<AppState>((set) => ({
  currentPage: "home", // 預設為首頁
  guestName: "",
  setPage: (page: string) => set({ currentPage: page }), // 切換頁面函式
  setGuestName: (name: string) => set({ guestName: name }), // 設定訪客名稱函式
  volume: 0.5, // 預設音量大小為 0.5
  setVolume: (newVolume) => set({ volume: Math.min(Math.max(newVolume, 0), 1) }), // 限制範圍在 0 ~ 1
  account: "", // 初始帳號為空
  setAccount: (account) => set({ account }),
  roomId: "", //初始房間號碼為空
  setRoomId: (roomId) => set({ roomId }),
}));

