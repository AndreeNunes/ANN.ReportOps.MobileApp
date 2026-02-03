import React, { useMemo } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import styles from "./styles";
import { Ionicons } from "@expo/vector-icons";

export default function BottomSheetComponent({ bottomSheetRef, children, title = "" }) {
  const snapPoints = useMemo(() => ["25%", "50%"], []);

  const Header = () => {
    return (
      <>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          
        </View>

        <View style={styles.line} />
      </>
    )
  }

  return (
      <BottomSheet ref={bottomSheetRef} index={-1} snapPoints={snapPoints} backdropComponent={BottomSheetBackdrop}>
        <BottomSheetView style={styles.content}>
          <Header />
          <View style={styles.contentContainer}>
            {children}
          </View>
        </BottomSheetView>
      </BottomSheet>
  );
}


