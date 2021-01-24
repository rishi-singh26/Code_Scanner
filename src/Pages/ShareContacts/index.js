import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
} from "react-native";
import Header from "../../Shared/Components/Header";
import * as ContactsAPI from "expo-contacts";
import { createQRString, searchContacts } from "../../Shared/Functions";
import CollapsibleSearchBar from "../../Shared/Components/CollapsibleSearchBar";

export default function Contacts(props) {
  const [contacts, setContacts] = useState([]);
  const [isSearchBarCollapsed, setIsSearchBarCollapsed] = useState(true);
  const [searchKey, setSearchKey] = useState("");

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
          backgroundColor: "#fff",
          paddingVertical: 20,
          paddingHorizontal: 20,
        }}
      >
        <Text style={{ fontSize: 16 }}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  const closeSearchBar = () => {
    setSearchKey("");
    setIsSearchBarCollapsed(true);
    searchKey.length > 0 ? getContacts() : null;
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

  return (
    <SafeAreaView>
      <Header
        title={"Contacts"}
        showSearchIcon
        onSearchIconPress={() => setIsSearchBarCollapsed(!isSearchBarCollapsed)}
        // iconRightName={"refresh-cw"}
      />
      {/* Search bar */}
      <CollapsibleSearchBar
        collapsed={isSearchBarCollapsed}
        onTextChange={(text) => searchContactsData(text)}
        onXPress={() => {
          closeSearchBar();
        }}
        searchKey={searchKey}
      />
      {/* {isSearchBarCollapsed ? null : <Text>Hola</Text>} */}
      <FlatList
        data={contacts}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderContact}
      />
    </SafeAreaView>
  );
}
