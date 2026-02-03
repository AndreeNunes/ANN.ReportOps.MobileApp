import React, { useEffect, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import SignatureView from 'react-native-signature-canvas';
import * as FileSystem from 'expo-file-system/legacy';
import { Alert, View, TouchableOpacity, Text } from 'react-native';
import { updateOrderService } from '../../../../storage/order_service';
import { Ionicons } from '@expo/vector-icons';
import * as ScreenOrientation from 'expo-screen-orientation';

export default function Signature({ route, navigation }) {
    const id = route?.params?.id || null;
    const orderService = route?.params?.orderService || null;
    const signatureRef = useRef(null);

    useEffect(() => {
        const lockLandscape = async () => {
            try {
                await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
            } catch (_e) {
                // ignore
            }
        };
        lockLandscape();
        return () => {
            // tenta voltar para retrato ao sair
            ScreenOrientation.unlockAsync().catch(() => {});
        };
    }, []);

    const handleOK = async (signature) => {
        try {
            if (!signature) return;
            const base64 = signature.replace('data:image/png;base64,', '');

            const dir = `${FileSystem.documentDirectory}signatures`;
            
            try {
                await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
            } catch (_e) {
                // diretório pode já existir; ignorar
            }

            const filename = `signature_${id ?? 'os'}_${Date.now()}.png`;
            const filepath = `${dir}/${filename}`;

            const encoding = (FileSystem?.EncodingType?.Base64) ? FileSystem.EncodingType.Base64 : 'base64';
            await FileSystem.writeAsStringAsync(filepath, base64, { encoding });

            await updateOrderService(id, { signature: filepath });

            navigation.goBack();
        } catch (e) {
            console.error('Erro ao salvar assinatura:', e);
            Alert.alert('Erro', 'Não foi possível salvar a assinatura.');
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={{ flex: 1 }}>
                <SignatureView
                    ref={signatureRef}
                    onOK={handleOK}
                    onEmpty={() => Alert.alert('Atenção', 'Desenhe a assinatura antes de salvar.')}
                    descriptionText="Assine aqui"
                    clearText="Limpar"
                    confirmText="Salvar"
                    webStyle={`
                        .m-signature-pad { border: none; }
                        .m-signature-pad--footer { display: none; }
                    `}
                    backgroundColor="#ffffff"
                    penColor="#000000"
                />

                <View
                    style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        bottom: 0,
                        width: 84,
                        paddingHorizontal: 12,
                        paddingVertical: 16,
                        backgroundColor: 'rgba(255,255,255,0.85)',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <TouchableOpacity
                        onPress={() => signatureRef.current?.clearSignature()}
                        activeOpacity={0.8}
                        style={{
                            width: 56,
                            height: 56,
                            borderRadius: 28,
                            borderWidth: 1,
                            borderColor: '#CCC',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#f2f2f2',
                            marginBottom: 16,
                        }}
                    >
                        <Ionicons name="trash-outline" size={24} color="#333" accessibilityLabel="Limpar assinatura" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => signatureRef.current?.readSignature()}
                        activeOpacity={0.8}
                        style={{
                            width: 56,
                            height: 56,
                            borderRadius: 28,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#082481',
                        }}
                    >
                        <Ionicons name="checkmark-outline" size={28} color="#fff" accessibilityLabel="Salvar assinatura" />
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}
