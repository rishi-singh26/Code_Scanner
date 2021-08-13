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
  StatusBar,
} from "react-native";
import { useSelector } from "react-redux";
import { PinchGestureHandler, PanGestureHandler } from "react-native-gesture-handler";
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
  // console.log({ imageStyle, name: imgData.imageName });

  const scale = React.useRef(new Animated.Value(1)).current;
  const translateX = React.useRef(new Animated.Value(0)).current;

  const handlePinch = Animated.event([{ nativeEvent: { scale } }]);

  const handlePan = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    {
      // listener: event => console.log("Pan gesture event: ", event.nativeEvent),
      useNativeDriver: false,
    }
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
      <StatusBar backgroundColor={"#000"} barStyle={"light-content"} animated />
      {/* <View style={styles.topBackBtnView}>
        <TouchableOpacity
          onPress={() => props.navigation.goBack()}
          style={[styles.topBackBtn, { backgroundColor: colors.backTwo }]}
        >
          <Feather name={"chevron-down"} size={25} color={colors.textOne} />
        </TouchableOpacity>
      </View> */}
      <View style={styles.imageContainer}>
        {/* image here */}
        <PanGestureHandler onGestureEvent={handlePan}>
          <PinchGestureHandler onGestureEvent={handlePinch}>
            <Animated.Image
              source={{ uri: imgData.image }}
              style={[
                styles.image,
                { transform: [{ scale }, { translateX }] },
                imageStyle ? imageStyle : { height: SCREEN_WIDTH - 20 },
              ]}
            />
          </PinchGestureHandler>
        </PanGestureHandler>
        <Text
          style={{ fontSize: 20, color: colors.textThree, marginHorizontal: 15 }}
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
              style={{ fontSize: 16, fontWeight: "700", color: colors.textThree }}
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
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: SCREEN_WIDTH,
    // height: SCREEN_WIDTH - 20,
    // borderRadius: 10,
    // marginHorizontal: 10,
  },
  removeImageBtn: {
    padding: 14,
    borderRadius: 8,
    marginBottom: 30,
    alignItems: "center",
    paddingHorizontal: 20,
  },
});
