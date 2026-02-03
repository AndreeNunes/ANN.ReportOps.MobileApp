import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#000',
    },
    camera: {
      flex: 1,
    },
    controls: {
      position: 'absolute',
      bottom: 40,
      alignSelf: 'center',
    },
    button: {
      width: 70,
      height: 70,
      borderRadius: 35,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      fontSize: 28,
    },
  })

export default styles;