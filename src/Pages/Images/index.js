import React, { useEffect, useState } from 'react';
import { SafeAreaView, TouchableOpacity, View, StyleSheet, TextInput } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { auth, firestore } from '../../Constants/Api';
import { showSnack } from '../../Redux/Snack/ActionCreator';
import {
  decryptText,
  deleteImage,
  encryptText,
  openFile,
  pickImage,
  saveToDevice,
  shareThings,
  uploadImageToServer,
  uploadImageUrl,
} from '../../Shared/Functions';
import RenderImage from './Components/RenderImage';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { Feather, AntDesign } from '@expo/vector-icons';
import { showAlert } from '../../Redux/Alert/ActionCreator';
import Prompt from '../../Shared/Components/Prompt';
import CustomActivityIndicator from '../../Shared/Components/CustomActivityIndicator';
import { addImageUri } from '../../Redux/LocalURIs/ActionCreator';
import Collapsible from '../../Components/Accordian/Collapsable';

export default function Images(props) {
  const theme = useSelector((state) => state.theme);
  const { colors } = theme;
  const localUris = useSelector((state) => state.uris);
  const [images, setImages] = useState([]);
  const [imageName, setImageName] = useState('');
  const [showImageNamePrompt, setShowImageNamePrompt] = useState(false);
  const [uploadingImgData, setuploadingImgData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadingEncryptedImage, setuploadingEncryptedImage] = useState(false);
  const [passKey, setpassKey] = useState("");
  const [isPasskeyBoxVisible, setisPasskeyBoxVisible] = useState(false);
  const [showingPassKey, setShowingPassKey] = useState(false);

  const dispatch = useDispatch();
  const { showActionSheetWithOptions } = useActionSheet();

  /**
   * @param {Boolean} isEncrypted
   * is the image being picked encrypted, if yes then we will get the base64 string of the image being picked
   */
  const pickImgToBeUploaded = async (isEncrypted = false) => {
    if (isEncrypted && passKey === "") {
      dispatch(showSnack("Enter your passkey!"));
      return;
    }
    const { status, result } = await pickImage(isEncrypted);
    if (status && !result.cancelled) {
      setuploadingImgData(result);
      setShowImageNamePrompt(true);
      setuploadingEncryptedImage(isEncrypted);
    } else
      dispatch(showSnack('Oops!! Image not selected. Please try again'));
  };

  const uploadImage = async () => {
    try {
      setShowImageNamePrompt(false);
      setImageName('');
      // console.log(JSON.stringify(uploadingImgData, null, 4));
      if (imageName.length < 1) {
        dispatch(showSnack('Enter image name'));
        return;
      }
      dispatch(showSnack('Uploading image...'));
      const extension = uploadingImgData.uri
        .split('/')
        .pop()
        .split('.')
        .pop();
      console.log(extension);
      // check if the image being uploaded has to be encrypted or not
      if (uploadingEncryptedImage) {
        if (passKey === "") {
          dispatch(showSnack("Enter your passkey!"));
          return;
        }
        console.log("Uploading encrypted image");
        dispatch(showSnack("Encrypting image"));
        const encryptedImage = await encryptText(uploadingImgData.base64, passKey);
        if (encryptedImage.status) {
          dispatch(showSnack("Image encryption successfull"));
          uploadImageUrl(
            {
              uploadDate: new Date(),
              userId: auth.currentUser.uid,
              image: {
                data: encryptedImage.data,
                height: uploadingImgData.height,
                width: uploadingImgData.width,
              },
              isEncrypted: true,
              imageName: imageName + '.' + extension,
              isDeleted: false,
            },
            (message) => {
              dispatch(showSnack(message));
              getImages();
            }
          )
        } else {
          dispatch(showSnack("Error while encrypting image please try again"))
        }
      }
      else {
        const resp = await uploadImageToServer(
          {
            image: uploadingImgData.uri,
            name: imageName + '.' + extension,
          },
          true, // should upload image url to database
          auth.currentUser.uid,
          () => {
            dispatch(showSnack('Image uploaded'));
            getImages();
          }
        );
        setImageName('');
        setuploadingImgData(null);
        // console.log(resp);
      }
    } catch (err) {
      console.log(err.message);
      dispatch(showSnack('Error while uploading image', err.message));
    }
  };

  const setHeaderOptions = () => {
    props.navigation.setOptions({
      headerRight: () => {
        return (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity
              style={{ paddingVertical: 14, paddingHorizontal: 20 }}
              onPress={() => setisPasskeyBoxVisible(!isPasskeyBoxVisible)}
            >
              <Feather
                name="key"
                color={colors.textOne}
                size={21}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{ paddingVertical: 14, paddingHorizontal: 20 }}
              onPress={openEncryptionOptions}
              onLongPress={() =>
                props.navigation.navigate('UploadImages')
              }
              delayLongPress={10000}
            >
              <Feather
                name="paperclip"
                color={colors.textOne}
                size={21}
              />
            </TouchableOpacity>
          </View>
        );
      },
    });
  };

  const openImageOptions = (image) => {
    const options = ['Delete', 'Share', 'Cancel'];
    const destructiveButtonIndex = 0;
    const cancelButtonIndex = 2;
    const containerStyle = { backgroundColor: colors.backTwo };
    const textStyle = { color: colors.textOne };
    const icons = [
      <Feather name={'trash'} size={19} color={colors.primaryErrColor} />,
      <Feather name={'share'} size={20} color={colors.textOne} />,
      <Feather name={'x'} size={20} color={colors.textOne} />,
    ];

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
        icons,
        containerStyle,
        textStyle,
      },
      async (buttonIndex) => {
        if (buttonIndex == 0) {
          if (image.isEncrypted) {
            if (passKey === "") {
              dispatch(showSnack("Enter your passkey!"));
              return;
            }
            const decryptedImage = await decryptText(image.image.data, passKey);
            if (!decryptedImage.status) {
              dispatch(showSnack("Incorrect passkey!"));
              return;
            }
          }
          dispatch(
            showAlert(
              'Do you want to delete this image?',
              'It can not be recovered later!',
              () => {
                deleteImage(image, (message) => {
                  dispatch(showSnack(message));
                  getImages();
                });
              }
            )
          );
          return;
        }
        if (buttonIndex == 1) {
          openORShareImage(image, 2);
          return;
        }
      }
    );
  };

  const openEncryptionOptions = (image) => {
    const options = [
      'Upload an image',
      'Upload encrypted image',
      'Cancel',
    ];
    const destructiveButtonIndex = 2;
    const cancelButtonIndex = 2;
    const containerStyle = { backgroundColor: colors.backTwo };
    const textStyle = { color: colors.textOne };
    const icons = [
      <AntDesign name={"warning"} size={20} color={colors.textOne} />,
      <AntDesign name={"Safety"} size={21} color={colors.textOne} />,
      <AntDesign name={"close"} size={20} color={colors.primaryErrColor} />,
    ];

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
        icons,
        containerStyle,
        textStyle,
      },
      async (buttonIndex) => {
        if (buttonIndex == 0) {
          pickImgToBeUploaded();
          return;
        }
        if (buttonIndex == 1) {
          pickImgToBeUploaded(true);
          return;
        }
      }
    );
  };

  const getImages = () => {
    console.log('Getting images');
    setIsLoading(true);
    if (!auth.currentUser) {
      dispatch(showSnack("Authentication error, logout and login again"));
      return;
    }
    firestore
      .collection('scannerImages')
      // .where("isDeleted", "==", false)
      .where('userId', '==', auth.currentUser.uid)
      // .orderBy("uploadDate", "asc")
      .limit(100)
      .get()
      .then((images) => {
        let imageSnapshot = [];
        images.docs.map((item) => {
          const _id = item.id;
          const data = item.data();
          imageSnapshot.push({ _id, ...data });
        });
        setImages(imageSnapshot);
        // console.log("Received query snapshot of size", imageSnapshot.length);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err.message);
        dispatch(
          showSnack('Error while loading image', err.message)
        );
        setIsLoading(false);
      });
  };

  const openORShareImage = async (imageData, openOrShare = 0) => {
    try {
      setIsLoading(true);
      // encrypted image
      if (imageData.isEncrypted) {
        if (passKey === "") {
          dispatch(showSnack("Enter your passkey!"));
          setIsLoading(false);
          return;
        }
        const decryptedImage = await decryptText(imageData.image.data, passKey);
        if (!decryptedImage.status) {
          dispatch(showSnack("Incorrect passkey!"));
          setIsLoading(false);
          return;
        }
        var base64 = `data:image/png;base64,${decryptedImage.data}`;
        props.navigation.navigate("ImageViewer", {
          imgData: { image: base64, imageName: imageData.imageName },
          removeImage: null,
          imageStyle: { aspectRatio: imageData.image.width / imageData.image.height }
        })
        setIsLoading(false);
        return;
      }
      // not encrypted image
      else {
        // check if this uri is present in global state (ie. in localUris.imageURIs array)
        let indexOfLocalURI = localUris.imageURIs.findIndex(
          (x) => x.id === imageData._id
        );
        // present
        if (indexOfLocalURI >= 0) {
          // check if we want to view the image or share the image
          if (openOrShare === 1) {
            // view
            openFile(localUris.imageURIs[indexOfLocalURI].uri)
              ? null
              : dispatch(
                showSnack(
                  'Opps!! Error while opening image, please try again.'
                )
              );
            setIsLoading(false);
          } else if (openOrShare === 2) {
            // share
            shareThings(localUris.imageURIs[indexOfLocalURI].uri)
              ? null
              : dispatch(
                showSnack(
                  'Opps!! Error while sharing image, please try again.'
                )
              );
            setIsLoading(false);
          } else {
            setIsLoading(false);
          }
        }
        // not present
        else {
          // console.log("not present");
          // save to device
          const { status, localUri } = await saveToDevice(
            imageData.image,
            imageData.imageName
          );
          // check save status
          if (!status) {
            dispatch(
              showSnack(
                'Opps!! Error while opening image, please try again.'
              )
            );
            setIsLoading(false);
            return;
          }
          // add uri to global store for reuse
          dispatch(addImageUri({ id: imageData._id, uri: localUri.uri }));
          // check if we want to view the image or share the image
          if (openOrShare === 1) {
            // view
            openFile(localUri.uri)
              ? null
              : dispatch(
                showSnack(
                  'Opps!! Error while opening image, please try again.'
                )
              );
            setIsLoading(false);
          } else if (openOrShare === 2) {
            // share
            shareThings(localUri.uri)
              ? null
              : dispatch(
                showSnack(
                  'Opps!! Error while sharing image, please try again.'
                )
              );
            setIsLoading(false);
          }
        }
      }
    } catch (err) {
      dispatch(
        showSnack('Opps!! Error while opening image.' + err.message)
      );
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setHeaderOptions();
  }, [isPasskeyBoxVisible, passKey]);

  useEffect(() => {
    getImages();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.backOne }}>
      {isLoading && <CustomActivityIndicator />}
      <Collapsible collapsed={!isPasskeyBoxVisible}>
        <View style={[styles.passKeyBox, { backgroundColor: colors.backOne }]}>
          <View
            style={[
              styles.keyBoxContainer,
              { backgroundColor: colors.backTwo },
            ]}
          >
            <TextInput
              style={[styles.keyBox, { color: colors.textOne }]}
              placeholder="Enter password key"
              placeholderTextColor={colors.textTwo}
              value={passKey}
              onChangeText={(t) => setpassKey(t)}
              secureTextEntry={!showingPassKey}
            />
            {passKey.length > 0 && (
              <Feather
                name="x"
                size={18}
                color={colors.textTwo}
                style={{ padding: 8, paddingRight: 12 }}
                onPress={() => setpassKey("")}
              />
            )}
          </View>
          <Feather
            name={showingPassKey ? "eye-off" : "eye"}
            size={18}
            color={colors.textTwo}
            style={{ padding: 8, paddingRight: 10, paddingLeft: 12 }}
            onPress={() => setShowingPassKey(!showingPassKey)}
          />
        </View>
      </Collapsible>
      <RenderImage
        images={images}
        onPress={(imgData) => openORShareImage(imgData, 1)}
        onLongPress={(imgData) => openImageOptions(imgData)}
      />
      <Prompt
        title={'Enter image name'}
        text={imageName}
        setText={(txt) => setImageName(txt)}
        onCancelPress={() => {
          setShowImageNamePrompt(false);
          setImageName('');
          setuploadingImgData(null);
        }}
        onOkPress={uploadImage}
        visible={showImageNamePrompt}
        hotBtnText={'Upload Image'}
        placeholderTxt={'Image name (without extension)'}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  passKeyBox: {
    padding: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  keyBoxContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 8,
    flex: 1,
  },
  keyBox: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    flex: 1,
  },
})
