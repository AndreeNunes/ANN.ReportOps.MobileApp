import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    headerContainer: {
        flex: 1,
        marginVertical: 16,
    },
    separator: {
        height: 1,
        backgroundColor: 'rgba(8, 36, 129, 0.98)',
        marginVertical: 24,
    },
    itemCard: {
        marginHorizontal: 16,
        marginBottom: 12,
        padding: 16,
        backgroundColor: 'rgba(8, 36, 129, 0.08)',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(8, 36, 129, 0.24)',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        flex: 1,
    },
    itemText: {
        fontSize: 16,
        fontFamily: 'Inter-SemiBold',
        color: 'black',
        flex: 1,
        flexWrap: 'wrap',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 16,
        fontFamily: 'Inter-SemiBold',
        color: 'black',
        textAlign: 'center',
        marginBottom: 16,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        fontFamily: 'Inter-SemiBold',
        color: 'black',
        textAlign: 'center',
        marginBottom: 16,
    },
    saveButtonContainer: {
        padding: 16,
        marginBottom: 16,
    },
});

export default styles;