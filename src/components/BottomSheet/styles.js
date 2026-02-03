import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    content: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
        padding: 8,
    },  
    header: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "center",
        padding: 8,
        alignItems: "center",
    },
    line: {
        height: 1,
        width: "100%",
        backgroundColor: "#bbb",
        marginBottom: 16,
    },
    title: {
        fontSize: 16,
        fontFamily: "Inter-Bold",
        color: "#333",
    },
    backdrop: { 
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
});

export default styles;