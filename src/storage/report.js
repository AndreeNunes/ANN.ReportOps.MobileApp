import AsyncStorage from "@react-native-async-storage/async-storage";
import { getCurrentDate } from "../util/date";
import { addOrderService, addOrderServiceFromServer, getOrderServiceById, removeOrderService } from "./order_service";
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

    return {
        ...ORDEM_SERVICE,
        ...remote,
        company: remote?.company ?? null,
        equipament: remote?.equipament ?? null,
        attachments: [],
        signature: null,
        cr_hot_air_duct_ok: remote?.cr_hot_air_duct_ok == null ? null : remote?.cr_hot_air_duct_ok == 1 ? true : false,
        cr_hot_air_duct_regularized: remote?.cr_hot_air_duct_regularized == null ? null : remote?.cr_hot_air_duct_regularized == 1 ? true : false,
        cr_room_temp_vent_ok: remote?.cr_room_temp_vent_ok == null ? null : remote?.cr_room_temp_vent_ok == 1 ? true : false,
        cr_room_notes: remote?.cr_room_notes ?? null,
        cr_accident_risk: remote?.cr_accident_risk == null ? null : remote?.cr_accident_risk == 1 ? true : false,
        cr_electrical_install_ok: remote?.cr_electrical_install_ok == null ? null : remote?.cr_electrical_install_ok == 1 ? true : false,
        cr_grounding_ok: remote?.cr_grounding_ok == null ? null : remote?.cr_grounding_ok == 1 ? true : false,
        cr_room_lighting_ok: remote?.cr_room_lighting_ok == null ? null : remote?.cr_room_lighting_ok == 1 ? true : false,
        cr_service_outlet_220v: remote?.cr_service_outlet_220v == null ? null : remote?.cr_service_outlet_220v == 1 ? true : false,
        cr_air_point_for_cleaning: remote?.cr_air_point_for_cleaning == null ? null : remote?.cr_air_point_for_cleaning == 1 ? true : false,
        cr_water_point_available: remote?.cr_water_point_available == null ? null : remote?.cr_water_point_available == 1 ? true : false,
        cr_distancing_ok: remote?.cr_distancing_ok == null ? null : remote?.cr_distancing_ok == 1 ? true : false,
        cr_compressor_ok: remote?.cr_compressor_ok == null ? null : remote?.cr_compressor_ok == 1 ? true : false,
    };
}

export async function addReportFromServer(report, existingReports) {
    const existingReport = existingReports.find(r => r.id === report.report?.id);

    if (existingReport) {
        existingReports.splice(existingReports.indexOf(existingReport), 1);
        await removeOrderService(existingReport.id_report);
    }
    
    const newReport = {
        ...REPORT,
        id: report.report?.id,
        created_at: report.report?.created_at,
        id_report: report.ordem_service?.id,
        OS_number: report.ordem_service?.OS_number,
        company_name: report.ordem_service?.company?.name,
        equipament_name: report.ordem_service?.equipament?.name,
        sync: true,
    };

    existingReports.push(newReport);

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(existingReports));

    const orderServiceDto = mapRemoteToOrderService(report?.ordem_service);

    await addOrderServiceFromServer(orderServiceDto);

    return newReport;
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