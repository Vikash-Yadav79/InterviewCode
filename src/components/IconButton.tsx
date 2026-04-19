// src/components/IconButton.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../theme/colors';

interface IconButtonProps {
  title?: string;
  icon: React.ReactNode;
  onPress: () => void;
  variant?: 'primary' | 'danger' | 'warning' | 'outline';
  size?: number;
  style?: ViewStyle;
}

const IconButton: React.FC<IconButtonProps> = ({
  title,
  icon,
  onPress,
  variant = 'primary',
  size = 44,
  style,
}) => {
  const getBackgroundColor = () => {
    switch (variant) {
      case 'primary':
        return Colors.primary;
      case 'danger':
        return Colors.danger;
      case 'warning':
        return Colors.warning;
      case 'outline':
        return 'transparent';
      default:
        return Colors.primary;
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'outline':
        return Colors.primary;
      default:
        return Colors.white;
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: variant === 'outline' ? 2 : 0,
          borderColor: variant === 'outline' ? Colors.primary : 'transparent',
        },
        style,
      ]}
      activeOpacity={0.8}
    >
      {icon}
      {title && (
        <Text style={[styles.text, { color: getTextColor() }]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  text: {
    marginLeft: 8,
    fontWeight: '600',
  },
});

export default IconButton;
