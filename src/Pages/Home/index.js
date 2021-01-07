import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Text,
  FlatList,
  View,
  Clipboard,Share
} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useDispatch, useSelector } from 'react-redux';
import {
  addScannedData,
  removeScannedData,
} from '../../Redux/ScannedData/ActionCreator';
import { Feather } from '@expo/vector-icons';
import { useActionSheet } from '@expo/react-native-action-sheet';
import Toast from 'react-native-simple-toast';

export default function Home(props) {
  // Global state
  const scannedData = useSelector((state) => state.scannedData);
  // Local state
  const [hasPermission, setHasPermission] = useState(false);
  // Action sheet provider
  const { showActionSheetWithOptions } = useActionSheet();

  const dispach = useDispatch();

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const scnaCode = () => {
    if (hasPermission) {
      props.navigation.navigate('Scanner', {
        onScnaFunc: (data) => {
          dispach(addScannedData(data));
        },
      });
      console.log('Scanning');
    } else {
      alert('No permission to camera.');
    }
  };

  const openActionSheet = (data, index) => {
    const options = ['Delete', 'Copy', 'Share', 'Cancel'];
    const destructiveButtonIndex = 0;
    const cancelButtonIndex = 3;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
      },
      (buttonIndex) => {
        if(buttonIndex == 0){
          dispach(removeScannedData(index));
          return;
        }
        if(buttonIndex == 1){
          copyToClipboard(data);
          return;
        }
        if(buttonIndex == 2){
          onShare(data.data);
          return;
        }
      }
    );
  };

  const onShare = async (data) => {
    try {
      const result = await Share.share({
        message: data,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          Toast.show("Shared successfullu")
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const copyToClipboard = (data) => {
    Clipboard.setString(data.data);
    Toast.show('Copied to clipboard.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={scannedData.data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => {
          return (
            <View style={styles.scannedData}>
              <Text style={styles.listNumber}>{index + 1}</Text>
              <TouchableOpacity
                onPress={() => openActionSheet(item, index)}
                style={{ flex: 8 }}>
                {item != '' ? (
                  <Text
                    numberOfLines={3}
                    style={{ fontSize: 15, fontWeight: '700' }}>
                    {item.data}
                  </Text>
                ) : null}
                {item != '' ? <Text>{item.type}</Text> : null}
              </TouchableOpacity>
            </View>
          );
        }}
      />
      <TouchableOpacity style={styles.button} onPress={scnaCode}>
        <Text style={{ fontSize: 17, fontWeight: '700', color: '#fff' }}>
          Scan code
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#3071ff',
    alignItems: 'center',
    margin: 20,
  },
  scannedData: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 3,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  listNumber: {
    paddingLeft: 10,
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
  },
});
