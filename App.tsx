import {useEffect, useState} from "react";
import {SafeAreaView, FlatList, StyleSheet, Text, View, RefreshControl, ActivityIndicator} from 'react-native';
import { SearchBar, Button } from 'react-native-elements';
import DatePicker from 'react-native-date-picker';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function App() {
  const [refreshing, setRefreshing] = useState(true);
  const [listData, setListData] = useState([]);
  const [date, setDate] = useState(new Date());
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const loadList = () => {
    const DATA = [
      {text: 'Hello, world! 你好呀😄', time: 1680437460},
      {text: 'Hello, world! 你好呀😄', time: 1680437460},
      {text: 'Hello, world! 你好呀😄', time: 1680437460},
      {text: 'Hello, world!', time: 1680437460},
      {text: 'Hello, world!', time: 1680437460},
      {text: 'Hello, world!', time: 1680437460},
      {text: 'Hello, world! 你好呀😄', time: 1680437460},
      {text: 'Hello, world!', time: 1680437460},
      {text: 'Hello, world!', time: 1680437460},
      {text: 'Hello, world!', time: 1680437460},
      {text: 'Hello, world!', time: 1680437460},
      {text: 'Hello, world!', time: 1680437460},
      {text: 'Hello, world!', time: 1680437460},
      {text: 'Hello, world! Super long! Super long! Super long! Super long! Super long! Super long! Super long! Super long!', time: 1680437460},
      {text: 'Hello, world!', time: 1680437460},
      {text: 'Hello, world!', time: 1680437460},
      {text: 'Hello, world!', time: 1680437460},
      {text: 'Hello, world!', time: 1680437460},
      {text: 'Hello, world!', time: 1680437460},
      {text: 'Hello, world!', time: 1680437460},
      {text: 'Hello, world!', time: 1680437460},
      {text: 'Hello, world!', time: 1680437460},
    ];
    setTimeout(() => {
      setListData(DATA);
      setRefreshing(false);
    }, 1000);
    // fetch('https://randomuser.me/api/?results=8')
    //     .then((response) => response.json())
    //     .then((responseJson) => {
    //       setRefreshing(false);
    //       var newdata = userData.concat(responseJson.results);
    //       setUserData(newdata);
    //     })
    //     .catch((error) => {
    //       console.error(error);
    //     });
  };

  const changeDate = (dayOffset) => {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + dayOffset);
    setDate(newDate);
    setListData([]);
    setRefreshing(true);
    loadList();
  };

  useEffect(() => {
    loadList();
  }, []);

  return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.titleView}>Time Machine</Text>
        <View style={styles.searchView}>
          <SearchBar placeholder='Search' platform='ios'/>
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
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={loadList} />
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
                size: 18,
                color: "orange"}}
              type='clear'
              title='Add'
              titleStyle={{color: 'orange'}}
          />
        </View>
      </SafeAreaView>
  );
}

const ListItemView = ({item, index}) => {
  const date = new Date(item.time * 1000);
  const dateText = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes();
  return (
      <View style={styles.listItem}>
        <Text style={styles.listText}>{item.text}</Text>
        <Text style={styles.listTime}>{dateText}</Text>
      </View>
  );
}

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
    fontSize: 18,
    color: '#555',
  },
  listTime: {
    fontSize: 15,
    color: '#aaa',
  },
  separator: {
    height: 1,
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#eee'
  },
  addButton: {
    position: 'absolute',
    bottom: 50,
    right: 30,
  },
});
