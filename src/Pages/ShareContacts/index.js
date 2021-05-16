import React, { useEffect, useState } from "react";
import { SafeAreaView, Text, FlatList, TouchableOpacity } from "react-native";
import * as ContactsAPI from "expo-contacts";
import { createQRString, searchContacts } from "../../Shared/Functions";
import CollapsibleSearchBar from "../../Shared/Components/CollapsibleSearchBar";
import { useSelector } from "react-redux";

export default function Contacts(props) {
  const [contacts, setContacts] = useState([]);
  const [searchKey, setSearchKey] = useState("");

  const theme = useSelector((state) => state.theme);
  const { colors } = theme;

  const getContacts = async () => {
    const { status } = await ContactsAPI.requestPermissionsAsync();
    if (status === "granted") {
      const { data } = await ContactsAPI.getContactsAsync({
        fields: [ContactsAPI.Fields.PhoneNumbers, ContactsAPI.Fields.Emails],
      });
      data.length > 0 ? setContacts(data) : null;
    }
  };

  const renderContact = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          // console.log(item);
          const sharableString = createQRString(item);
          props.navigation.navigate("ContactQR", {
            qrcodeVal: sharableString,
            contactData: item,
          });
        }}
        style={{
          backgroundColor: colors.backOne,
          paddingVertical: 20,
          paddingHorizontal: 20,
        }}
      >
        <Text style={{ fontSize: 16, color: colors.textOne }}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    getContacts();
  }, []);

  const searchContactsData = (searchKey) => {
    setSearchKey(searchKey);
    if (searchKey.length > 0) {
      const result = searchContacts(contacts, searchKey);
      setContacts(result);
    } else {
      getContacts();
    }
  };

  const closeSearch = () => {
    getContacts();
    setSearchKey("");
  };

  return (
    <SafeAreaView style={{ backgroundColor: colors.backOne }}>
      <CollapsibleSearchBar
        onTextChange={(text) => searchContactsData(text)}
        searchKey={searchKey}
        onXPress={closeSearch}
      />
      <FlatList
        data={contacts}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderContact}
      />
    </SafeAreaView>
  );
}
