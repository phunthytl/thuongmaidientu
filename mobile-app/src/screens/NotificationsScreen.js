import { Pressable, StyleSheet, Text } from 'react-native';
import { EmptyState } from '../components/EmptyState';
import { Screen } from '../components/Screen';
import { useNotificationStore } from '../store/notificationStore';
import { colors } from '../styles/theme';

export function NotificationsScreen() {
  const { notifications, markRead } = useNotificationStore();

  if (notifications.length === 0) {
    return (
      <Screen>
        <EmptyState icon="notifications-outline" title="Chưa có thông báo" />
      </Screen>
    );
  }

  return (
    <Screen>
      {notifications.map((item) => (
        <Pressable key={item.id} onPress={() => markRead(item.id)} style={[styles.item, !item.read && styles.unread]}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.body}>{item.body}</Text>
        </Pressable>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 14,
    gap: 6
  },
  unread: {
    borderColor: colors.primary
  },
  title: {
    color: colors.ink,
    fontWeight: '900'
  },
  body: {
    color: colors.muted,
    lineHeight: 20
  }
});
