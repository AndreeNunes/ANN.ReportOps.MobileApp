import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({  
  label: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: "black",
    marginBottom: 8,
    marginLeft: 12,
  },
  
  labelFocused: {
    color: 'rgba(8, 36, 129, 0.98)',
    transform: [{ scale: 1.02 }],
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

  inputMultiline: {
    height: 'auto',
    minHeight: 60,
  },
  
  inputFocused: {
    borderColor: '#3B82F6',
    shadowColor: '#3B82F6',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
    transform: [{ scale: 1.01 }],
  },
  
  inputDisabled: {
    backgroundColor: '#F9FAFB',
    borderColor: '#D1D5DB',
    color: '#9CA3AF',
  },
  
  leftIconContainer: {
    position: 'absolute',
    left: 16,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  rightIconContainer: {
    position: 'absolute',
    right: 16,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  
  eyeIcon: {
    fontSize: 20,
  },
  
  hint: {
    marginTop: 6,
    marginLeft: 12,
    fontSize: 12,
    color: '#6B7280', /* slate-500 */
    fontFamily: 'Inter-Regular',
  },
});
