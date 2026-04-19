// src/store/profileSlice.ts (Complete fixed version)
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Profile, DraftProfile } from '../types/profile.types';

interface ProfileState {
  profiles: Profile[];
  draft: DraftProfile;
  editingId: string | null;
}

const initialState: ProfileState = {
  profiles: [],
  draft: {
    fullName: '',
    email: '',
    age: '',
    city: '',
    state: '',
    country: '',
    currentStep: 1,
    avatar: '',
  },
  editingId: null,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    updateBasicInfo: (state, action: PayloadAction<{
      fullName: string;
      email: string;
      age: string;
    }>) => {
      state.draft.fullName = action.payload.fullName;
      state.draft.email = action.payload.email;
      state.draft.age = action.payload.age;
    },
    
    updateAddressInfo: (state, action: PayloadAction<{
      city: string;
      state: string;
      country: string;
    }>) => {
      state.draft.city = action.payload.city;
      state.draft.state = action.payload.state;
      state.draft.country = action.payload.country;
    },
    
    updateAvatar: (state, action: PayloadAction<string>) => {
      state.draft.avatar = action.payload;
    },
    
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.draft.currentStep = action.payload;
    },
    
    saveProfile: (state) => {
      const newProfile: Profile = {
        id: Date.now().toString(),
        fullName: state.draft.fullName,
        email: state.draft.email,
        age: state.draft.age,
        city: state.draft.city,
        state: state.draft.state,
        country: state.draft.country,
        createdAt: new Date().toISOString(),
        avatar: state.draft.avatar,
      };
      
      if (state.editingId) {
        const index = state.profiles.findIndex(p => p.id === state.editingId);
        if (index !== -1) {
          state.profiles[index] = { ...newProfile, id: state.editingId };
        }
        state.editingId = null;
      } else {
        state.profiles.push(newProfile);
      }
      
      state.draft = {
        fullName: '',
        email: '',
        age: '',
        city: '',
        state: '',
        country: '',
        currentStep: 1,
        avatar: '',
      };
    },
    
    editProfile: (state, action: PayloadAction<Profile>) => {
      state.editingId = action.payload.id;
      state.draft = {
        fullName: action.payload.fullName,
        email: action.payload.email,
        age: action.payload.age,
        city: action.payload.city,
        state: action.payload.state,
        country: action.payload.country,
        currentStep: 1,
        avatar: action.payload.avatar || '',
      };
    },
    
    deleteProfile: (state, action: PayloadAction<string>) => {
      state.profiles = state.profiles.filter(profile => profile.id !== action.payload);
    },
    
    resetDraft: (state) => {
      state.draft = initialState.draft;
      state.editingId = null;
    },
  },
});

export const {
  updateBasicInfo,
  updateAddressInfo,
  updateAvatar,
  setCurrentStep,
  saveProfile,
  editProfile,
  deleteProfile,
  resetDraft,
} = profileSlice.actions;

export default profileSlice.reducer;