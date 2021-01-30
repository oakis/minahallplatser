import _ from "lodash";
import { connect } from "react-redux";
import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  FlatList,
  AppState,
  TouchableWithoutFeedback,
} from "react-native";
import firebase from "react-native-firebase";
import fetch from "react-native-cancelable-fetch";
import Icon from "react-native-vector-icons/MaterialIcons";
import {
  clearDepartures,
  clearErrors,
  favoriteCreate,
  favoriteDelete,
  favoriteLineToggle,
  favoriteLineLocalAdd,
  favoriteLineLocalRemove,
  getDepartures,
  incrementStopsOpened,
  setSetting,
} from "../actions";
import {
  DepartureListItem,
  Spinner,
  Message,
  ListItemSeparator,
  Popup,
  Text,
  MiniMenu,
} from "./common";
import { updateStopsCount, track, isAndroid } from "./helpers";
import { colors, component } from "./style";

const ShowDepartures = (props) => {
  const [init, setInit] = useState(true);
  const [showHelp, setShowHelp] = useState(false);
  const [miniMenuOpen, setMiniMenuOpen] = useState(false);
  const [timeformatVisible, setTimeformatVisible] = useState();

  useEffect(() => {
    firebase.analytics().setCurrentScreen("Departures", "Departures");
    // props.navigation.setParams({ toggleMiniMenu: this.toggleMiniMenu });
    track("Page View", {
      Page: "Departures",
      Stop: props.navigation.getParam("busStop"),
      Parent: props.navigation.getParam("parent"),
    });
    props.getDepartures({ id: props.navigation.getParam("id") });
    updateStopsCount();
    props.incrementStopsOpened(props.navigation.getParam("id"));
    startRefresh();
    AppState.addEventListener("change", handleAppStateChange);
    return () => {
      clearInterval(this.interval);
      this.interval = null;
      props.clearDepartures();
      props.clearErrors();
      fetch.abort("getDepartures");
      AppState.removeEventListener("change", handleAppStateChange);
    };
  }, []);

  // useEffect(() => {
  //   if (init) {
  //     props.navigation.setParams({ reloading: false });
  //     setInit(false);
  //   }
  //   const favoritesUpdated =
  //     JSON.stringify(this.props.favorites) !== JSON.stringify(favorites);
  //   const departuresUpdated =
  //     JSON.stringify(this.props.departures) !== JSON.stringify(departures);
  //   if (favoritesUpdated) {
  //     populateFavorites(favorites);
  //   }
  //   if (departuresUpdated) {
  //     populateDepartures(departures);
  //   }
  //   if (this.props.timestamp !== timestamp) {
  //     props.navigation.setParams({ reloading: false });
  //   }
  // }, [props.favorites, props.departures, props.timestamp])

  const handleAppStateChange = (nextAppState) => {
    clearInterval(this.interval);
    this.interval = null;
    props.clearDepartures();
    props.clearErrors();
    fetch.abort("getDepartures");
    if (nextAppState === "active") {
      props.getDepartures({ id: props.navigation.getParam("id") });
      startRefresh();
      track("Page View", {
        Page: "Departures",
        Stop: props.navigation.getParam("busStop"),
        Parent: "Background",
      });
    }
  };

  const saveAsFavorite = () => {
    setMiniMenuOpen(false);
    props.favoriteCreate({
      busStop: props.navigation.getParam("busStop"),
      id: props.navigation.getParam("id"),
    });
  };

  const deleteFavorite = () => {
    setMiniMenuOpen(false);
    props.favoriteDelete(props.navigation.getParam("id"));
  };

  const renderMiniMenu = () => {
    return (
      <MiniMenu
        isVisible={miniMenuOpen}
        onClose={() => setMiniMenuOpen(false)}
        items={[
          {
            icon: "access-time",
            content: "Ändra tidsformat",
            onPress: openTimeformat,
          },
          {
            icon: "star",
            content: _.includes(
              props.favoriteStopIds,
              props.navigation.getParam("id")
            )
              ? "Ta bort favorit"
              : "Lägg till favorit",
            onPress: _.includes(
              props.favoriteStopIds,
              props.navigation.getParam("id")
            )
              ? deleteFavorite
              : saveAsFavorite,
          },
          {
            icon: "help",
            content: "Hjälp",
            onPress: openPopup,
          },
        ]}
      />
    );
  };

  const renderTimeformat = () => {
    return (
      <MiniMenu
        isVisible={timeformatVisible}
        onClose={() => setTimeformatVisible(false)}
        items={[
          {
            content: "Minuter",
            onPress: () => onTimeValueChange("minutes"),
          },
          {
            content: "Klockslag",
            onPress: () => onTimeValueChange("clock"),
          },
        ]}
      />
    );
  };

  const openTimeformat = () => {
    setMiniMenuOpen(false);
    setTimeout(() => {
      setTimeformatVisible(true);
    }, 1);
  };

  const toggleMiniMenu = () => {
    setMiniMenuOpen(prev => !prev);
  };

  const onTimeValueChange = (itemValue) => {
    props.setSetting("timeFormat", itemValue);
    setTimeformatVisible(false);
  };

  const startRefresh = () => {
    // const self = this;
    // self.interval = setInterval(self.refresh.bind(self), 10000);
  };

  const refresh = () => {
    props.navigation.setParams({ reloading: true });
    props.getDepartures({ id: props.navigation.getParam("id") });
  };

  const populateFavorites = (favorites) => {
    window.log("Updated favorites:", favorites);
    // this.props.favorites = favorites;
  };

  const populateDepartures = (departures) => {
    window.log("Updated departures:", departures);
    // this.props.departures = departures;
  };

  const ListFooterComponent = () => {
    return props.departures.length === 0 ||
      props.favorites.length === 0 ? null : (
      <View style={{ height: 5, backgroundColor: colors.primary }} />
    );
  };

  const openPopup = () => {
    track("Show Help", { Page: "Departures" });
    setMiniMenuOpen(false);
    setTimeout(() => {
      setShowHelp(true);
    }, 1);
  };

  const renderDepartures = ({ item, index }) => {
    const { timeFormat } = props;
    const itemWithNewIndex = { ...item, index, timeFormat };
    return (
      <DepartureListItem
        item={itemWithNewIndex}
        onPress={() => {
          props.favoriteLineToggle(item);
        }}
        onLongPress={() => {
          const localFavorites = props.favorites.filter(
            (favorite) => favorite.local
          );
          const localLines = localFavorites.map(({ sname, direction }) =>
            `${sname} ${direction}`.replace("X", "")
          );
          if (
            _.includes(
              localLines,
              `${item.sname} ${item.direction}`.replace("X", "")
            )
          ) {
            props.favoriteLineLocalRemove(
              item,
              props.navigation.getParam("id")
            );
          } else {
            props.favoriteLineLocalAdd(item, props.navigation.getParam("id"));
          }
        }}
      />
    );
  };

  const closePopup = () => setShowHelp(false);

  const renderPopup = () => {
    return (
      <Popup onPress={closePopup} isVisible={showHelp}>
        <Text style={component.popup.header}>När går nästa avgång?</Text>
        <Text style={component.popup.text}>
          Längst till höger på varje rad står det antal minuter kvar till nästa
          avgång samt avgången efter det.{" "}
          <Text style={{ fontStyle: "italic" }}>
            Det går även att ändra avgångstiden till klockslag, och det gör du i
            menyn på startsidan.
          </Text>
        </Text>

        <Text style={component.popup.header}>
          Varför har tiden till nästa avgång ibland färg?
        </Text>
        <Text style={component.popup.text}>
          När en avgång snart ska gå från en hållplats så kommer alltid texten
          &quot;<Text style={{ color: colors.danger }}>Nu</Text>&quot; att visas
          med röd färg. Ibland kan man också se att en avgång har{" "}
          <Text style={{ color: colors.warning }}>orange</Text> text. Det kan
          t.ex betyda att en buss har tappat anslutningen med Västtrafik och
          inte längre är live. Tiden som visas då är ordinarie avgång enligt
          tidtabell.
        </Text>

        <Text style={component.popup.header}>
          Hur sparar man en linje som favorit?
        </Text>
        <Text style={component.popup.text}>
          För att spara en linje så räcker det med att klicka på den, linjen
          kommer då hamna högst upp på alla hållplatser som den linjen kör på.
          För att spara avgången som favorit för nuvarande hållplats så tryck på
          avgången och håll ner fingret i en halv sekund.
        </Text>
      </Popup>
    );
  };

  const getItemLayout = (data, index) => ({
    length: 51,
    offset: 51 * index,
    index,
  });

  const renderContent = () => {
    if (props.loading) {
      return <Spinner size="large" color={colors.primary} />;
    } else if (props.error) {
      return <Message type="warning" message={props.error} />;
    }

    return (
      <ScrollView>
        <FlatList
          data={props.favorites}
          renderItem={renderDepartures}
          keyExtractor={(item) => item.journeyid}
          ItemSeparatorComponent={ListItemSeparator}
          ListFooterComponent={ListFooterComponent}
          maxToRenderPerBatch={11}
          initialNumToRender={11}
          scrollEnabled={false}
          // extraData={this.state}
        />
        <FlatList
          data={props.departures}
          renderItem={renderDepartures}
          keyExtractor={(item) => item.journeyid}
          ItemSeparatorComponent={ListItemSeparator}
          getItemLayout={getItemLayout}
          maxToRenderPerBatch={11}
          initialNumToRender={11}
          scrollEnabled={false}
          // extraData={this.state}
        />
      </ScrollView>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      {renderTimeformat()}
      {renderMiniMenu()}
      {renderPopup()}
      {renderContent()}
    </View>
  );
};

const MapStateToProps = (state, ownProps) => {
  const lines = _.map(state.fav.lines, (line) => line.replace("X", ""));
  const linesLocal = _.filter(
    state.fav.linesLocal,
    ({ stop }) => stop === ownProps.navigation.getParam("id")
  )
    .map((o) => o.lines)
    .map((line) => line)[0];
  const { loading, timestamp } = state.departures;
  let favorites = [];
  let departures = [];
  _.forEach(state.departures.departures, (item) => {
    const { sname, direction } = item;
    const departure = `${sname} ${direction}`.replace("X", "");
    if (_.includes(lines, departure) && _.includes(linesLocal, departure)) {
      favorites = [...favorites, { ...item, global: true, local: true }];
    } else if (_.includes(lines, departure)) {
      favorites = [...favorites, { ...item, global: true, local: false }];
    } else if (_.includes(linesLocal, departure)) {
      favorites = [...favorites, { ...item, global: false, local: true }];
    } else {
      departures = [...departures, item];
    }
  });
  const { error } = state.errors;
  const { timeFormat } = state.settings;
  const favoriteStopIds = _.map(state.fav.favorites, "id");
  return {
    departures: _.sortBy(departures, ["timeLeft", "timeNext"]),
    error,
    favorites: _.sortBy(favorites, ["timeLeft", "timeNext"]),
    favoriteStopIds,
    loading,
    timestamp,
    timeFormat,
  };
};

ShowDepartures.navigationOptions = ({ navigation }) => ({
  title: navigation.getParam("title"),
  headerRight: (
    <View style={{ flexDirection: "row", justifyContent: "center" }}>
      {navigation.state.params && navigation.state.params.reloading && (
        <Spinner color={colors.alternative} style={{ marginRight: 5 }} />
      )}
      <TouchableWithoutFeedback
        onPress={
          navigation.state.params && navigation.state.params.toggleMiniMenu
        }
      >
        <View
          style={{
            width: 30,
            height: 30,
            alignItems: "center",
            justifyContent: "center",
            right: 5,
          }}
        >
          <Icon
            name="more-horiz"
            style={{ color: colors.alternative, fontSize: 24 }}
          />
        </View>
      </TouchableWithoutFeedback>
    </View>
  ),
  headerTitleStyle: {
    width: "auto",
    fontSize: 14,
    fontFamily: isAndroid() ? "sans-serif" : "System",
  },
});

export default connect(MapStateToProps, {
  clearDepartures,
  clearErrors,
  favoriteCreate,
  favoriteDelete,
  favoriteLineToggle,
  favoriteLineLocalAdd,
  favoriteLineLocalRemove,
  getDepartures,
  incrementStopsOpened,
  setSetting,
})(ShowDepartures);
