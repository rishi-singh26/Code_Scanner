import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { MaterialIcons } from "@expo/vector-icons";
import { copyToClipboard, getLocation } from "../Functions/index";
import { geoCoderApi } from "../../Constants/Api";
import Assets from "../../../assets/index";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../Styles";
import { useDispatch, useSelector } from "react-redux";
import { showSnack } from "../../Redux/Snack/ActionCreator";
import { night } from "../Styles/MapStyles";

const ASPECT_RATIO = SCREEN_WIDTH / SCREEN_HEIGHT;
const LATITUDE_DELTA = 0.007;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default function MapBox(props) {
  const theme = useSelector((state) => state.theme);
  const { colors } = theme;
  const [region, setRegion] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [mapType, setMapType] = useState("standard");
  const mapRef = useRef(null);

  const dispatch = useDispatch();

  const animateTUserLocation = async () => {
    // console.log("Animating to location");
    const { location, errmess, status } = await getLocation();
    const latLong = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
    if (status) {
      setRegion(latLong);
      props.regionSetter(latLong);
    }
    mapRef.current.animateToRegion({
      ...latLong,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    });
  };

  const getGeoCode = async (latitude, longitude) => {
    props.addressSetter("Loading...");
    const url = geoCoderApi(latitude, longitude);
    try {
      const response = await fetch(url);
      const addressData = await response.json();
      const { total_results, results } = addressData;
      props.addressSetter(results);
    } catch (err) {
      dispatch(showSnack("Could not get your location,", err.message));
      console.log(err.message);
    }
  };

  const onRegionChange = (region) => {
    // console.log("Changing region");
    const { latitude, longitude, latitudeDelta, longitudeDelta } = region;
    getGeoCode(latitude, longitude);
    props.regionSetter({ latitude, longitude });
  };

  const changeMapType = () => {
    setMapType(mapType == "standard" ? "hybrid" : "standard");
  };

  useEffect(() => {
    props?.oneCoordinate ? null : animateTUserLocation();
  }, []);

  return (
    <View style={{ height: props.height }}>
      <MapView
        ref={mapRef}
        onRegionChangeComplete={props?.oneCoordinate ? null : onRegionChange}
        showsUserLocation={true}
        style={styles.mapStyle}
        initialRegion={
          props?.oneCoordinate
            ? {
                ...props.oneCoordinate,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
              }
            : {
                latitude: region.latitude,
                longitude: region.longitude,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
              }
        }
        mapType={mapType}
        customMapStyle={theme.mode ? [] : night}
      >
        {props?.oneCoordinate ? (
          <Marker coordinate={props.oneCoordinate}></Marker>
        ) : null}
      </MapView>
      {props?.oneCoordinate ? null : (
        <Image style={[styles.pin, props.pinStyle]} source={Assets.pin} />
      )}
      <TouchableOpacity
        onPress={animateTUserLocation}
        style={[styles.myLocationBtn, { backgroundColor: colors.primaryColor }]}
      >
        <MaterialIcons name="my-location" size={22} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={changeMapType}
        style={[
          styles.myLocationBtn,
          { backgroundColor: colors.backOne, top: 60 },
        ]}
      >
        <MaterialIcons name={"layers"} size={22} color={colors.textOne} />
      </TouchableOpacity>
      {props?.oneCoordinate ? (
        <TouchableOpacity
          onPress={() => {
            mapRef.current.animateToRegion({
              ...props.oneCoordinate,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            });
          }}
          style={[
            styles.myLocationBtn,
            { backgroundColor: colors.primaryErrColor, top: 110 },
          ]}
        >
          <MaterialIcons name="my-location" size={22} color="#fff" />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  mapStyle: {
    ...StyleSheet.absoluteFillObject,
  },
  myLocationBtn: {
    borderRadius: 7,
    position: "absolute",
    zIndex: 1000,
    top: 10,
    right: 10,
    padding: 8,
  },
  pin: {
    height: 55,
    width: 55,
    position: "absolute",
    zIndex: 1000,
    alignSelf: "center",
    top: "43%",
    right: "41.5%",
  },
});
