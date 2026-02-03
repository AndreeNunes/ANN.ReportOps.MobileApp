import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    input: {
      flex: 1,
      height: 44,
      paddingHorizontal: 12,
      borderRadius: 12,
      backgroundColor: '#FFF',
      color: 'black',
      borderWidth: 1,
      borderColor: 'rgba(8, 36, 129, 0.98)',
      height: 52,
      fontFamily: 'Inter-Regular',
      fontSize: 16,
    },
    addButton: {
      marginLeft: 8,
      width: 52,
      height: 52,
      borderRadius: 12,
      backgroundColor: 'rgba(8, 36, 129, 0.98)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    addText: {
      color: '#fff',
      fontSize: 24,
      lineHeight: 26,
    },
  });
  