import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      backgroundColor: '#0f172a',
      padding: 14,
      borderRadius: 12,
  
      elevation: 6,
  
      shadowColor: '#000',
      shadowOpacity: 0.3,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
  
      marginHorizontal: 16,
    },
  
    icon: {
      marginRight: 12,
      alignSelf: 'center',
    },
  
    textContainer: {
      flex: 1,
    },
  
    title: {
      color: '#f8fafc',
      fontSize: 15,
      fontWeight: '600',
      fontFamily: 'Inter-Bold',
    },
  
    message: {
      color: '#cbd5f5',
      fontSize: 13,
      marginTop: 2,
      fontFamily: 'Inter-Regular',
    },
  });
  