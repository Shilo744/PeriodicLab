import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, RADIUS } from '../theme';

interface Props {
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ConfirmDialog({ title, message, onCancel, onConfirm }: Props) {
  return <Modal visible transparent animationType="fade" onRequestClose={onCancel}>
    <View style={S.overlay}>
      <View style={S.box} accessibilityViewIsModal>
        <Text style={S.title} accessibilityRole="header">{title}</Text>
        <Text style={S.message}>{message}</Text>
        <View style={S.actions}>
          <TouchableOpacity accessibilityRole="button" onPress={onCancel} style={S.button}><Text style={S.cancel}>Cancel</Text></TouchableOpacity>
          <TouchableOpacity accessibilityRole="button" onPress={onConfirm} style={S.button}><Text style={S.confirm}>Reset mastery</Text></TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>;
}
const S = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  box: { width: '100%', maxWidth: 420, backgroundColor: COLORS.bgLight, padding: 24, borderRadius: RADIUS.lg },
  title: { color: COLORS.text, fontWeight: '800', fontSize: 18 },
  message: { color: COLORS.textSecondary, lineHeight: 22, marginVertical: 16 },
  actions: { flexDirection: 'row', gap: 12, flexWrap: 'wrap', justifyContent: 'flex-end' },
  button: { minHeight: 44, justifyContent: 'center', paddingHorizontal: 12 },
  cancel: { color: COLORS.text }, confirm: { color: '#f87171', fontWeight: '800' },
});
