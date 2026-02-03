import NetInfo from "@react-native-community/netinfo";

export const isConnectedNetwork = async () => {
    const netInfo = await NetInfo.fetch();

    return netInfo.isConnected || false;
}