import _ from 'lodash';
import {connect} from 'react-redux';
import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  SectionList,
  AppState,
  TouchableWithoutFeedback,
} from 'react-native';
// import firebase from 'react-native-firebase';
import Icon from 'react-native-vector-icons/MaterialIcons';
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
} from '@actions';
import {
  DepartureListItem,
  Spinner,
  Message,
  ListItemSeparator,
  Text,
  MiniMenu,
  Popup,
} from '@common';
import {updateStopsCount, track, isAndroid} from '@helpers';
import {colors, component} from '@style';

const length =
  component.listitem.view.height +
  component.listitem.view.paddingHorizontal * 2;

const ShowDepartures = props => {
  const {
    favorites,
    departures,
    route,
    navigation,
    favoriteStopIds,
    loading,
    error,
    timeFormat,
  } = props;

  const [showHelp, setShowHelp] = useState(false);
  const [miniMenuOpen, setMiniMenuOpen] = useState(false);
  const [timeformatVisible, setTimeformatVisible] = useState(false);
  const [reloading, setReloading] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      title: route.params.title,
      headerRight: () => (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
            width: 65,
          }}>
          {reloading && (
            <Spinner color={colors.alternative} style={{marginRight: 5}} />
          )}
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
        </View>
      ),
      headerTitleStyle: {
        width: 'auto',
        fontSize: 14,
        fontFamily: isAndroid() ? 'sans-serif' : 'System',
      },
    });
  }, [navigation, reloading, route.params.title]);

  useEffect(() => {
    // firebase.analytics().setCurrentScreen('Departures', 'Departures');
    track('Page View', {
      Page: 'Departures',
      Stop: route.params.busStop,
      Parent: route.params.parent,
    });
    updateStopsCount();
    props.incrementStopsOpened(route.params.id);
    refresh();
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );
    const interval = setInterval(() => {
      refresh();
    }, 10000);
    return () => {
      clearInterval(interval);
      props.clearDepartures();
      props.clearErrors();
      subscription.remove('change', handleAppStateChange);
    };
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setReloading(false);
  }, [favorites, departures]);

  const handleAppStateChange = useCallback(
    nextAppState => {
      props.clearDepartures();
      props.clearErrors();
      if (nextAppState === 'active') {
        refresh();
        track('Page View', {
          Page: 'Departures',
          Stop: route.params.busStop,
          Parent: 'Background',
        });
      }
    },
    [route.params.busStop, props, refresh],
  );

  const saveAsFavorite = () => {
    closeMiniMenu();
    props.favoriteCreate({
      busStop: route.params.busStop,
      id: route.params.id,
    });
  };

  const deleteFavorite = () => {
    closeMiniMenu();
    props.favoriteDelete(route.params.id);
  };

  const closeMiniMenu = () => setMiniMenuOpen(false);

  const renderMiniMenu = () => {
    return (
      <MiniMenu
        isVisible={miniMenuOpen}
        onClose={closeMiniMenu}
        items={[
          {
            icon: 'access-time',
            content: 'Ändra tidsformat',
            onPress: openTimeformat,
          },
          {
            icon: 'star',
            content: _.includes(favoriteStopIds, route.params.id)
              ? 'Ta bort favorit'
              : 'Lägg till favorit',
            onPress: _.includes(favoriteStopIds, route.params.id)
              ? deleteFavorite
              : saveAsFavorite,
          },
          {
            icon: 'help',
            content: 'Hjälp',
            onPress: openPopup,
          },
        ]}
      />
    );
  };

  const closeTimeFormat = () => {
    setTimeformatVisible(false);
  };

  const renderTimeformat = () => {
    return (
      <MiniMenu
        isVisible={timeformatVisible}
        onClose={closeTimeFormat}
        items={[
          {
            content: 'Minuter',
            onPress: () => onTimeValueChange('minutes'),
          },
          {
            content: 'Klockslag',
            onPress: () => onTimeValueChange('clock'),
          },
        ]}
      />
    );
  };

  const openTimeformat = () => {
    closeMiniMenu();
    setTimeout(() => {
      setTimeformatVisible(true);
    }, 1);
  };

  const toggleMiniMenu = () => {
    setMiniMenuOpen(prev => !prev);
  };

  const onTimeValueChange = itemValue => {
    props.setSetting('timeFormat', itemValue);
    closeTimeFormat();
  };

  const refresh = useCallback(() => {
    setReloading(true);
    props.getDepartures({id: route.params.id});
  }, [route.params.id, props]);

  const openPopup = () => {
    track('Show Help', {Page: 'Departures'});
    closeMiniMenu();
    setTimeout(() => {
      setShowHelp(true);
    }, 1);
  };

  const renderDepartures = ({item, index}) => {
    const itemWithNewIndex = {...item, index, timeFormat};
    return (
      <DepartureListItem
        item={itemWithNewIndex}
        onPress={() => {
          props.favoriteLineToggle(item);
        }}
        onLongPress={() => {
          const localFavorites = favorites.filter(favorite => favorite.local);
          const localLines = localFavorites.map(({sname, direction}) =>
            `${sname} ${direction}`.replace('X', ''),
          );
          if (
            _.includes(
              localLines,
              `${item.sname} ${item.direction}`.replace('X', ''),
            )
          ) {
            props.favoriteLineLocalRemove(item, route.params.id);
          } else {
            props.favoriteLineLocalAdd(item, route.params.id);
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
          avgång samt avgången efter det.{' '}
          <Text style={{fontStyle: 'italic'}}>
            Det går även att ändra avgångstiden till klockslag, och det gör du i
            menyn på startsidan.
          </Text>
        </Text>

        <Text style={component.popup.header}>
          Varför har tiden till nästa avgång ibland färg?
        </Text>
        <Text style={component.popup.text}>
          När en avgång snart ska gå från en hållplats så kommer alltid texten
          &quot;<Text style={{color: colors.danger}}>Nu</Text>&quot; att visas
          med röd färg. Ibland kan man också se att en avgång har{' '}
          <Text style={{color: colors.warning}}>orange</Text> text. Det kan t.ex
          betyda att en buss har tappat anslutningen med Västtrafik och inte
          längre är live. Tiden som visas då är ordinarie avgång enligt
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
    length,
    offset: length * index,
    index,
  });

  const SectionSeparatorComponent = () => (
    <View style={{height: 5, backgroundColor: colors.primary}} />
  );

  const renderContent = () => {
    if (loading) {
      return <Spinner size="large" color={colors.primary} />;
    } else if (error) {
      return <Message type="warning" message={error} />;
    }

    return (
      <SectionList
        sections={[{data: favorites}, {data: departures}]}
        renderItem={renderDepartures}
        keyExtractor={item => item.journeyid}
        ItemSeparatorComponent={ListItemSeparator}
        renderSectionFooter={SectionSeparatorComponent}
        maxToRenderPerBatch={11}
        initialNumToRender={11}
        getItemLayout={getItemLayout}
      />
    );
  };

  return (
    <View style={{flex: 1}}>
      {renderTimeformat()}
      {renderMiniMenu()}
      {renderPopup()}
      {renderContent()}
    </View>
  );
};

const MapStateToProps = (state, ownProps) => {
  const lines = _.map(state.fav.lines, line => line.replace('X', ''));
  const linesLocal = _.filter(
    state.fav.linesLocal,
    ({stop}) => stop === ownProps.route.params.id,
  )
    .map(o => o.lines)
    .map(line => line)[0];
  const {loading, timestamp} = state.departures;
  let favorites = [];
  let departures = [];
  _.forEach(state.departures.departures, item => {
    const {sname, direction} = item;
    const departure = `${sname} ${direction}`.replace('X', '');
    if (_.includes(lines, departure) && _.includes(linesLocal, departure)) {
      favorites = [...favorites, {...item, global: true, local: true}];
    } else if (_.includes(lines, departure)) {
      favorites = [...favorites, {...item, global: true, local: false}];
    } else if (_.includes(linesLocal, departure)) {
      favorites = [...favorites, {...item, global: false, local: true}];
    } else {
      departures = [...departures, item];
    }
  });
  const {error} = state.errors;
  const {timeFormat} = state.settings;
  const favoriteStopIds = _.map(state.fav.favorites, 'id');
  return {
    departures: _.sortBy(departures, ['timeLeft', 'timeNext']),
    error,
    favorites: _.sortBy(favorites, ['timeLeft', 'timeNext']),
    favoriteStopIds,
    loading,
    timestamp,
    timeFormat,
  };
};

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
