import React from "react";
import { FlatList, Image, TouchableOpacity } from "react-native";
import { SCREEN_WIDTH } from "../../../Shared/Styles";

export default function RenderAttachedImages({
  images,
  navigation,
  setImages,
  setImageViewCollapsed,
}) {
  return (
    <FlatList
      data={images}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item, index }) => {
        return (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("ImageViewer", {
                source: { uri: item.data },
                removeImage: () => {
                  const newImgsArr = [...images];
                  newImgsArr.splice(index, 1);
                  newImgsArr.length === 0 ? setImageViewCollapsed(true) : null;
                  setImages(newImgsArr);
                },
              });
            }}
            style={{
              padding: 8,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              source={{ uri: item.data }}
              style={{
                width: SCREEN_WIDTH / 3 - 10,
                height: SCREEN_WIDTH / 3 - 10,
                alignSelf: "center",
                borderRadius: 8,
              }}
            />
          </TouchableOpacity>
        );
      }}
    />
  );
}
