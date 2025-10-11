import { create } from "zustand";

export interface RegistrationData {
  password: string;
  email: string;
  fullName: string;
  gender: "MALE" | "FEMALE";
}

interface RegistrationStore {
  registrationData: RegistrationData | null;
  setRegistrationData: (data: RegistrationData) => void;
  clearRegistrationData: () => void;
}

export const useRegistrationStore = create<RegistrationStore>((set) => ({
  registrationData: null,
  setRegistrationData: (data) => set({ registrationData: data }),
  clearRegistrationData: () => set({ registrationData: null }),
}));
