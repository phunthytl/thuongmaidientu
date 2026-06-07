import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../styles/theme';

export function Button({ title, icon, onPress, loading, variant = 'primary', disabled, style }) {
  const isGhost = variant === 'ghost';
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={[styles.button, isGhost && styles.ghost, (disabled || loading) && styles.disabled, style]}
    >
      {loading ? (
        <ActivityIndicator color={isGhost ? colors.primary : '#fff'} />
      ) : (
        <>
          {icon ? <Ionicons name={icon} size={18} color={isGhost ? colors.primary : '#fff'} /> : null}
          <Text selectable={false} style={[styles.text, isGhost && styles.ghostText]}>{title}</Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    borderRadius: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    backgroundColor: colors.primary,
    cursor: 'pointer',
    userSelect: 'none'
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.line
  },
  disabled: {
    opacity: 0.6
  },
  text: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    userSelect: 'none'
  },
  ghostText: {
    color: colors.primary
  }
});
