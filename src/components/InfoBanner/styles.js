import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(8, 36, 129, 0.08)',
    borderColor: 'rgba(8, 36, 129, 0.28)',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  leftIcon: {
    marginRight: 8,
  },
  text: {
    flex: 1,
    color: '#0c2168',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  close: {
    marginLeft: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(8, 36, 129, 0.08)',
  },
});

