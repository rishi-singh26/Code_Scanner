import { Feather } from "@expo/vector-icons";
import React from "react";
import { FlatList, TouchableOpacity, View, Text } from "react-native";
import { useSelector } from "react-redux";
// import { openPdf } from "../../../Shared/Functions";
import { SCREEN_WIDTH } from "../../../Shared/Styles";

export default function RenderDocumnets({
  pdfs,
  setPdfs,
  setImageViewCollapsed,
}) {
  const theme = useSelector((state) => state.theme);
  const { colors } = theme;
  return (
    <FlatList
      horizontal
      data={pdfs}
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item, index }) => {
        // console.log("from renderer", item);
        const pdfFullName = item.data.uri.split("/").pop();
        const pdfExt = pdfFullName.split(".").pop();
        return (
          <TouchableOpacity
            style={{
              borderRadius: 8,
              backgroundColor: colors.backOne,
              padding: 10,
              margin: 8,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Feather
              name={"file-text"}
              size={35}
              color={colors.primaryErrColor}
              style={{ padding: 5 }}
            />
            <Text style={{ color: colors.textOne, padding: 15, fontSize: 16 }}>
              {index + "." + pdfFullName.substr(0, 10) + "..." + pdfExt}
            </Text>
            <TouchableOpacity
              onPress={() => {
                const currentPdfs = [...pdfs];
                currentPdfs.splice(index, 1);
                setPdfs(currentPdfs);
                currentPdfs.length === 0 ? setImageViewCollapsed(true) : null;
              }}
              style={{
                padding: 5,
                margin: 5,
                backgroundColor: colors.backTwo,
                padding: 6,
                borderRadius: 17,
              }}
            >
              <Feather
                name={"x-circle"}
                size={23}
                color={colors.primaryErrColor}
              />
            </TouchableOpacity>
          </TouchableOpacity>
        );
      }}
    />
  );
}
