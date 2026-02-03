import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: 'black',
    marginBottom: 8,
    marginLeft: 12,
  },
  segmentContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#e5e7eb',
  },
  segment: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  segmentSelected: {
    backgroundColor: 'rgba(8, 36, 129, 0.98)',
  },
  segmentText: {
    fontFamily: 'Inter-Regular',
    color: 'black',
  },
  segmentTextSelected: {
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
});
