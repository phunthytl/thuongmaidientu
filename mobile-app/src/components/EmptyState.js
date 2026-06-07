import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../styles/theme';

export function EmptyState({ icon = 'cube-outline', title, body }) {
  return (
    <View style={styles.wrap}>
      <Ionicons name={icon} size={36} color={colors.muted} />
      <Text style={styles.title}>{title}</Text>
      {body ? <Text style={styles.body}>{body}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    gap: 8
  },
  title: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center'
  },
  body: {
    color: colors.muted,
    textAlign: 'center'
  }
});
