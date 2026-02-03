import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFF'
  },
  title: {
    fontSize: 16,
    fontFamily: "Inter-Bold",
    color: "#333",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: "Inter-Bold",
    color: "#0c2168",
    marginBottom: 8,
    marginTop: 8,
  },
  summaryCard: {
    marginTop: 8,
    backgroundColor: 'rgba(8, 36, 129, 0.08)',
    borderColor: 'rgba(8, 36, 129, 0.24)',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    height: 100,
    justifyContent: 'space-between',
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'right'
  },
  summaryLabel: {
    fontFamily: "Inter-SemiBold",
    color: "#0c2168",
    fontSize: 12,
    width: 96,
    marginRight: 8,
    marginLeft: 6,
  },
  summaryValue: {
    flex: 1,
    fontFamily: "Inter-Regular",
    color: "#333",
    fontSize: 14,
    flexWrap: 'wrap',
  },
  cardTopic: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 68,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(8, 36, 129, 0.18)",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  cardLineSeparator: {
    height: 0,
    width: 1,
    borderLeftWidth: 1,
    borderLeftColor: "rgba(8, 36, 129, 0.34)",
    marginLeft: 24,
  },
  cardIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(8, 36, 129, 0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topicTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  titleCardTopic: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Inter-SemiBold",
    color: "#333",
  },
  subtitleCardTopic: {
    marginTop: 2,
    fontSize: 12,
    fontFamily: "Inter-Regular",
    color: "#6B7280",
  },
  actionsBlock: {
    marginTop: 16,
  },
  buttonSave: {
    marginTop: 16,
  },
});

export default styles;