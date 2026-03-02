import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingVertical: 16,
    paddingHorizontal: 0,
  },
  companyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(8, 36, 129, 0.18)',
    paddingVertical: 10,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
    marginBottom: 10,
    marginHorizontal: 16,
  },
  companyIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(8, 36, 129, 0.10)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  companyName: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#111827',
  },
  companyDoc: {
    marginTop: 2,
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#6B7280',
  },
  countChip: {
    marginLeft: 8,
    height: 20,
    borderRadius: 10,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#DBEAFE',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  countChipText: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: '#1E3A8A',
  },
});

export default styles;
