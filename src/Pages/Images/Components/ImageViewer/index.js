import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  SafeAreaView,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Animated,
} from "react-native";
import { useSelector } from "react-redux";
import { PinchGestureHandler } from "react-native-gesture-handler";
import { SCREEN_WIDTH } from "../../../../Shared/Styles";

export default function ImageViewer(props) {
  const theme = useSelector((state) => state.theme);
  const { colors } = theme;
  const { source, removeImage } = props.route.params;
  // console.log(source);

  const scale = React.useRef(new Animated.Value(1)).current;

  const handlePinch = Animated.event([{ nativeEvent: { scale } }]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.backOne }}>
      <View style={styles.topBackBtnView}>
        <TouchableOpacity
          onPress={() => props.navigation.goBack()}
          style={[styles.topBackBtn, { backgroundColor: colors.backTwo }]}
        >
          <Feather name={"chevron-down"} size={25} color={colors.textOne} />
        </TouchableOpacity>
      </View>
      <View style={styles.imageContainer}>
        <Text style={{ fontSize: 30, color: colors.textOne, marginBottom: 60 }}>
          Image viewer
        </Text>
        {/* image here */}

        <PinchGestureHandler onGestureEvent={handlePinch}>
          <Animated.Image
            source={{ uri: source }}
            style={[styles.image, { transform: [{ scale }] }]}
          />
        </PinchGestureHandler>

        {removeImage ? (
          <TouchableOpacity
            onPress={() => {
              removeImage ? removeImage() : null;
              props.navigation.goBack();
            }}
            style={[styles.removeImageBtn, { backgroundColor: colors.backTwo }]}
          >
            <Text
              style={{ fontSize: 16, fontWeight: "700", color: colors.textOne }}
            >
              Remove Image
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  topBackBtnView: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 10,
  },
  topBackBtn: {
    padding: 14,
    borderRadius: 8,
  },
  imageContainer: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
  },
  image: {
    width: SCREEN_WIDTH - 20,
    height: SCREEN_WIDTH - 20,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  removeImageBtn: {
    padding: 14,
    borderRadius: 8,
    marginBottom: 30,
    alignItems: "center",
    paddingHorizontal: 20,
  },
});
