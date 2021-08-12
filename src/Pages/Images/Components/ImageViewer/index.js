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

// const ZoomableImage = ({ show, setShow, imageSource }) => {
//   return (
//     <Modal
//       animationType={"fade"}
//       transparent={false}
//       visible={show}
//       onRequestClose={() => {
//         setShow(!show);
//       }}
//     >
//       <View style={styles.container}>
//         <WebView source={{ uri: imageSource }} style={styles.image} />
//       </View>
//     </Modal>
//   );
// };

export default function ImageViewer(props) {
  const theme = useSelector((state) => state.theme);
  const { colors } = theme;
  const { imgData, removeImage, imageStyle } = props.route.params;
  console.log({ imageStyle, name: imgData.imageName });

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
        {/* image here */}

        <PinchGestureHandler onGestureEvent={handlePinch}>
          <Animated.Image
            source={{ uri: imgData.image }}
            style={[
              styles.image,
              { transform: [{ scale }] },
              imageStyle ? imageStyle : { height: SCREEN_WIDTH - 20 },
            ]}
          />
        </PinchGestureHandler>
        <Text
          style={{ fontSize: 20, color: colors.textOne, marginHorizontal: 15 }}
        >
          {imgData.imageName}
        </Text>

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
    // height: SCREEN_WIDTH - 20,
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
