import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF'
  },
  addReportContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(8, 36, 129, 0.18)',
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  cardTypeContent: {
    flex: 1,
    marginLeft: 12,
  },
  cardTypeIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(8, 36, 129, 0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTypeTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: '#1F2937',
  },
  cardTypeSubtitle: {
    marginTop: 2,
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#6B7280',
  },
  containerErrorOrLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardReport: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(8, 36, 129, 0.18)',
    marginHorizontal: 16,
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
    minHeight: 110
  },
  cardSelected: {
    borderColor: 'rgba(8, 36, 129, 0.98)',
    backgroundColor: '#EEF2FF', /* indigo-50 */
  },
  cardIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(8, 36, 129, 0.10)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardBody: {
    flex: 1,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#111827',
  },
  cardInfoRow: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardInfoText: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#111827',
  },
  cardFooterRow: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardChevron: {
    marginLeft: 12,
  },
  textReportTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textReportContentContainer: {
    marginTop: 4,
  },
  textReport: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: 'black',
  },
  textReportSecondary: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#6B7280',
  },
  syncChip: {
    marginTop: 4,
    height: 20,
    borderRadius: 10,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-end',
  },
  syncChipOk: {
    backgroundColor: '#DBEAFE', /* blue-100 */
    borderWidth: 1,
    borderColor: '#BFDBFE', /* blue-200 */
  },
  syncChipNo: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  syncChipText: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
  },
  syncChipTextOk: {
    color: '#1E3A8A', /* blue-800 */
  },
  syncChipTextNo: {
    color: '#7C2D12',
  },
  syncChipBelow: {
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  searchWithAddContainer: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  filtersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 4,
    marginTop: 12,
  },
  selectionBar: {
    marginTop: 12,
    marginHorizontal: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectionBarCount: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#111827',
  },
  selectionBarCancel: {
    height: 32,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  selectionBarCancelText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#374151',
  },
  selectionBarDelete: {
    height: 32,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  selectionBarDeleteText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: '#B91C1C',
  },
  filterChip: {
    paddingHorizontal: 12,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(8, 36, 129, 0.45)',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterChipActive: {
    backgroundColor: 'rgba(8, 36, 129, 0.98)',
    borderColor: 'rgba(8, 36, 129, 0.98)',
  },
  filterChipText: {
    fontFamily: 'Inter-Medium',
    color: 'rgba(8, 36, 129, 0.98)',
    fontSize: 14,
  },
  filterChipTextActive: {
    color: '#fff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: 'black',
  },
});

export default styles;