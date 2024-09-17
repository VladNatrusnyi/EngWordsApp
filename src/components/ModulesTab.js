import React, {useState, useMemo} from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import {COLORS} from "../COLORS";
import {AppInput} from "./appUI/AppInput";
import {ModulesAllList} from "./ModulesAllList";

import {useSelector} from "react-redux";

const FirstRoute = () => {

  const {currentTopics, modules} = useSelector(state => state.term)

  const [value, setValue] = useState('');


  const filteredModules = useMemo(() => {

    let filtered = modules

    if (currentTopics.length) {
      filtered = filtered.filter(el => !currentTopics.some(item => item.id === el.id));
    }

    if (value.trim()) {
      filtered = filtered.filter(el => el.title.toLowerCase().includes(value.toLowerCase()));
    }
    return filtered
  }, [value, modules, currentTopics])

  return (
    <View
      style={styles.scene}>
      <AppInput
        value={value}
        setValue={setValue}
        placeholder="Search"
        icon="search"
      />
      <ModulesAllList modules={filteredModules}/>
    </View>
  )
}


const SecondRoute = () => {

  const {currentTopics, modules} = useSelector(state => state.term)


  const filteredModules = useMemo(() => {
    return modules.filter(el => currentTopics.some(item => item.id === el.id));
  }, [modules, currentTopics])

  return (
    <View
      style={styles.scene}>
      <ModulesAllList modules={filteredModules}/>
    </View>
  )

}

const renderScene = SceneMap({
  first: SecondRoute,
  second:
  FirstRoute,
});

export const ModulesTab = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'first', title: 'Current modules'},
    {key: 'second', title: 'All modules'},
  ]);

  return (
    <TabView
      navigationState={{index, routes}}
      renderScene={renderScene}
      onIndexChange={setIndex}
      renderTabBar={props => (
        <TabBar
          {...props}
          indicatorStyle={styles.indicator}
          style={styles.tabBar}
          labelStyle={styles.label}
        />
      )}
    />
  );
};

const styles = StyleSheet.create({
  scene: {
    flex: 1,
    padding: 20,
    backgroundColor:
    COLORS.gray,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20
  },
  text: {
    fontSize: 18,
    color: '#333',
  },
  tabBar: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  },
  indicator: {
    backgroundColor: COLORS.primary,
  },
  label: {
    color: COLORS.dark,
    fontWeight: 'bold',
  },
});

