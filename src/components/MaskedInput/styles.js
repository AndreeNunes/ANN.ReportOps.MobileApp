import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: 'black',
    marginBottom: 8,
    marginLeft: 12,
  },
  inputContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 60,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#1F2937',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: 'rgba(8, 36, 129, 0.28)',
    borderRadius: 12,
    fontFamily: 'Inter-Regular',
  },
  inputWithSuffix: {
    paddingRight: 64,
  },
  suffixContainer: {
    position: 'absolute',
    right: 12,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  suffixText: {
    fontFamily: 'Inter-Bold',
    color: '#374151',
    fontSize: 16,
  },
  hint: {
    marginTop: 6,
    marginLeft: 12,
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
  },
});

