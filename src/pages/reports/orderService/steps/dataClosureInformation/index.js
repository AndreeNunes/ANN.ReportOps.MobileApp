import { KeyboardAvoidingView, Platform, ScrollView, View, Text, TouchableOpacity } from "react-native";
import styles from "./styles";
import { updateOrderService } from "../../../../../storage/order_service";
import DateTimePickerField from "../../../../../components/DateTimePickerField";
import TextInput from "../../../../../components/TextInput";
import Button from "../../../../../components/Button";
import { useEffect, useState } from "react";
import { updateReport } from "../../../../../storage/report";
import { Ionicons } from "@expo/vector-icons";

export default function DataClosureInformation({ route, navigation }) {
    const id = route?.params?.id || null;
    const orderService = route?.params?.orderService || null;

    const [OS_number, setOS_number] = useState(null);
    const [closingStartTime, setClosingStartTime] = useState(null);
    const [closingEndTime, setClosingEndTime] = useState(null);
    const [closingResponsible, setClosingResponsible] = useState(null);
    const [closingResponsibleTechnician, setClosingResponsibleTechnician] = useState(null);
    const [technicians, setTechnicians] = useState([]);
    const [technicianName, setTechnicianName] = useState('');
    const [closingNotes, setClosingNotes] = useState(null);

    useEffect(() => {
        if (orderService) {
            console.log('[x] - orderService', JSON.stringify(orderService, null, 2));
            setOS_number(orderService.OS_number);
            setClosingStartTime(orderService.closing_start_time ? new Date(orderService.closing_start_time) : null);
            setClosingEndTime(orderService.closing_end_time ? new Date(orderService.closing_end_time) : null);
            setClosingResponsible(orderService.closing_responsible);
            setClosingResponsibleTechnician(orderService.closing_technician_responsible);

            if (orderService.closing_technician_responsible) {
                const parsed = parseTechniciansString(orderService.closing_technician_responsible);

                setTechnicians(parsed);
            }

            setClosingNotes(orderService.closing_notes);
        }
    }, [orderService]);

    const formatTechniciansList = (list) => {
        const names = list.map(n => (n || '').trim()).filter(Boolean);
        if (names.length === 0) return '';
        if (names.length === 1) return names[0];
        if (names.length === 2) return `${names[0]} e ${names[1]}`;
        const allButLast = names.slice(0, -1).join(', ');
        const last = names[names.length - 1];
        return `${allButLast} e ${last}`;
    };

    const parseTechniciansString = (text) => {
        if (!text) return [];
        // Tenta separar o último com " e "
        const parts = text.split(' e ');
        if (parts.length === 1) {
            return [text.trim()].filter(Boolean);
        }
        const head = parts.slice(0, -1).join(' e ');
        const last = parts[parts.length - 1];
        const headSplit = head.split(',').map(s => s.trim()).filter(Boolean);
        const result = [...headSplit, last.trim()].filter(Boolean);
        return result;
    };

    const handleAddTechnician = () => {
        const name = (technicianName || '').trim();
        if (!name) return;
        if (technicians.includes(name)) {
            setTechnicianName('');
            return;
        }
        const next = [...technicians, name];
        setTechnicians(next);
        setTechnicianName('');
        setClosingResponsibleTechnician(formatTechniciansList(next));
    };

    const handleRemoveTechnician = (name) => {
        const next = technicians.filter(n => n !== name);
        setTechnicians(next);
        setClosingResponsibleTechnician(formatTechniciansList(next));
    };

    const handleSave = async () => {
        if (!id) {
            return;
        }

        await updateOrderService(id, {
            OS_number: OS_number,
            closing_start_time: closingStartTime,
            closing_end_time: closingEndTime,
            closing_responsible: closingResponsible,
            closing_technician_responsible: closingResponsibleTechnician,
            closing_notes: closingNotes,
        });

        await updateReport(id, {
            OS_number: OS_number,
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

                <TextInput
                    label="Número da OS"
                    placeholder="Digite o número da OS"
                    value={OS_number}
                    onChangeText={setOS_number}
                />

                <View style={{ height: 16 }} />

                <DateTimePickerField
                    label="Data de início"
                    value={closingStartTime}
                    onChange={setClosingStartTime}
                />

                <View style={{ height: 16 }} />

                <DateTimePickerField
                    label="Data de fim"
                    value={closingEndTime}
                    onChange={setClosingEndTime}
                />

                <View style={{ height: 16 }} />

                <TextInput
                    label="Responsável pelo encerramento"
                    placeholder="Digite o responsável pelo encerramento"
                    value={closingResponsible}
                    onChangeText={setClosingResponsible}
                />

                <View style={{ height: 16 }} />

                <TextInput
                    label="Técnico(s) responsável(is)"
                    placeholder="Adicione técnicos abaixo"
                    value={closingResponsibleTechnician}
                    editable={false}
                />

                <View style={{ height: 12 }} />

                {technicians.length > 0 && (
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                        {technicians.map((name) => (
                            <View
                                key={name}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    backgroundColor: '#e5e7eb',
                                    borderRadius: 16,
                                    paddingVertical: 6,
                                    paddingHorizontal: 10,
                                    marginRight: 8,
                                    marginBottom: 8,
                                }}
                            >
                                <Text style={{ fontFamily: 'Inter-Regular', color: '#111827' }}>{name}</Text>
                                <TouchableOpacity onPress={() => handleRemoveTechnician(name)} style={{ marginLeft: 6 }}>
                                    <Ionicons name="close-circle" size={18} color="#6B7280" />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                )}

                <View style={{ height: 8 }} />

                <TextInput
                    placeholder="Adicione o nome do(s) técnico(s)"
                    value={technicianName}
                    onChangeText={setTechnicianName}
                    rightIcon={<Ionicons name="add-outline" size={18} color="#374151" />}
                    onRightIconPress={handleAddTechnician}
                    returnKeyType="done"
                    onSubmitEditing={handleAddTechnician}
                />

                <View style={{ height: 16 }} />

                <TextInput
                    label="Observações"
                    placeholder="Digite as observações"
                    value={closingNotes}
                    onChangeText={setClosingNotes}
                    multiline={true}
                    numberOfLines={14}
                />

                <View style={{ height: 32 }} />

                <Button
                    title="Salvar"
                    onPress={handleSave}
                />
            </ScrollView>
        </KeyboardAvoidingView>
    )
}