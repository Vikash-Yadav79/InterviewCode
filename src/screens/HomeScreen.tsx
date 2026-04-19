import React, { useCallback } from 'react';
import { View, Text, FlatList, Image, StyleSheet, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { deleteProfile, editProfile, resetDraft } from '../store/profileSlice';
import Button from '../components/Button';
import IconButton from '../components/IconButton';
import { globalStyles } from '../theme/globalStyles';
import { Colors } from '../theme/colors';
import type { Profile } from '../types/profile.types';

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const profiles = useAppSelector(state => state.profile.profiles);

  useFocusEffect(useCallback(() => {}, [profiles.length]));

  const handleAddProfile = () => {
    dispatch(resetDraft());
    navigation.navigate('Page1');
  };

  const handleEditProfile = (profile: Profile) => {
    dispatch(editProfile(profile));
    navigation.navigate('Page1');
  };

  const handleDeleteProfile = (profile: Profile) => {
    Alert.alert(
      'Delete Profile',
      `Are you sure you want to delete ${profile.fullName}'s profile? This action cannot be undone.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            dispatch(deleteProfile(profile.id));
            // Show success feedback
            Alert.alert(
              'Success',
              `${profile.fullName}'s profile has been deleted`,
            );
          },
        },
      ],
    );
  };

  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  const renderProfileCard = ({ item }: { item: Profile }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          {item.avatar ? (
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {getInitials(item.fullName)}
              </Text>
            </View>
          )}
        </View>

        {/* Profile Info */}
        <View style={styles.infoSection}>
          <Text style={styles.name}>{item.fullName}</Text>
          <Text style={styles.email}>{item.email}</Text>
          <Text style={styles.age}>Age: {item.age}</Text>
          <Text style={styles.address}>
            📍 {item.city}, {item.state}, {item.country}
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <IconButton
            icon={<Text style={{ color: Colors.white, fontSize: 18 }}>✏️</Text>}
            onPress={() => handleEditProfile(item)}
            variant="warning"
            size={40}
            style={styles.actionButton}
          />
          <IconButton
            icon={<Text style={{ color: Colors.white, fontSize: 18 }}>🗑️</Text>}
            onPress={() => handleDeleteProfile(item)}
            variant="danger"
            size={40}
            style={styles.actionButton}
          />
        </View>
      </View>
    </View>
  );

  return (
    <View style={globalStyles.container}>
      <View style={styles.header}>
        <Button
          title=" Add New Profile"
          onPress={handleAddProfile}
          variant="primary"
          size="large"
          icon={<Text style={{ fontSize: 18, color: Colors.white }}>+</Text>}
          iconPosition="left"
        />
        <Text style={styles.profileCount}>
          Total Profiles: {profiles.length}
        </Text>
      </View>

      {profiles.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>📭 No profiles yet</Text>
          <Text style={styles.emptySubtext}>
            Tap "Add New Profile" to get started
          </Text>
        </View>
      ) : (
        <FlatList
          data={profiles}
          renderItem={renderProfileCard}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
    backgroundColor: Colors.white,
  },
  profileCount: {
    marginTop: 12,
    textAlign: 'center',
    fontSize: 14,
    color: Colors.textSecondary,
  },
  listContent: {
    padding: 20,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarSection: {
    marginRight: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: Colors.white,
    fontSize: 24,
    fontWeight: 'bold',
  },
  infoSection: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  age: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  address: {
    fontSize: 12,
    color: Colors.gray500,
    marginTop: 2,
  },
  actionSection: {
    flexDirection: 'row',
  },
  actionButton: {
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.gray400,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.gray400,
    textAlign: 'center',
  },
});

export default HomeScreen;
