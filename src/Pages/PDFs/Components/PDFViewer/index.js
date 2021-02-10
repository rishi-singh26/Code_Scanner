import React, { useState, useEffect } from "react";
import PDFReader from "rn-pdf-reader-js";
import { ActivityIndicator } from "react-native";
import { useSelector } from "react-redux";
import Dilogue from "../../../../Shared/Components/Dilogue";

// const pdfUri = "http://unec.edu.az/application/uploads/2014/12/pdf-sample.pdf";
// const expoUri = "https://expo.io";
export default function PdfViewer(props) {
  // global state
  const theme = useSelector((state) => state.theme);
  // local state
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // props.navigation.setOptions({ title: props.route.params.title });
    setLoading(true);
  }, []);

  const { uri } = props.route.params;
  const { backOne, textOne } = theme.colors;

  return (
    <>
      {loading ? (
        <Dilogue
          dilogueVisible={loading}
          cancellable={false}
          dilogueBackground={backOne}
        >
          <ActivityIndicator size={35} color={textOne} />
        </Dilogue>
      ) : null}
      <PDFReader
        source={{
          uri: uri,
        }}
        noLoader={false}
        useGoogleReader={false}
        withPinchZoom={true}
        withScroll={true}
        onLoad={() => {
          // setLoading(false);
          console.log("on Load");
        }}
        onLoadEnd={() => {
          setLoading(false);
          console.log("on Load End");
        }}
        onError={(err) => {
          console.log("Load err", err);
        }}
      />
    </>
  );
}
