import { StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '../styles/theme';

export function Field({ label, value, onChangeText, secureTextEntry, keyboardType, placeholder, multiline }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        placeholder={placeholder}
        multiline={multiline}
        style={[styles.input, multiline && styles.multiline]}
        placeholderTextColor={colors.muted}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 6
  },
  label: {
    color: colors.ink,
    fontWeight: '700'
  },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 8,
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    color: colors.ink
  },
  multiline: {
    minHeight: 90,
    textAlignVertical: 'top',
    paddingTop: 12
  }
});
