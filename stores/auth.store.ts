import { IAuth } from "@/interfaces/auth.interface";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type State = {
  auth?: IAuth;
  _hasHydrated: boolean;
};

type Events = {
  setAuth: (auth: IAuth) => void;
  setHasHydrated: (state: boolean) => void;
  removeAuth: () => void;
};

const useAuth = create<State & Events>()(
  persist(
    (set) => ({
      _hasHydrated: false,
      setAuth: (auth) => set(() => ({ auth })),
      setHasHydrated: (state) => set({ _hasHydrated: state }),
      removeAuth: () => set({ auth: undefined }),
    }),
    {
      name: "auth-store",
      partialize: (state) => ({
        auth: state.auth,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);

export default useAuth;
