export interface BasicInfo {
  fullName: string;
  email: string;
  age: string;
}

export interface AddressInfo {
  city: string;
  state: string;
  country: string;
}

export interface Profile extends BasicInfo, AddressInfo {
  id: string;
  createdAt: string;
  avatar?: string; // Add avatar field
}

export interface DraftProfile extends BasicInfo, AddressInfo {
  currentStep: number;
  avatar?: string;
}