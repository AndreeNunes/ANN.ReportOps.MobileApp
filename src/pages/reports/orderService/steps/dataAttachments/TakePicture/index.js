import { CameraView, useCameraPermissions } from 'expo-camera'
import { useRef } from 'react'
import { View, Text, TouchableOpacity, ActivityIndicator, Linking } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { addAttachment } from '../../../../../../service/reportOrdemServiceAttachment'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function TakePicture({ navigation, route }) {
  const cameraRef = useRef(null)
  const [permission, requestPermission] = useCameraPermissions()
  const onPhotoTaken = route?.params?.onPhotoTaken || null

  if (!permission) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 12, fontSize: 16 }}>Verificando permissão da câmera...</Text>
      </View>
    )
  }

  if (!permission.granted) {
    const canAskAgain = permission?.canAskAgain ?? false
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
        <Text style={{ fontSize: 18, marginBottom: 12, textAlign: 'center' }}>
          Permissão de câmera necessária
        </Text>
        <Text style={{ fontSize: 14, color: '#555', textAlign: 'center', marginBottom: 16 }}>
          Para tirar fotos, precisamos do acesso à sua câmera.
        </Text>
        {canAskAgain ? (
          <TouchableOpacity
            onPress={requestPermission}
            style={{ backgroundColor: '#082481', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8 }}
            activeOpacity={0.8}
          >
            <Text style={{ color: '#fff', fontSize: 16 }}>Permitir câmera</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => Linking.openSettings()}
            style={{ backgroundColor: '#082481', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8 }}
            activeOpacity={0.8}
          >
            <Text style={{ color: '#fff', fontSize: 16 }}>Abrir configurações</Text>
          </TouchableOpacity>
        )}
      </View>
    )
  }

  const takePhoto = async () => {
    if (!cameraRef.current) return
  
    const photo = await cameraRef.current.takePictureAsync({
      quality: 0.8
    })
  
    if (onPhotoTaken) {
      onPhotoTaken(photo.uri)
    }

    navigation.goBack()
  }
  
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
      <CameraView
        ref={cameraRef}
        style={{ flex: 1 }}
        facing="back"
      />

      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          paddingHorizontal: 24,
          paddingTop: 12,
          paddingBottom: 24,
          backgroundColor: 'rgba(0,0,0,0.25)',
          alignItems: 'center',
        }}
      >
        <Text style={{ color: '#fff', marginBottom: 12 }}>Toque para fotografar</Text>
        <TouchableOpacity
          onPress={takePhoto}
          activeOpacity={0.8}
          style={{
            width: 78,
            height: 78,
            borderRadius: 39,
            backgroundColor: '#fff',
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 4,
            borderColor: '#e6e6e6',
            marginBottom: 16,
          }}
        >
          <View
            style={{
              width: 58,
              height: 58,
              borderRadius: 29,
              backgroundColor: '#fff',
            }}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}
