import React from 'react';
import { View, Dimensions } from 'react-native';
import Pdf from 'react-native-pdf';
import { SafeAreaView } from 'react-native-safe-area-context';
import Share from 'react-native-share';
import Button from '../../../../components/Button';
import { Ionicons } from '@expo/vector-icons';
import styles from './styles';

export default function PreviewPDF({ route }) {
    const { pdfPath } = route.params;

    const sharePdf = async () => {
        await Share.open({
            url: `file://${pdfPath}`,
            type: 'application/pdf',
        });
    }

    return (
        <SafeAreaView style={styles.container}>
            <Pdf
                source={{ uri: `file://${pdfPath}` }}
                style={{
                    flex: 1,
                    width: Dimensions.get('window').width,
                }}
            />

            <View style={styles.containerButton}>
                <Button title="Compartilhar PDF" onPress={sharePdf} variant="secondary" leftIcon={<Ionicons name="share-outline" size={24} color="white" />} />
            </View>

        </SafeAreaView>
    );
}
