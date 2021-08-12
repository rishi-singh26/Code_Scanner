import React from "react";
import {
  FlatList,
  Image as RNImage,
  TouchableOpacity,
  View,
  StyleSheet,
  Text,
} from "react-native";
import { useSelector } from "react-redux";
import { SCREEN_WIDTH } from "../../../Shared/Styles";
import { Feather, Ionicons } from "@expo/vector-icons";

export default function RenderImage({ images, onPress, onLongPress }) {
  const theme = useSelector((state) => state.theme);
  const { colors } = theme;
  return (
    <FlatList
      numColumns={3}
      data={images}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item, index }) => {
        // console.log(item.isAddBtn ? "Its the add btn" : item.image);
        // console.log(item);
        return (
          <View>
            {/* <Text onPress={() => Linking.openURL(item.image)}>
              {JSON.stringify(item, null, 4)}
            </Text> */}
            <TouchableOpacity
              onPress={() => (item.isAddBtn ? item.onPress() : onPress(item))}
              onLongPress={() => onLongPress(item)}
            >
              {item.isAddBtn ? (
                <View
                  style={[
                    styles.viewBox,
                    {
                      backgroundColor: colors.primarySuperFadedColor,
                      alignItems: "center",
                      justifyContent: "center",
                    },
                  ]}
                >
                  <Feather name="plus" size={50} color={"#fff"} />
                </View>
              ) : (
                <View style={styles.viewBox}>
                  {item.isEncrypted ?
                    <View style={[
                      styles.image,
                      { backgroundColor: "#32a852", alignItems: "center", justifyContent: "center" },
                    ]}><Ionicons size={70} name={"shield-checkmark-outline"} color={"#fff"} /></View> :
                    <RNImage
                      source={{ uri: item.image }}
                      style={[
                        styles.image,
                        { backgroundColor: colors.backThree },
                      ]}
                    />}
                  <Text
                    numberOfLines={1}
                    style={{
                      color: colors.textOne,
                      alignSelf: "center",
                      marginTop: 5,
                    }}
                  >
                    {item.imageName}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  viewBox: {
    width: SCREEN_WIDTH / 3 - 16,
    height: SCREEN_WIDTH / 3 - 16,
    marginTop: 12,
    marginLeft: 12,
    marginBottom: 30,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 4,
  },
});
