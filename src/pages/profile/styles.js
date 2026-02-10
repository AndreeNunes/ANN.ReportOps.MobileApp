import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarWrap: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(8, 36, 129, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    color: '#0c2168',
    fontFamily: 'Inter-Bold',
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardHeaderTitle: {
    marginLeft: 8,
    fontSize: 16,
    color: '#0c2168',
    fontFamily: 'Inter-Bold',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  rowIcon: {
    width: 24,
    alignItems: 'center',
    marginRight: 8,
  },
  rowLabel: {
    fontSize: 13,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
    width: 108,
  },
  rowValue: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
    fontFamily: 'Inter-Regular',
  },
  warnBox: {
    backgroundColor: '#FEF3C7',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
    marginBottom: 12,
  },
  warnText: {
    color: '#92400E',
    fontSize: 13,
    fontFamily: 'Inter-Regular',
  },
  footer: {
    padding: 16,
  },
  button: {
    alignSelf: 'stretch',
  },
  loaderWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: '#B91C1C',
    fontSize: 14,
    marginTop: 8,
  },
});

export default styles;

