import { View, Text, Image, FlatList, Modal, TouchableOpacity } from "react-native";
import Button from "../../../../../components/Button";
import { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "./styles";
import { updateOrderService } from "../../../../../storage/order_service";

export default function DataAttachments({ route, navigation }) {
  const id = route?.params?.id || null;
  const orderService = route?.params?.orderService || null;

  const [photos, setPhotos] = useState(orderService?.attachments || []);
  const photosRef = useRef([]);

  const [viewerVisible, setViewerVisible] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const takePhoto = async (photoUri) => {
    if (!photoUri) return;

    photosRef.current = [...photosRef.current, photoUri];

    await updateOrderService(id, {
      attachments: photosRef.current,
    });

    setPhotos(photosRef.current);
  }

  const openViewer = (uri) => {
    if (!uri) return;
    setSelectedPhoto(uri);
    setViewerVisible(true);
  }

  const closeViewer = () => {
    setViewerVisible(false);
    setSelectedPhoto(null);
  }

  useEffect(() => {
    if (orderService) {
      setPhotos(orderService?.attachments || []);
      photosRef.current = [...orderService?.attachments || []];
    }
  }, [orderService]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={{ fontSize: 18, marginBottom: 16 }}>Fotos</Text>

      <FlatList
        data={photos}
        keyExtractor={(item, index) => item + index}
        numColumns={3}
        columnWrapperStyle={{ gap: 8 }}
        contentContainerStyle={{ gap: 8 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => openViewer(item)}
          >
            <Image
              source={{ uri: item }}
              style={{
                width: 100,
                height: 100,
                borderRadius: 8,
              }}
            />
          </TouchableOpacity>
        )}
      />

      <Button
        title="Tirar foto"
        onPress={() => navigation.navigate("TakePicture", { onPhotoTaken: takePhoto })}
        style={{ marginTop: 16 }}
      />

      <Modal
        visible={viewerVisible}
        transparent
        animationType="fade"
        onRequestClose={closeViewer}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.95)' }}>
          <TouchableOpacity
            onPress={closeViewer}
            activeOpacity={0.8}
            style={{
              position: 'absolute',
              top: 32,
              right: 16,
              zIndex: 2,
              paddingHorizontal: 12,
              paddingVertical: 8,
              backgroundColor: 'rgba(255,255,255,0.15)',
              borderRadius: 8
            }}
          >
            <Text style={{ color: '#fff', fontSize: 16 }}>Fechar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
            activeOpacity={1}
            onPress={closeViewer}
          >
            {selectedPhoto && (
              <Image
                source={{ uri: selectedPhoto }}
                style={{ width: '100%', height: '100%' }}
                resizeMode="contain"
              />
            )}
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
