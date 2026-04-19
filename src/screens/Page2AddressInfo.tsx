import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { updateAddressInfo, setCurrentStep } from '../store/profileSlice';
import Button from '../components/Button';
import CustomModal from '../components/CustomModal';
import { useErrorHandler } from '../hooks/useErrorHandler';
import { globalStyles } from '../theme/globalStyles';
import { Colors } from '../theme/colors';

const Page2AddressInfo: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const draft = useAppSelector(state => state.profile.draft);
  const { modalProps, showError } = useErrorHandler();

  const [city, setCity] = useState(draft.city);
  const [state, setState] = useState(draft.state);
  const [country, setCountry] = useState(draft.country);

  const validateForm = (): boolean => {
    if (!city.trim()) {
      showError('Validation Error', 'City is required');
      return false;
    }

    if (!state.trim()) {
      showError('Validation Error', 'State is required');
      return false;
    }

    if (!country.trim()) {
      showError('Validation Error', 'Country is required');
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (validateForm()) {
      dispatch(updateAddressInfo({ city, state, country }));
      dispatch(setCurrentStep(3));
      navigation.navigate('Page3');
    }
  };

  const handleBack = () => {
    // Save current data before going back
    dispatch(updateAddressInfo({ city, state, country }));
    dispatch(setCurrentStep(1));
    navigation.goBack();
  };

  return (
    <>
      <ScrollView style={globalStyles.screenContainer}>
        <Text style={globalStyles.title}>Address Information</Text>

        <Text style={globalStyles.label}>City *</Text>
        <TextInput
          style={globalStyles.input}
          value={city}
          onChangeText={setCity}
          placeholder="Enter City"
          placeholderTextColor={Colors.gray400}
        />

        <Text style={globalStyles.label}>State *</Text>
        <TextInput
          style={globalStyles.input}
          value={state}
          onChangeText={setState}
          placeholder="Enter State"
          placeholderTextColor={Colors.gray400}
        />

        <Text style={globalStyles.label}>Country *</Text>
        <TextInput
          style={globalStyles.input}
          value={country}
          onChangeText={setCountry}
          placeholder="Enter Country"
          placeholderTextColor={Colors.gray400}
        />

        <View style={styles.buttonContainer}>
          <View style={styles.buttonWrapper}>
            <Button
              title="← Back"
              onPress={handleBack}
              variant="outline"
              size="large"
            />
          </View>
          <View style={styles.buttonWrapper}>
            <Button
              title="Next →"
              onPress={handleNext}
              variant="primary"
              size="large"
            />
          </View>
        </View>
      </ScrollView>

      <CustomModal {...modalProps} />
    </>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  buttonWrapper: {
    flex: 1,
    marginHorizontal: 5,
  },
});

export default Page2AddressInfo;
