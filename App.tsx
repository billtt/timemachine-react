import {useEffect, useState} from "react";
import {SafeAreaView, FlatList, StyleSheet, Text, View, RefreshControl, ActivityIndicator} from 'react-native';
import { SearchBar, Button } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DatePicker from 'react-native-date-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import AddModal from './AddModal';
import LoginModal from './LoginModal';
import Utils from './Utils';

const _global = {
  token: '',
};

export default function App() {
  const [refreshing, setRefreshing] = useState(false);
  const [listData, setListData] = useState([]);
  const [date, setDate] = useState(new Date());
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchMode, setSearchMode] = useState(false);

  const changeDate = (dayOffset:number) => {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + dayOffset);
    setDate(newDate);
  };

  const login = async (username:string, password:string) => {
    setLoginModalVisible(false);
    let json = await Utils.fetchJson('/api/login', null, {username: username, password: password});
    if (!json || json.code !== 0) {
      if (json) {
        console.log('Login error: ' + json.code);
      }
      setLoginModalVisible(true);
    } else {
        try {
            await AsyncStorage.setItem('TOKEN', json.token);
            _global.token = json.token;
            loadList();
        } catch (error) {
          console.log(error);
            setLoginModalVisible(true);
        }
    }
  };

  const loadList = async()=> {
    if (_global.token === '') {
        return;
    }
    setListData([]);
    setRefreshing(true);
    let json = await Utils.fetchJson('/api/list', _global.token, {date: date.toDateString()});
    if (!json || json.code !== 0) {
      if (json) {
        console.log('List error: ' + json.code);
      }
      setRefreshing(false);
    } else {
      setListData(json.slices);
      setRefreshing(false);
    }
  };

  const addSlice = async(content:string, addDate:Date) => {
    setAddModalVisible(false);
      if (_global.token === '') {
          return;
      }
    let json = await Utils.fetchJson('/api/add', _global.token, {content: content, date: addDate.toISOString()});
    if (!json || json.code !== 0) {
      if (json) {
        console.log('Add error: ' + json.code);
      }
    } else {
      if (addDate.toDateString() === date.toDateString()) {
        loadList();
      } else {
        setDate(addDate);
      }
    }
  };

  const search = async() => {
    if (_global.token === '') {
        return;
    }
    if (searchText.trim() === '') {
        if (searchMode) {
            setSearchMode(false);
            loadList();
        }
        return;
    }
    setListData([]);
    setRefreshing(true);
    setSearchMode(true);
    let json = await Utils.fetchJson('/api/search', _global.token, {search: searchText});
    if (!json || json.code !== 0) {
      if (json) {
        console.log('Search error: ' + json.code);
      }
      setRefreshing(false);
    } else {
      setListData(json.slices);
      setRefreshing(false);
    }
  };

  const clearSearch = () => {
      if (searchMode) {
            setSearchMode(false);
            loadList();
      }
  };

  const refresh = () => {
    if (searchMode) {
        search();
    } else {
        loadList();
    }
  };

  useEffect(() => {
    init();
  }, []);

  useEffect(()=>{
    loadList()
  }, [date]);

  // main routine goes here
  const init = async () => {
    try {
      const token = await AsyncStorage.getItem('TOKEN');
      if (token == null) {
        setLoginModalVisible(true);
      } else {
        _global.token = token;
        loadList();
      }
    } catch (error) {
      // Error retrieving data
    }
  };

  return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.titleView}>Time Machine</Text>
        <View style={styles.searchView}>
          <SearchBar placeholder='Search' value={searchText} onChangeText={(text)=>{setSearchText(text)}} onSubmitEditing={search} onClear={clearSearch} platform='ios'/>
        </View>
        <View style={styles.dateView}>
          <Button type='clear' icon={{name: 'arrow-back-ios', size: 16, color: 'gray'}} onPress={()=>changeDate(-1)}></Button>
          <Button type='clear' title={date.toDateString()} onPress={()=>setDatePickerOpen(true)} titleStyle={{fontSize: 16, color: 'gray'}}></Button>
          <Button type='clear' icon={{name: 'arrow-forward-ios', size: 16, color: 'gray'}} onPress={()=>changeDate(1)}></Button>
        </View>
        {refreshing ? <ActivityIndicator /> : null}
        <FlatList
            style={styles.listView}
            data={listData}
            renderItem={ListItemView}
            ItemSeparatorComponent={ListSeparatorView}
            ListEmptyComponent={ListEmptyView}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={refresh} />
            }
        />
        <DatePicker
            modal
            mode='date'
            open={datePickerOpen}
            date={date}
            onConfirm={(date)=>{setDate(date);setDatePickerOpen(false);}}
            onCancel={()=>{setDatePickerOpen(false);}}
        />
        <View style={styles.addButton}>
          <Button
              icon={{
                name: "add-circle",
                size: 36,
                color: "orange"}}
              type='clear'
              titleStyle={{color: 'orange'}}
              onPress={()=>setAddModalVisible(true)}
          />
        </View>
        <AddModal
            visible={addModalVisible}
            onCancel={()=>setAddModalVisible(false)}
            onOK={addSlice}
        />
        <LoginModal
            visible={loginModalVisible}
            onOK={login}
        />
      </SafeAreaView>
  );
}

const ListEmptyView = () => {
    return (
        //View to show when list is empty
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No slices found.</Text>
        </View>
    );
};

const ListItemView = ({item, index}) => {
  const date = new Date(item.time);
  return (
      <View style={styles.listItem}>
        <Text style={styles.listText}>{item.content}</Text>
        <Text style={styles.listTime}>{Utils.simpleDateTime(date)}</Text>
      </View>
  );
};

const ListSeparatorView = () => {
  return (
      //Item Separator
      <View
          style={styles.separator}
      />
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  titleView: {
    width: '100%',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  searchView: {
    width: '100%',
  },
  dateView: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 20,
    paddingRight: 20
  },
  listView: {
    width: '100%',
    marginTop: 10,
    marginBottom: 5,
  },
  listItem: {
    padding: 20,
  },
  listText: {
    marginTop: 3,
    fontSize: 16,
    color: '#555',
  },
  listTime: {
    marginTop: 3,
    fontSize: 14,
    color: '#aaa',
  },
  emptyContainer: {
      paddingTop: 100,
      alignItems: 'center',
  },
  emptyText: {
      fontSize: 15,
      color: 'gray',
  },
  separator: {
    height: 1,
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#eee'
  },
  addButton: {
    position: 'absolute',
    bottom: 60,
    right: 25,
  },
});
