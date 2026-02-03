import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 0,
    backgroundColor: '#F8FAFC',
  },
  button: {
    marginTop: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  logo: {
    width: 84,
    height: 84,
    borderRadius: 16,
    marginBottom: 8,
  },
  appTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#0c2168',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(8, 36, 129, 0.18)',
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  titleContainer: {
    marginBottom: 16,
  },
  textTitle: {
    fontSize: 22,
    fontFamily: 'Inter-Bold',
    color: '#333',
    marginBottom: 4,
  },
  textSubtitle: {
    fontSize: 18,
    color: '#6B7280',
    fontFamily: 'Sansation-Light',
  },
  spacer: {
    height: 12,
  },
  forgotContainer: {
    marginTop: 8,
    alignItems: 'flex-end',
  },
  forgotText: {
    fontSize: 12,
    color: '#0c2168',
    fontFamily: 'Inter-Medium',
  },
});   

export default styles;