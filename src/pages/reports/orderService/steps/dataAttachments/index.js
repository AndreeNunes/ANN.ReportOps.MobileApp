import { View, Text, Image, FlatList, Modal, TouchableOpacity } from "react-native";
import Button from "../../../../../components/Button";
import { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "./styles";
import { updateOrderService } from "../../../../../storage/order_service";
import BottomSheetComponent from "../../../../../components/BottomSheet";
import TextInput from "../../../../../components/TextInput";
import { Ionicons } from "@expo/vector-icons";

export default function DataAttachments({ route, navigation }) {
  const id = route?.params?.id || null;
  const orderService = route?.params?.orderService || null;

  const [photos, setPhotos] = useState(orderService?.attachments || []);
  const photosRef = useRef([]);
  const [notes, setNotes] = useState(orderService?.attachments_notes || {});
  const notesRef = useRef({});

  const [viewerVisible, setViewerVisible] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const bottomSheetRef = useRef(null);
  const [actionUri, setActionUri] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

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
      setNotes(orderService?.attachments_notes || {});
      notesRef.current = { ...(orderService?.attachments_notes || {}) };
    }
  }, [orderService]);

  const openActions = (uri) => {
    if (!uri) return;
    setActionUri(uri);
    setIsEditing(false);
    setEditText(notesRef.current?.[uri] || '');
    bottomSheetRef.current?.expand?.();
  }

  const closeActions = () => {
    bottomSheetRef.current?.close?.();
    setActionUri(null);
    setIsEditing(false);
    setEditText('');
    setIsDeleting(false);
  }

  const deletePhoto = async () => {
    if (!actionUri) return;
    try {
      setIsDeleting(true);
      const filtered = photosRef.current.filter(p => p !== actionUri);
      const nextNotes = { ...(notesRef.current || {}) };
      delete nextNotes[actionUri];
      photosRef.current = filtered;
      notesRef.current = nextNotes;
      await updateOrderService(id, {
        attachments: filtered,
        attachments_notes: nextNotes,
      });
      setPhotos(filtered);
      setNotes(nextNotes);
      if (selectedPhoto === actionUri) {
        setViewerVisible(false);
        setSelectedPhoto(null);
      }
      closeActions();
    } finally {
      setIsDeleting(false);
    }
  }

  const deleteObservation = async () => {
    if (!actionUri) return;
    const next = { ...(notesRef.current || {}) };
    delete next[actionUri];
    notesRef.current = next;
    await updateOrderService(id, { attachments_notes: next });
    setNotes(next);
    closeActions();
  }

  const startEditObservation = () => {
    setIsEditing(true);
    setEditText(notesRef.current?.[actionUri] || '');
  }

  const saveObservation = async () => {
    if (!actionUri) return;
    const text = (editText || '').trim();
    const next = { ...(notesRef.current || {}) };
    if (text.length === 0) {
      delete next[actionUri];
    } else {
      next[actionUri] = text;
    }
    notesRef.current = next;
    await updateOrderService(id, { attachments_notes: next });
    setNotes(next);
    setIsEditing(false);
    // manter sheet aberto para novas ações, ou fechar:
    closeActions();
  }

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
            onLongPress={() => openActions(item)}
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
        onPress={() => navigation.navigate("TakePicture", { onPhotoTaken: takePhoto, id })}
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
            onLongPress={() => openActions(selectedPhoto)}
          >
            {selectedPhoto && (
              <Image
                source={{ uri: selectedPhoto }}
                style={{ width: '100%', height: '100%' }}
                resizeMode="contain"
              />
            )}
            {!!selectedPhoto && !!notes?.[selectedPhoto] && (
              <View
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: 0,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  backgroundColor: 'rgba(0,0,0,0.5)',
                }}
              >
                <Text style={{ color: '#fff', fontSize: 14 }}>
                  {notes?.[selectedPhoto]}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </Modal>

      <BottomSheetComponent bottomSheetRef={bottomSheetRef} title={isEditing ? 'Editar observação' : 'Opções'}>
        <View style={{ paddingVertical: 8, gap: 12 }}>
          {!isEditing && (
            <>
              <TouchableOpacity
                onPress={deletePhoto}
                disabled={isDeleting}
                style={{ paddingVertical: 12, flexDirection: 'row', alignItems: 'center', gap: 12 }}
                activeOpacity={0.8}
              >
                <Ionicons name="trash-outline" size={20} color="#DC2626" />
                <Text style={{ color: '#DC2626', fontSize: 16 }}>
                  {isDeleting ? 'Excluindo foto...' : 'Excluir foto'}
                </Text>
              </TouchableOpacity>
              {!!(actionUri && notes?.[actionUri]) && (
                <TouchableOpacity
                  onPress={deleteObservation}
                  style={{ paddingVertical: 12, flexDirection: 'row', alignItems: 'center', gap: 12 }}
                  activeOpacity={0.8}
                >
                  <Ionicons name="trash-outline" size={20} color="#DC2626" />
                  <Text style={{ color: '#DC2626', fontSize: 16 }}>Excluir observação</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={startEditObservation}
                style={{ paddingVertical: 12, flexDirection: 'row', alignItems: 'center', gap: 12 }}
                activeOpacity={0.8}
              >
                <Ionicons name="create-outline" size={20} color="rgba(8, 36, 129, 0.98)" />
                <Text style={{ color: '#082481', fontSize: 16 }}>Editar observação</Text>
              </TouchableOpacity>
            </>
          )}
          {isEditing && (
            <>
              <TextInput
                label=""
                placeholder="Digite a observação"
                value={editText}
                onChangeText={setEditText}
                multiline={true}
                numberOfLines={6}
              />
              <View style={{ height: 12 }} />
              <Button title="Salvar" onPress={saveObservation} />
            </>
          )}
        </View>
      </BottomSheetComponent>
    </SafeAreaView>
  );
}
