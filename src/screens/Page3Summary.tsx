import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { saveProfile, resetDraft, updateAvatar } from '../store/profileSlice';
import Button from '../components/Button';
import CustomModal from '../components/CustomModal';
import { useErrorHandler } from '../hooks/useErrorHandler';
import { globalStyles } from '../theme/globalStyles';
import { Colors } from '../theme/colors';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';

const Page3Summary: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const draft = useAppSelector(state => state.profile.draft);
  const { modalProps, showError, showSuccess } = useErrorHandler();
  const [avatarUri, setAvatarUri] = useState(draft.avatar || '');

  const handleImagePick = () => {
    Alert.alert(
      'Select Avatar',
      'Choose an option',
      [
        // { text: 'Camera', onPress: openCamera },
        { text: 'Gallery', onPress: openGallery },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true },
    );
  };

  // const openCamera = () => {
  //   launchCamera(
  //     {
  //       mediaType: 'photo',
  //       quality: 0.8,
  //       includeBase64: false,
  //     },
  //     response => {
  //       if (response.didCancel) {
  //         console.log('User cancelled camera');
  //       } else if (response.errorCode) {
  //         showError('Error', response.errorMessage || 'Failed to open camera');
  //       } else if (response.assets && response.assets[0]) {
  //         const uri = response.assets[0].uri;
  //         if (uri) {
  //           setAvatarUri(uri);
  //           dispatch(updateAvatar(uri));
  //         }
  //       }
  //     },
  //   );
  // };

  const openGallery = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
        includeBase64: false,
        selectionLimit: 1,
      },
      response => {
        if (response.didCancel) {
        } else if (response.errorCode) {
          showError('Error', response.errorMessage || 'Failed to open gallery');
        } else if (response.assets && response.assets[0]) {
          const uri = response.assets[0].uri;
          if (uri) {
            setAvatarUri(uri);
            dispatch(updateAvatar(uri));
          }
        }
      },
    );
  };

  const handleSubmit = () => {
    // Final validation before submit
    if (!draft.fullName || !draft.email || !draft.age) {
      showError('Error', 'Please complete all required fields');
      return;
    }

    if (!draft.city || !draft.state || !draft.country) {
      showError('Error', 'Please complete all address fields');
      return;
    }

    dispatch(saveProfile());
    showSuccess('Success', 'Profile saved successfully!');
    // Navigate after a short delay to show success message
    setTimeout(() => {
      navigation.replace('Home');
    }, 1500);
  };

  const handleEdit = () => {
    navigation.goBack();
  };

  return (
    <>
      <ScrollView style={globalStyles.screenContainer}>
        <Text style={globalStyles.title}>Review Your Profile</Text>

        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <TouchableOpacity
            onPress={handleImagePick}
            style={styles.avatarContainer}
          >
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarPlaceholderText}>📷</Text>
              </View>
            )}
            <View style={styles.cameraIcon}>
              <Text style={styles.cameraIconText}>📸</Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.avatarHint}>Tap to add profile picture</Text>
        </View>

        <View style={globalStyles.card}>
          <Text style={globalStyles.sectionTitle}>Basic Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Full Name:</Text>
            <Text style={styles.value}>{draft.fullName || 'Not provided'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{draft.email || 'Not provided'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Age:</Text>
            <Text style={styles.value}>{draft.age || 'Not provided'}</Text>
          </View>
        </View>

        <View style={globalStyles.card}>
          <Text style={globalStyles.sectionTitle}>Address Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>City:</Text>
            <Text style={styles.value}>{draft.city || 'Not provided'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>State:</Text>
            <Text style={styles.value}>{draft.state || 'Not provided'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Country:</Text>
            <Text style={styles.value}>{draft.country || 'Not provided'}</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <View style={styles.buttonWrapper}>
            <Button
              title=" Edit"
              onPress={handleEdit}
              variant="warning"
              size="large"
              icon={<Text style={{ fontSize: 18 }}>✏️</Text>}
              iconPosition="left"
            />
          </View>
          <View style={styles.buttonWrapper}>
            <Button
              title="Submit Profile"
              onPress={handleSubmit}
              variant="success"
              size="large"
              icon={<Text style={{ fontSize: 18 }}>✅</Text>}
              iconPosition="left"
            />
          </View>
        </View>
      </ScrollView>

      <CustomModal {...modalProps} />
    </>
  );
};

const styles = StyleSheet.create({
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.gray200,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
  },
  avatarPlaceholderText: {
    fontSize: 40,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  cameraIconText: {
    fontSize: 18,
  },
  avatarHint: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textSecondary,
    width: 100,
  },
  value: {
    fontSize: 16,
    color: Colors.textPrimary,
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    gap: 12,
  },
  buttonWrapper: {
    flex: 1,
  },
});

export default Page3Summary;
