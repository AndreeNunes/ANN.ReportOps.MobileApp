import { KeyboardAvoidingView, Platform, ScrollView, View, Text, TouchableOpacity } from "react-native";
import TextInput from "../../../../../components/TextInput";
import { useEffect, useRef, useState } from "react";
import Button from "../../../../../components/Button";
import { updateOrderService } from "../../../../../storage/order_service";
import styles from "./styles";
import InfoBanner from "../../../../../components/InfoBanner";
import { updateReport } from "../../../../../storage/report";
import BottomSheetComponent from "../../../../../components/BottomSheet";
import { Ionicons } from "@expo/vector-icons";

export default function DataGeneralServiceNotes({ route, navigation }) {
    const id = route?.params?.id || null;
    const orderService = route?.params?.orderService || null;

    const [cgaReasonVisit, setCgaReasonVisit] = useState(null);
    const [cgaReportedDefect, setCgaReportedDefect] = useState(null);
    const [cgaSolutionApplied, setCgaSolutionApplied] = useState(null);
    const [cgaReplacedParts, setCgaReplacedParts] = useState(null);
    const [cgaPartsToReplace, setCgaPartsToReplace] = useState(null);

    useEffect(() => {
        if (orderService) {
            setCgaReasonVisit(orderService.cga_reason_visit);
            setCgaReportedDefect(orderService.cga_reported_defect);
            setCgaSolutionApplied(orderService.cga_solution_applied);
            setCgaReplacedParts(orderService.cga_replaced_parts);
            setCgaPartsToReplace(orderService.cga_parts_to_replace);
        }
    }, [orderService]);

    const reasonSheetRef = useRef(null);
    const reasonVisitOptions = [
        "Inspeção de contrato",
        "Avaliação",
        "Manutenção preventiva",
        "Manutenção corretiva",
        "Partida técnica",
        "Instalação e partida técnica",
        "Visita técnica"
    ];

    const handleSave = async () => {
        if (!id) {
            return;
        }

        await updateOrderService(id, {
            cga_reason_visit: cgaReasonVisit,
            cga_reported_defect: cgaReportedDefect,
            cga_solution_applied: cgaSolutionApplied,
            cga_replaced_parts: cgaReplacedParts,
            cga_parts_to_replace: cgaPartsToReplace,
        });

        await updateReport(id, {
            sync: false,
        });

        navigation.goBack();
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView
                style={styles.container}
                contentContainerStyle={{ paddingBottom: 64 }}
                keyboardShouldPersistTaps="handled"
            >
                <InfoBanner
                    storageKey="@banner_semicolon_topics_dismissed_general_notes"
                    message="Dica: separe os itens com ';' e transformaremos cada um em um tópico no PDF."
                />

                <View style={{ height: 16 }} />

                <TouchableOpacity activeOpacity={0.8} onPress={() => reasonSheetRef.current?.expand()}>
                    <View pointerEvents="none">
                        <TextInput
                            label="Motivo da visita"
                            placeholder="Selecione o motivo da visita"
                            value={cgaReasonVisit}
                            editable={false}
                            rightIcon={<Ionicons name="chevron-down" size={18} color="#374151" />}
                            onRightIconPress={() => reasonSheetRef.current?.expand()}
                        />
                    </View>
                </TouchableOpacity>

                <View style={{ height: 32 }} />

                <TextInput
                    label="Defeito/Situação encontrada"
                    placeholder="Digite o defeito/situação encontrada"
                    value={cgaReportedDefect}
                    onChangeText={text => setCgaReportedDefect(text)}
                    multiline={true}
                    numberOfLines={14}
                />

                <View style={{ height: 32 }} />

                <TextInput
                    label="Serviço realizado"
                    placeholder="Digite o serviço realizado"
                    value={cgaSolutionApplied}
                    onChangeText={text => setCgaSolutionApplied(text)}
                    multiline={true}
                    numberOfLines={14}
                />

                <View style={{ height: 32 }} />

                <TextInput
                    label="Peças substituídas"
                    placeholder="Digite as partes substituídas"
                    value={cgaReplacedParts}
                    onChangeText={text => setCgaReplacedParts(text)}
                    multiline={true}
                    numberOfLines={14}
                />

                <View style={{ height: 32 }} />

                <TextInput
                    label="Peças a serem substituídas"
                    placeholder="Digite as partes a serem substituídas"
                    value={cgaPartsToReplace}
                    onChangeText={text => setCgaPartsToReplace(text)}
                    multiline={true}
                    numberOfLines={14}
                />

                <View style={{ height: 32 }} />

                <Button title="Salvar" onPress={handleSave} />
            </ScrollView>
            <BottomSheetComponent bottomSheetRef={reasonSheetRef} title="Selecionar motivo">
                <View style={{ paddingHorizontal: 8, marginBottom: 64 }}>
                    {reasonVisitOptions.map((opt) => {
                        const selected = cgaReasonVisit === opt;
                        return (
                            <TouchableOpacity
                                key={opt}
                                onPress={() => {
                                    setCgaReasonVisit(opt);
                                    reasonSheetRef.current?.close();
                                }}
                                activeOpacity={0.8}
                                style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12 }}
                            >
                                <Ionicons name="checkmark-circle" size={20} color={selected ? "rgba(8, 36, 129, 0.98)" : "#D1D5DB"} />
                                <Text style={{ marginLeft: 8, fontSize: 16 }}>{opt}</Text>
                            </TouchableOpacity>
                        )
                    })}
                </View>
            </BottomSheetComponent>
        </KeyboardAvoidingView>
    )
}