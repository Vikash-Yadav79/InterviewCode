import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { updateBasicInfo, setCurrentStep } from '../store/profileSlice';
import Button from '../components/Button';
import CustomModal from '../components/CustomModal';
import { useErrorHandler } from '../hooks/useErrorHandler';
import { globalStyles } from '../theme/globalStyles';
import { Colors } from '../theme/colors';

const Page1BasicInfo: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const draft = useAppSelector(state => state.profile.draft);
  const { modalProps, showError } = useErrorHandler();

  const [fullName, setFullName] = useState(draft.fullName);
  const [email, setEmail] = useState(draft.email);
  const [age, setAge] = useState(draft.age);

  const validateForm = (): boolean => {
    // Validate Full Name
    if (!fullName.trim()) {
      showError('Validation Error', 'Full name is required');
      return false;
    }

    if (fullName.trim().length < 2) {
      showError('Validation Error', 'Full name must be at least 2 characters');
      return false;
    }

    // Validate Email
    if (!email.trim()) {
      showError('Validation Error', 'Email is required');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showError(
        'Validation Error',
        'Please enter a valid email address (e.g., name@example.com)',
      );
      return false;
    }

    // Validate Age
    if (!age.trim()) {
      showError('Validation Error', 'Age is required');
      return false;
    }

    const ageNum = parseInt(age);
    if (isNaN(ageNum)) {
      showError('Validation Error', 'Age must be a valid number');
      return false;
    }

    if (ageNum < 1 || ageNum > 120) {
      showError('Validation Error', 'Age must be between 1 and 120');
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (validateForm()) {
      dispatch(updateBasicInfo({ fullName, email, age }));
      dispatch(setCurrentStep(2));
      navigation.navigate('Page2');
    }
  };

  return (
    <>
      <ScrollView style={globalStyles.screenContainer}>
        <Text style={globalStyles.title}>Basic Information</Text>

        <Text style={globalStyles.label}>Full Name *</Text>
        <TextInput
          style={globalStyles.input}
          value={fullName}
          onChangeText={setFullName}
          placeholder="Enter your Name"
          placeholderTextColor={Colors.gray400}
        />

        <Text style={globalStyles.label}>Email *</Text>
        <TextInput
          style={globalStyles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your Email"
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor={Colors.gray400}
        />

        <Text style={globalStyles.label}>Age *</Text>
        <TextInput
          style={globalStyles.input}
          value={age}
          onChangeText={setAge}
          placeholder="Enter Age"
          keyboardType="numeric"
          placeholderTextColor={Colors.gray400}
        />

        <Button
          title="Next →"
          onPress={handleNext}
          variant="primary"
          size="large"
        />
      </ScrollView>

      <CustomModal {...modalProps} />
    </>
  );
};

export default Page1BasicInfo;
