import React from "react";
import {
  StyleSheet,
  TextInput,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

type SearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
};

export default function SearchBar({
  value,
  onChangeText,
}: SearchBarProps) {
  return (
    <View style={styles.container}>
      <Ionicons
        name="search-outline"
        size={22}
        color="#6B7280"
      />

      <TextInput
        placeholder="Search products..."
        placeholderTextColor="#9CA3AF"
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    borderRadius: 15,
    marginVertical: 15,
    elevation: 2,
  },

  input: {
    flex: 1,
    padding: 15,
    marginLeft: 8,
    fontSize: 16,
  },
});