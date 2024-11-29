import _ from 'lodash';
import React, {useEffect, useState} from 'react';
import {
  Keyboard,
  Alert,
  FlatList,
  View,
  AppState,
  TouchableWithoutFeedback,
  ScrollView,
  StyleProp,
  TextProps,
} from 'react-native';
import analytics from '@react-native-firebase/analytics';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {connect} from 'react-redux';
import {
  favoriteDelete,
  clearErrors,
  searchStops,
  searchChanged,
  favoriteCreate,
  getNearbyStops,
  setSetting,
} from '@actions';
import {
  ListItem,
  Message,
  Input,
  ListItemSeparator,
  ListHeading,
  Text,
  Button,
  MiniMenu,
  Popup,
} from '@common';
import {colors, component, metrics} from '@style';
import {CLR_SEARCH, CLR_ERROR, SEARCH_BY_GPS_FAIL} from '@types';
import {store} from '@src/App';
import {track, isAndroid} from '@helpers';
import {Feedback} from '@modals';
import {useNavigation} from '@react-navigation/native';

interface IProps {
  allowedGPS: boolean;
  gpsLoading: boolean;
  searchLoading: boolean;
  clearErrors: () => void;
  searchChanged: (busStop: string) => void;
  searchStops: (busStop: Record<string, string>) => void;
  getNearbyStops: () => void;
  setSetting: (setting: string, value: string | undefined) => void;
  favoriteDelete: (id: string) => void;
  favoriteCreate: (item: Record<string, string>) => void;
  favorites: IStop[];
  stopsNearby: IStop[];
  departureList: IStop[];
  busStop: string;
  error: string;
}

const FavoriteList = (props: IProps): JSX.Element => {
  const navigation = useNavigation();

  const [editing, setEditing] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [miniMenuOpen, setMiniMenuOpen] = useState(false);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [sortingVisible, setSortingVisible] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      title: 'Mina Hållplatser',
      headerRight: () => (
        <TouchableWithoutFeedback onPress={toggleMiniMenu}>
          <View
            style={{
              width: 30,
              height: 30,
              alignItems: 'center',
              justifyContent: 'center',
              right: 5,
            }}>
            <Icon
              name="more-horiz"
              style={{color: colors.alternative, fontSize: 24}}
            />
          </View>
        </TouchableWithoutFeedback>
      ),
      headerTitleStyle: {
        width: '100%',
        marginHorizontal: 'auto',
        left: 28,
        alignSelf: 'center',
        textAlign: 'center',
        fontSize: 14,
        fontFamily: isAndroid() ? 'sans-serif' : 'System',
      },
    });
    analytics().logScreenView({
      screen_name: 'Dashboard',
      screen_class: 'Dashboard',
    });
    Keyboard.dismiss();
    if (props.allowedGPS) {
      window.log('Refreshing nearby stops');
      props.getNearbyStops();
    }
    track('Page View', {Page: 'Dashboard'});
    AppState.addEventListener('change', handleAppStateChange);
    () => {
      // fetch.abort('searchStops');
      props.clearErrors();
      AppState.removeEventListener('change', handleAppStateChange);
    };
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onInputChange = (busStop: string) => {
    // fetch.abort('searchStops');
    // clearTimeout(searchTimeout);
    props.searchChanged(busStop);
    // searchTimeout = setTimeout(() => {
    props.searchStops({busStop});
    // }, 500);
  };

  const handleAppStateChange = (nextAppState: string) => {
    if (nextAppState === 'active') {
      if (props.allowedGPS) {
        props.getNearbyStops();
      }
      track('Page View', {Page: 'Dashboard', Parent: 'Background'});
    }
  };

  const resetSearch = () => {
    window.log('resetSearch()');
    store.dispatch({type: CLR_SEARCH});
    store.dispatch({type: CLR_ERROR});
  };

  const refreshNearbyStops = () => {
    track('Refresh NearbyStops');
    store.dispatch({type: SEARCH_BY_GPS_FAIL});
    props.getNearbyStops();
  };

  const toggleMiniMenu = () => {
    setMiniMenuOpen(prev => !prev);
  };

  const closeMiniMenu = () => {
    setMiniMenuOpen(false);
  };

  const renderMiniMenu = () => {
    return (
      <MiniMenu
        isVisible={miniMenuOpen}
        onClose={closeMiniMenu}
        items={[
          {
            icon: 'sort',
            content: 'Sortera favoriter',
            onPress: openSorting,
          },
          {
            icon: 'help',
            content: 'Hjälp',
            onPress: openPopup,
          },
          {
            icon: 'feedback',
            content: 'Lämna feedback',
            onPress: openFeedback,
          },
        ]}
      />
    );
  };

  const openSorting = () => {
    closeMiniMenu();
    setTimeout(() => {
      setSortingVisible(true);
    }, 1);
  };

  const onOrderValueChange = (itemValue: string | undefined) => {
    props.setSetting('favoriteOrder', itemValue);
    setSortingVisible(false);
  };

  const openFeedback = () => {
    track('Feedback Open');
    setFeedbackVisible(true);
    closeMiniMenu();
  };

  const closeFeedback = () => {
    setFeedbackVisible(false);
  };

  const openPopup = () => {
    track('Show Help', {Page: 'Dashboard'});
    closeMiniMenu();
    setTimeout(() => {
      setShowHelp(true);
    }, 1);
  };

  const closeSorting = () => {
    setSortingVisible(false);
  };

  const renderSorting = () => {
    return (
      <MiniMenu
        isVisible={sortingVisible}
        onClose={closeSorting}
        items={[
          {
            content: 'Ingen sortering',
            onPress: () => onOrderValueChange(undefined),
          },
          {
            content: 'Mina mest använda',
            onPress: () => onOrderValueChange('opened'),
          },
          {
            content: 'Efter bokstav',
            onPress: () => onOrderValueChange('busStop'),
          },
        ]}
      />
    );
  };

  const closeHelp = () => {
    setShowHelp(false);
  };

  const renderPopup = () => {
    return (
      <Popup onPress={closeHelp} isVisible={showHelp}>
        <Text style={component.popup.header as StyleProp<TextProps>}>
          Söka efter hållplats
        </Text>
        <Text style={component.popup.text}>
          För att söka på en hållplats klickar du på sökfältet ({' '}
          <Icon name="search" /> ) högst upp på startsidan och fyller i ett
          eller flera sökord.
        </Text>

        <Text style={component.popup.header as StyleProp<TextProps>}>
          Hållplatser nära dig
        </Text>
        <Text style={component.popup.text}>
          Hållplatser som är i din närhet kommer automatiskt att visas sålänge
          du har godkänt att appen får använda din{' '}
          <Text style={{fontWeight: 'bold'}}>plats</Text>. Om du har nekat
          tillgång så kan du klicka på pilen ( <Icon name="refresh" /> ) till
          höger om &quot;Hållplatser nära dig&quot; och godkänna åtkomst till
          platstjänster.
        </Text>

        <Text style={component.popup.header as StyleProp<TextProps>}>
          Spara hållplats som favorit
        </Text>
        <Text style={component.popup.text}>
          Längst till höger på hållplatser nära dig eller i sökresultaten finns
          det en stjärna ( <Icon name="star-border" color={colors.warning} /> ),
          klicka på den för att spara hållplatsen som favorit. Nu kommer
          stjärnan ( <Icon name="star" color={colors.warning} /> ) att bli fylld
          med <Text style={{color: colors.warning}}>orange</Text> färg och
          hållplatsen sparas i listan &quot;Mina Hållplatser&quot;.
        </Text>

        <Text style={component.popup.header as StyleProp<TextProps>}>
          Ta bort hållplats från favoriter
        </Text>
        <Text style={component.popup.text}>
          För att ta bort en hållplats från favoriter så klickar du på{' '}
          <Text style={{fontWeight: 'bold'}}>pennan</Text> ({' '}
          <Icon name="edit" /> ) och sedan på{' '}
          <Text style={{fontWeight: 'bold'}}>minustecknet</Text> ({' '}
          <Icon name="remove-circle-outline" color={colors.danger} /> ) bredvid
          den hållplatsen du vill ta bort.
        </Text>

        <Text style={component.popup.header as StyleProp<TextProps>}>
          Sortera favoriter
        </Text>
        <Text style={component.popup.text}>
          I <Text style={{fontWeight: 'bold'}}>menyn</Text> ({' '}
          <Icon name="menu" /> ) kan du hitta olika sorteringsalternativ, t.ex
          dina mest använda hållplatser.
        </Text>
      </Popup>
    );
  };

  const renderFavoriteItem = ({item}: {item: IStop}) => {
    return (
      <ListItem
        text={item.busStop}
        icon="remove-circle-outline"
        pressItem={async () => {
          Keyboard.dismiss();
          await props.clearErrors();
          navigation.navigate('Departures', {
            busStop: item.busStop,
            id: item.id,
            title: item.busStop,
            parent: 'favorites',
          });
        }}
        pressIcon={() => {
          Keyboard.dismiss();
          Alert.alert(
            item.busStop,
            `Är du säker att du vill ta bort ${item.busStop}?`,
            [
              {text: 'Avbryt'},
              {
                text: 'Ja',
                onPress: () => {
                  track('Favorite Stop Remove', {
                    Stop: item.busStop,
                    Parent: 'Favorite List',
                  });
                  props.favoriteDelete(item.id);
                },
              },
            ],
          );
        }}
        iconVisible={editing}
        iconColor={colors.danger}
      />
    );
  };

  const renderSearchItem = ({item}: {item: IStop}, parent: string) => {
    return (
      <ListItem
        text={item.name}
        icon={item.icon}
        pressItem={() => {
          Keyboard.dismiss();
          navigation.navigate('Departures', {
            busStop: item.name,
            id: item.id,
            title: item.name,
            parent,
          });
        }}
        pressIcon={() => {
          Keyboard.dismiss();
          if (item.icon === 'star') {
            track('Favorite Stop Remove', {
              Stop: item.name,
              Parent: item.parent,
            });
            props.favoriteDelete(item.id);
          } else {
            track('Favorite Stop Add', {Stop: item.name, Parent: item.parent});
            props.favoriteCreate({busStop: item.name, id: item.id});
          }
        }}
        iconVisible
        iconColor={colors.warning}
      />
    );
  };

  const renderNearbyStops = () => {
    return (
      <View>
        <ListHeading
          text="Hållplatser nära dig"
          icon="refresh"
          onPress={refreshNearbyStops}
          loading={props.gpsLoading}
        />
        {!props.gpsLoading && props.stopsNearby.length === 0 ? (
          <Text
            style={{
              marginTop: metrics.margin.md,
              marginLeft: metrics.margin.md,
            }}>
            Vi kunde inte hitta några hållplatser nära dig.
          </Text>
        ) : null}
        <FlatList
          data={props.stopsNearby}
          renderItem={item => renderSearchItem(item, 'nearby stops')}
          keyExtractor={item => item.id}
          ItemSeparatorComponent={ListItemSeparator}
          scrollEnabled={false}
          keyboardShouldPersistTaps="always"
        />
      </View>
    );
  };

  const renderSectionList = () => {
    return (
      <View>
        {props.departureList.length > 0 ? (
          <ListHeading text="Sökresultat" />
        ) : null}
        <FlatList
          data={props.departureList}
          renderItem={item => renderSearchItem(item, 'search')}
          keyExtractor={item => item.id}
          ItemSeparatorComponent={ListItemSeparator}
          scrollEnabled={false}
          keyboardShouldPersistTaps="always"
        />
        {renderNearbyStops()}
        <ListHeading
          text="Mina hållplatser"
          icon={props.favorites.length > 0 ? 'edit' : null}
          iconSize={20}
          onPress={() => {
            track('Edit Stops Toggle', {On: !editing});
            setEditing(prev => !prev);
          }}
        />
        <FlatList
          data={props.favorites}
          renderItem={renderFavoriteItem}
          keyExtractor={item => item.id}
          ItemSeparatorComponent={ListItemSeparator}
          scrollEnabled={false}
          keyboardShouldPersistTaps="always"
          extraData={editing}
        />
      </View>
    );
  };

  const onFocus = () => {
    track('Search Focused');
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.background}}>
      <Feedback visible={feedbackVisible} close={closeFeedback} />
      {renderPopup()}
      {renderSorting()}
      {renderMiniMenu()}
      <ScrollView scrollEnabled keyboardShouldPersistTaps="always">
        <Input
          placeholder="Sök hållplats.."
          onChangeText={onInputChange}
          value={props.busStop}
          icon="search"
          loading={props.searchLoading && props.busStop.length > 0}
          iconRight={props.busStop.length > 0 ? 'close' : null}
          iconRightPress={resetSearch}
          underlineColorAndroid="#fff"
          onFocus={onFocus}
          style={[
            {
              borderRadius: 15,
              paddingLeft: metrics.padding.sm,
              paddingRight: metrics.padding.sm,
              margin: metrics.margin.md,
              backgroundColor: '#fff',
            },
            !isAndroid()
              ? {
                  paddingTop: metrics.padding.md,
                  paddingBottom: metrics.padding.md,
                }
              : null,
          ]}
        />
        {props.error ? (
          <Message
            type="warning"
            message={props.error}
            backgroundColor={colors.warning}
          />
        ) : null}
        {renderSectionList()}
        {props.favorites.length === 0 ? (
          <View
            style={{
              marginTop: metrics.margin.md,
              marginLeft: metrics.margin.md,
              marginRight: metrics.margin.md,
            }}>
            <Text style={{marginBottom: metrics.margin.md}}>
              Du har inte sparat några favoriter än.
            </Text>
            <Button
              onPress={openPopup}
              label="Hjälp"
              icon="live-help"
              color={colors.primary}
            />
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
};

const mapStateToProps = (state: IStateProps) => {
  const {favoriteOrder, allowedGPS} = state.settings;
  const favorites = _.orderBy(
    state.fav.favorites,
    o => o[favoriteOrder] || 0,
    favoriteOrder === 'busStop' ? 'asc' : 'desc',
  );
  const {error} = state.errors;
  const favoriteIds = _.map(state.fav.favorites, 'id');
  const {busStop, stops, gpsLoading} = state.search;
  const stopsNearby = _.map(stops, item => {
    return {
      ...item,
      icon: _.includes(favoriteIds, item.id) ? 'star' : 'star-border',
      parent: 'Stops Nearby',
    };
  });
  const searchLoading = state.search.loading;
  const departureList = _.map(state.search.departureList, item => {
    return {
      ...item,
      icon: _.includes(favoriteIds, item.id) ? 'star' : 'star-border',
      parent: 'Search List',
    };
  });
  return {
    favorites,
    error,
    busStop,
    departureList,
    favoriteIds,
    searchLoading,
    stopsNearby,
    gpsLoading,
    allowedGPS,
  };
};

export default connect(mapStateToProps, {
  favoriteDelete,
  clearErrors,
  searchStops,
  searchChanged,
  favoriteCreate,
  getNearbyStops,
  setSetting,
})(FavoriteList);
