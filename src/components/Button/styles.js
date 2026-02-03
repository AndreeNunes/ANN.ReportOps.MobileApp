import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderRadius: 12,
    height: 52,
  },
  
  buttonPressed: {
    transform: [{ scale: 0.98 }],
    shadowOpacity: 0.05,
    elevation: 1,
  },
  
  buttonDisabled: {
    opacity: 0.6,
    shadowOpacity: 0,
    elevation: 0,
  },
  
  // Variants
  button_primary: {
    backgroundColor: '#0C40EA',
    shadowColor: '#0C40EA',
    shadowOpacity: 0.3,
  },
  
  button_secondary: {
    backgroundColor: 'rgba(1, 140, 253, 0.94)',
    shadowColor: 'rgba(1, 140, 253, 0.94)',
    shadowOpacity: 0.3,
  },
  
  button_success: {
    backgroundColor: '#10B981',
    shadowColor: '#10B981',
    shadowOpacity: 0.3,
  },
  
  button_danger: {
    backgroundColor: '#EF4444',
    shadowColor: '#EF4444',
    shadowOpacity: 0.3,
  },
  
  button_warning: {
    backgroundColor: '#F59E0B',
    shadowColor: '#F59E0B',
    shadowOpacity: 0.3,
  },
  
  button_outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#3B82F6',
    shadowOpacity: 0,
    elevation: 0,
  },
  
  button_ghost: {
    backgroundColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
  
  // Sizes
  button_small: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 36,
  },
  
  button_medium: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    minHeight: 48,
  },
  
  button_large: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    minHeight: 56,
  },
  
  button_xlarge: {
    paddingHorizontal: 40,
    paddingVertical: 20,
    minHeight: 64,
  },
  
  text: {
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
  
  text_primary: {
    color: '#FFFFFF',
  },
  
  text_secondary: {
    color: '#FFFFFF',
  },
  
  text_success: {
    color: '#FFFFFF',
  },
  
  text_danger: {
    color: '#FFFFFF',
  },
  
  text_warning: {
    color: '#FFFFFF',
  },
  
  text_outline: {
    color: '#3B82F6',
  },
  
  text_ghost: {
    color: '#3B82F6',
  },
  
  text_small: {
    fontSize: 14,
  },
  
  text_medium: {
    fontSize: 16,
  },
  
  text_large: {
    fontSize: 18,
  },
  
  text_xlarge: {
    fontSize: 20,
  },
  
  textDisabled: {
    opacity: 0.7,
  },
  
  // Content containers
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  leftIconContainer: {
    marginRight: 8,
  },
  
  rightIconContainer: {
    marginLeft: 8,
  },
});
