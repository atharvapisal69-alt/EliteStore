import { StyleSheet, Text, View } from "react-native";

export default function Banner() {
  return (
    <View style={styles.container}>
      <Text style={styles.small}>
        LIMITED OFFER
      </Text>

      <Text style={styles.big}>
        UP TO 50% OFF
      </Text>

      <Text style={styles.desc}>
        Discover premium products at amazing prices.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#3B82F6",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },

  small: {
    color: "white",
    fontSize: 12,
  },

  big: {
    color: "white",
    fontWeight: "bold",
    fontSize: 28,
    marginVertical: 8,
  },

  desc: {
    color: "white",
    fontSize: 14,
  },
});