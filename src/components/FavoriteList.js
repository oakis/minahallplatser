import _ from 'lodash';
import fetch from 'react-native-cancelable-fetch';
import React, { PureComponent } from 'react';
import { Keyboard, Alert, FlatList, View, ScrollView, AppState, TouchableWithoutFeedback } from 'react-native';
import firebase from 'react-native-firebase';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import { favoriteDelete, clearErrors, searchStops, searchChanged, favoriteCreate, getNearbyStops } from '../actions';
import { ListItem, Message, Input, ListItemSeparator, ListHeading, Text, Popup, Button } from './common';
import { colors, component, metrics } from './style';
import { CLR_SEARCH, CLR_ERROR, SEARCH_BY_GPS_FAIL } from '../actions/types';
import { store } from '../App';
import { track, isAndroid } from './helpers';
import { HelpButton } from '../Router';

const iconSize = 24;

class FavoriteList extends PureComponent {

	static navigationOptions = ({ navigation }) => ({
		title: 'Mina Hållplatser',
		headerLeft: (
			<Icon
				name="menu"
				size={iconSize}
				style={{
					color: colors.alternative,
					left: 8,
				}}
				onPress={navigation.state.params && navigation.state.params.onPress}
			/>
		),
		headerRight: navigation.state.params && navigation.state.params.headerRight,
	});

	constructor(props) {
		super(props);
		this.state = {
			editing: false,
			showHelp: false,
			init: true,
		};
		this.searchTimeout = undefined;
		this.clearTimeout = undefined;
	}

	componentDidMount() {
		firebase.analytics().setCurrentScreen('Dashboard', 'Dashboard');
		this.props.navigation.setParams({ headerRight: HelpButton(this), onPress: () => this.props.navigation.toggleDrawer() });
		Keyboard.dismiss();
		if (this.props.allowedGPS) {
			window.log('Refreshing nearby stops');
			this.props.getNearbyStops();
		}
		track('Page View', { Page: 'Dashboard' });
		AppState.addEventListener('change', this.handleAppStateChange);
	}

	componentWillReceiveProps() {
		if (this.state.init) {
			// Actions.refresh({ right: HelpButton(this) });
			this.setState({ init: false });
		}
	}

	componentWillUnmount() {
		fetch.abort('searchStops');
		this.props.clearErrors();
		AppState.removeEventListener('change', this.handleAppStateChange);
	}

	onInputChange = (busStop) => {
		fetch.abort('searchStops');
		this.clearTimeout = clearTimeout(this.searchTimeout);
		this.props.searchChanged(busStop);
		this.searchTimeout = setTimeout(() => {
			this.props.searchStops({ busStop });
		}, 500);
	}

	handleAppStateChange = (nextAppState) => {
		if (nextAppState === 'active') {
			if (this.props.allowedGPS) {
				this.props.getNearbyStops();
			}
			track('Page View', { Page: 'Dashboard', Parent: 'Background' });
		}
	}

	resetSearch = () => {
		window.log('resetSearch()');
		store.dispatch({ type: CLR_SEARCH });
		store.dispatch({ type: CLR_ERROR });
	}

	refreshNearbyStops = () => {
		track('Refresh NearbyStops');
		store.dispatch({ type: SEARCH_BY_GPS_FAIL });
		this.props.getNearbyStops();
	}

	openPopup = () => {
		track('Show Help', { Page: 'Dashboard' });
		this.setState({
			showHelp: true
		});
	}

	renderPopup() {
		return (
			<Popup
				onPress={() => this.setState({ showHelp: false })}
				isVisible={this.state.showHelp}
			>

				<Text style={component.popup.header}>
					Söka efter hållplats
				</Text>
				<Text style={component.popup.text}>
					För att söka på en hållplats klickar du på sökfältet ( <Icon name="search" /> ) högst upp på startsidan och fyller i ett eller flera sökord.
				</Text>

				<Text style={component.popup.header}>
					Hållplatser nära dig
				</Text>
				<Text style={component.popup.text}>
					Hållplatser som är i din närhet kommer automatiskt att visas sålänge du har godkänt att appen får använda din <Text style={{ fontWeight: 'bold' }}>plats</Text>. Om du har nekat tillgång så kan du klicka på pilen ( <Icon name="refresh" /> ) till höger om "Hållplatser nära dig" och godkänna åtkomst till platstjänster.
				</Text>

				<Text style={component.popup.header}>
					Spara hållplats som favorit
				</Text>
				<Text style={component.popup.text}>
					Längst till höger på hållplatser nära dig eller i sökresultaten finns det en stjärna ( <Icon name="star-border" color={colors.warning} /> ), klicka på den för att spara hållplatsen som favorit. Nu kommer stjärnan ( <Icon name="star" color={colors.warning} /> ) att bli fylld med <Text style={{ color: colors.warning }}>orange</Text> färg och hållplatsen sparas i listan "Mina Hållplatser".
				</Text>

				<Text style={component.popup.header}>
					Ta bort hållplats från favoriter
				</Text>
				<Text style={component.popup.text}>
					För att ta bort en hållplats från favoriter så klickar du på <Text style={{ fontWeight: 'bold' }}>pennan</Text> ( <Icon name="edit" /> ) och sedan på <Text style={{ fontWeight: 'bold' }}>minustecknet</Text> ( <Icon name="remove-circle-outline" color={colors.danger} /> ) bredvid den hållplatsen du vill ta bort.
				</Text>

				<Text style={component.popup.header}>
					Sortera favoriter
				</Text>
				<Text style={component.popup.text}>
					I <Text style={{ fontWeight: 'bold' }}>menyn</Text> ( <Icon name="menu" /> ) kan du hitta olika sorteringsalternativ, t.ex dina mest använda hållplatser.
				</Text>

			</Popup>
		);
	}

	renderFavoriteItem = ({ item }) => {
		return (
			<ListItem
				text={item.busStop}
				icon='remove-circle-outline'
				pressItem={async () => {
					Keyboard.dismiss();
					await this.props.clearErrors();
					this.props.navigation.navigate('Departures', {
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
							{ text: 'Avbryt' },
							{
								text: 'Ja',
								onPress: () => {
									track('Favorite Stop Remove', { Stop: item.busStop, Parent: 'Favorite List' });
									this.props.favoriteDelete(item.id);
								}
							}
						]
					);
				}}
				iconVisible={this.state.editing}
				iconColor={colors.danger}
			/>
		);
	}

	renderSearchItem = ({ item }, parent) => {
		return (
			<ListItem
				text={item.name}
				icon={item.icon}
				pressItem={() => {
					Keyboard.dismiss();
					this.props.navigation.navigate('Departures', {
						busStop: item.name,
						id: item.id,
						title: item.name,
						parent,
					});
				}}
				pressIcon={() => {
					Keyboard.dismiss();
					if (item.icon === 'star') {
						track('Favorite Stop Remove', { Stop: item.name, Parent: item.parent });
						this.props.favoriteDelete(item.id);
					} else {
						track('Favorite Stop Add', { Stop: item.name, Parent: item.parent });
						this.props.favoriteCreate({ busStop: item.name, id: item.id });
					}
				}}
				iconVisible
				iconColor={colors.warning}
			/>
		);
	}

	renderNearbyStops = () => {
		return (
			<View>
				<ListHeading text="Hållplatser nära dig" icon="refresh" onPress={() => this.refreshNearbyStops()} loading={this.props.gpsLoading} />
				{(!this.props.gpsLoading && this.props.stopsNearby.length === 0) ? <Text style={{ marginTop: metrics.margin.md, marginLeft: metrics.margin.md }}>Vi kunde inte hitta några hållplatser nära dig.</Text> : null}
				<FlatList
					data={this.props.stopsNearby}
					renderItem={item => this.renderSearchItem(item, 'nearby stops')}
					keyExtractor={item => item.id}
					ItemSeparatorComponent={ListItemSeparator}
					scrollEnabled={false}
					keyboardShouldPersistTaps='always'
				/>
			</View>
		);
	}

	renderSectionList() {
		return (
			<View>
				{(this.props.departureList.length > 0) ? <ListHeading text="Sökresultat" /> : null}
				<FlatList
					data={this.props.departureList}
					renderItem={item => this.renderSearchItem(item, 'search')}
					keyExtractor={item => item.id}
					ItemSeparatorComponent={ListItemSeparator}
					scrollEnabled={false}
					keyboardShouldPersistTaps='always'
				/>
				{this.renderNearbyStops()}
				<ListHeading text="Mina hållplatser" icon={this.props.favorites.length > 0 ? 'edit' : null} iconSize={16} onPress={() => { track('Edit Stops Toggle', { On: !this.state.editing }); this.setState({ editing: !this.state.editing }); }} />
				<FlatList
					data={this.props.favorites}
					renderItem={this.renderFavoriteItem}
					keyExtractor={item => item.id}
					ItemSeparatorComponent={ListItemSeparator}
					scrollEnabled={false}
					keyboardShouldPersistTaps='always'
					extraData={this.state.editing}
				/>
			</View>
		);
	}

	render() {
		return (
			<View style={{ flex: 1, backgroundColor: colors.background }}>
				{this.renderPopup()}
				<ScrollView scrollEnabled keyboardShouldPersistTaps="always">
					<Input
						placeholder="Sök hållplats.."
						onChangeText={this.onInputChange}
						value={this.props.busStop}
						icon="search"
						loading={this.props.searchLoading && this.props.busStop.length > 0}
						iconRight={this.props.busStop.length > 0 ? 'close' : null}
						iconRightPress={this.resetSearch}
						underlineColorAndroid="#fff"
						onFocus={() => track('Search Focused')}
						style={[{ borderRadius: 15, paddingLeft: metrics.padding.sm, paddingRight: metrics.padding.sm, margin: metrics.margin.md, backgroundColor: '#fff' }, !isAndroid() ? { paddingTop: metrics.padding.md, paddingBottom: metrics.padding.md } : null]}
					/>
					{(this.props.error) ?
						<Message
							type="warning"
							message={this.props.error}
						/> :
						null
					}
					{this.renderSectionList()}
					{(this.props.favorites.length === 0) ?
						<View style={{ marginTop: metrics.margin.md, marginLeft: metrics.margin.md, marginRight: metrics.margin.md }}>
							<Text style={{ marginBottom: metrics.margin.md }}>
								Du har inte sparat några favoriter än.
							</Text>
							<Button
								onPress={this.openPopup}
								label="Hjälp"
								icon="live-help"
								color="primary"
							/>
						</View> : null
					}
				</ScrollView>
			</View>
		);
	}
}

const mapStateToProps = state => {
	const { favoriteOrder, allowedGPS } = state.settings;
	const favorites = _.orderBy(state.fav.favorites, (o) => o[favoriteOrder] || 0, favoriteOrder === 'busStop' ? 'asc' : 'desc');
	const { error } = state.errors;
	const favoriteIds = _.map(favorites, 'id');
	const { busStop, stops, gpsLoading } = state.search;
	const stopsNearby = _.map(stops, (item) => {
		return { ...item, icon: (_.includes(favoriteIds, item.id)) ? 'star' : 'star-border', parent: 'Stops Nearby' };
	});
	const searchLoading = state.search.loading;
	const departureList = _.map(state.search.departureList, (item) => {
		return { ...item, icon: (_.includes(favoriteIds, item.id)) ? 'star' : 'star-border', parent: 'Search List' };
	});
	return { favorites, error, busStop, departureList, favoriteIds, searchLoading, stopsNearby, gpsLoading, allowedGPS };
};

export default connect(mapStateToProps,
	{
		favoriteDelete,
		clearErrors,
		searchStops,
		searchChanged,
		favoriteCreate,
		getNearbyStops
	})(FavoriteList);
