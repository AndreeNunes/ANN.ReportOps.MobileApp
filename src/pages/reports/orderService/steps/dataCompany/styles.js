import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
        marginBottom: 16,
        marginTop: 8,
    },
    errorText: {
        fontSize: 22,
        fontFamily: 'Inter-SemiBold',
        color: 'black',
        marginBottom: 16,
        marginTop: 8,
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
    headerContainer: {
        flex: 1,
        padding: 16,
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
    resultsHint: {
        marginTop: 8,
        fontSize: 12,
        color: '#6B7280',
        fontFamily: 'Inter-Regular',
    }
});

export default styles;