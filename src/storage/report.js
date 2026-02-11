import AsyncStorage from "@react-native-async-storage/async-storage";
import { getCurrentDate } from "../util/date";
import { addOrderService, getOrderServiceById, removeOrderService } from "./order_service";
import { ORDEM_SERVICE } from "./types/ordem_service";
import { REPORT } from "./types/report";
import uuid from 'react-native-uuid';


const STORAGE_KEY = "@report_list";

export async function getReport() {
    const response = await AsyncStorage.getItem(STORAGE_KEY);

    return response ? JSON.parse(response) : [];
}

export async function getReportById(id) {
    const reports = await getReport();

    return reports.find(r => r.id === id);
}

export async function getReportByRemoteId(remoteId) {
    if (!remoteId) return null;
    const reports = await getReport();
    return reports.find(r => r.remote_id === remoteId);
}

export async function addReport() {
    const reports = await getReport();

    const id = uuid.v4();
    
    const idOrderService = await addOrderService(ORDEM_SERVICE);

    const date = getCurrentDate();

    const report = {
        ...REPORT,
        id: id,
        id_report: idOrderService,
        created_at: date,
    }

    reports.push(report);

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(reports));

    return report;
}

function mapRemoteToOrderService(remote) {
    if (!remote || typeof remote !== 'object') {
        return { ...ORDEM_SERVICE };
    }
    const {
        id,
        created_at,
        updated_at,
        id_company,
        id_equipament,
        ...rest
    } = remote || {};
    
    // Garante os campos esperados e zera anexos/assinatura locais
    return {
        ...ORDEM_SERVICE,
        ...rest,
        company: remote?.company ?? null,
        equipament: remote?.equipament ?? null,
        attachments: [],
        signature: null,
    };
}

export async function addReportFromServer(remoteReport) {
    const reports = await getReport();
    
    // Evita duplicação caso já exista pelo remote_id
    const exists = reports.find(r => r.remote_id === remoteReport?.id);
    if (exists) {
        return exists;
    }

    const orderServiceDto = mapRemoteToOrderService(remoteReport);
    const idOrderService = await addOrderService(orderServiceDto);

    const date = remoteReport?.created_at || getCurrentDate();

    const report = {
        ...REPORT,
        id: uuid.v4(),
        id_report: idOrderService,
        created_at: date,
        OS_number: remoteReport?.OS_number ?? '',
        company_name: remoteReport?.company?.name ?? '',
        equipament_name: remoteReport?.equipament?.name ?? '',
        sync: true,
        remote_id: remoteReport?.id,
    };

    reports.push(report);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(reports));

    return report;
}

export async function updateReport(id, partialDto) {
    const reports = await getReport();

    const report = reports.find(r => r.id_report === id);

    if (!report) {
        return null;
    }

    const newReport = {
        ...report,
        ...partialDto,
    }

    reports[reports.indexOf(report)] = newReport;

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(reports));

    return newReport;
}

export async function removeReport(id) {
  const reports = await getReport();
  const report = reports.find(r => r.id === id);
  if (!report) return false;
  // remove ordem de serviço vinculada
  if (report.id_report) {
    await removeOrderService(report.id_report);
  }
  const filtered = reports.filter(r => r.id !== id);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return true;
}

export async function duplicateReport(id) {
  const reports = await getReport();
  const original = reports.find(r => r.id === id);
  if (!original) return null;

  // clonar OS vinculada
  const os = await getOrderServiceById(original.id_report);
  const newOrderServiceId = await addOrderService({ ...(os || {}) });

  const newId = uuid.v4();
  const date = getCurrentDate();

  const newReport = {
    ...REPORT,
    id: newId,
    id_report: newOrderServiceId,
    created_at: date,
    OS_number: original.OS_number ?? '',
    company_name: original.company_name ?? '',
    equipament_name: original.equipament_name ?? '',
  };

  const updated = [...reports, newReport];
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  return newReport;
}