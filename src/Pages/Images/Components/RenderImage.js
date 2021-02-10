import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  FlatList,
  Image,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { useSelector } from "react-redux";
import { SCREEN_WIDTH } from "../../../Shared/Styles";

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
          <TouchableOpacity
            onPress={() =>
              item.isAddBtn ? item.onPress() : onPress(item.image)
            }
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
              <Image
                source={{ uri: item.image }}
                style={[styles.viewBox, { backgroundColor: colors.backThree }]}
              />
            )}
          </TouchableOpacity>
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
    borderRadius: 4,
  },
});
