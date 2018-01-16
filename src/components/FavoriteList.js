import _ from 'lodash';
import fetch from 'react-native-cancelable-fetch';
import React, { PureComponent } from 'react';
import { Keyboard, Alert, AsyncStorage, FlatList, View, ScrollView, AppState } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import firebase from 'firebase';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { favoriteGet, favoriteDelete, clearErrors, searchStops, searchChanged, favoriteCreate, getNearbyStops, setSetting } from '../actions';
import { ListItem, Spinner, Message, Input, ListItemSeparator, ListHeading, Text, Popup } from './common';
import { colors, component, metrics } from './style';
import { CLR_SEARCH, CLR_ERROR, SEARCH_BY_GPS_FAIL } from '../actions/types';
import { renderHelpButton } from '../Router';
import { store } from '../App';
import { track, globals } from './helpers';


class FavoriteList extends PureComponent {

	constructor(props) {
		super(props);
		this.state = {
			editing: false,
			showHelp: false,
			init: true,
			hasUsedGPS: false
		};
	}

	componentWillMount() {
		globals.shouldExitApp = false;
		Keyboard.dismiss();
		const fbUser = firebase.auth().currentUser;
		if (fbUser && fbUser.uid) {
			AsyncStorage.getItem('minahallplatser-user').then((dataJson) => {
				const user = JSON.parse(dataJson);
				if (user && user.uid === fbUser.uid) {
					this.props.favoriteGet(fbUser);
				}
				AsyncStorage.getItem('minahallplatser-settings').then((settingsJson) => {
					const settings = JSON.parse(settingsJson);
					if (fbUser.isAnonymous && (!Object.prototype.hasOwnProperty.call(settings, 'anonFirstAppStart'))) {
						this.showRegistrationQuestion();
					}
					if (this.props.stopsNearby.length === 0 && !settings.anonFirstAppStart && settings.allowedGPS) {
						this.props.getNearbyStops();
						this.setState({ hasUsedGPS: true });
					}
				})
				.catch(() => {
					if (fbUser.isAnonymous) {
						this.showRegistrationQuestion();
					}
				});
			});
		}
		track('Page View', { Page: 'Dashboard' });
	}

	componentDidMount() {
		AppState.addEventListener('change', this.handleAppStateChange);
	}

	componentWillReceiveProps() {
		if (this.state.init) {
			Actions.refresh({ right: renderHelpButton(this) });
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
		this.props.searchChanged(busStop);
		this.props.searchStops({ busStop });
	}

	handleAppStateChange = (nextAppState) => {
		if (nextAppState === 'active') {
			AsyncStorage.getItem('minahallplatser-settings').then((settingsJson) => {
				const settings = JSON.parse(settingsJson) || {};
				if (Object.prototype.hasOwnProperty.call(settings, 'allowedGPS') && settings.allowedGPS) {
					this.props.getNearbyStops();
					this.setState({ hasUsedGPS: true });
				}
			});
			track('Page View', { Page: 'Dashboard', Type: 'Reopened app from background' });
		}
	}
	
	showRegistrationQuestion = () => {
		globals.anonFirstAppStart = false;
		this.props.setSetting('anonFirstAppStart', false);
		Alert.alert(
			'Få ut mer av appen',
			'Få en bättre upplevelse genom att registrera dig i appen. Det är helt gratis!\nDina hållplatser sparas i molnet så att du alltid har dom kvar på ditt konto, även om du till exempel köper en ny telefon. Det går alltid att registrera sig vid ett annat tillfälle via menyn.',
			[
				{
					text: 'Nej tack',
					onPress: () => {
						track('Registration Question', { answer: 'No' });
					}
				},
				{
					text: 'Logga in',
					onPress: () => {
						track('Registration Question', { answer: 'Login' });
						Actions.login();
					}
				},
				{
					text: 'Registrera',
					onPress: () => {
						track('Registration Question', { answer: 'Register' });
						Actions.register();
					}
				}
			]
		);
	}

	resetSearch = () => {
		store.dispatch({ type: CLR_SEARCH });
		store.dispatch({ type: CLR_ERROR });
	}

	refreshNearbyStops = () => {
		track('Refresh NearbyStops');
		store.dispatch({ type: SEARCH_BY_GPS_FAIL });
		this.props.getNearbyStops();
		this.setState({ hasUsedGPS: true });
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
					För att söka på en hållplats klickar du på sökfältet ( <Ionicons name="ios-search" /> ) högst upp på startsidan och fyller i ett eller flera sökord.
				</Text>

				<Text style={component.popup.header}>
					Hållplatser nära dig
				</Text>
				<Text style={component.popup.text}>
					Hållplatser som är i din närhet kommer automatiskt att visas sålänge du har godkänt att appen får använda din <Text style={{ fontWeight: 'bold' }}>plats</Text>. Om du har nekat tillgång så kan du klicka på pilen ( <Ionicons name="md-refresh" /> ) till höger om "Hållplatser nära dig" och godkänna åtkomst till platstjänster.
				</Text>

				<Text style={component.popup.header}>
					Spara hållplats som favorit
				</Text>
				<Text style={component.popup.text}>
					Längst till höger på hållplatser nära dig eller i sökresultaten finns det en stjärna ( <Ionicons name="ios-star-outline" color={colors.warning} /> ), klicka på den för att spara hållplatsen som favorit. Nu kommer stjärnan ( <Ionicons name="ios-star" color={colors.warning} /> ) att bli fylld med <Text style={{ color: colors.warning }}>orange</Text> färg.
				</Text>

				<Text style={component.popup.header}>
					Ta bort hållplats från favoriter
				</Text>
				<Text style={component.popup.text}>
					För att ta bort en hållplats från favoriter så klickar du på <Text style={{ fontWeight: 'bold' }}>pennan</Text> ( <Entypo name="edit" /> ) och sedan på <Text style={{ fontWeight: 'bold' }}>minustecknet</Text> ( <Ionicons name="ios-remove-circle-outline" color={colors.danger} /> ) bredvid den hållplatsen du vill ta bort.
				</Text>

				<Text style={component.popup.header}>
					Sortera favoriter
				</Text>
				<Text style={component.popup.text}>
					I <Text style={{ fontWeight: 'bold' }}>menyn</Text> ( <Ionicons name="ios-menu" /> ) kan du hitta olika sorteringsalternativ, t.ex dina mest använda hållplatser.
				</Text>
				
			</Popup>
		);
	}

	renderFavoriteItem = ({ item }) => {
		return (
			<ListItem
				text={item.busStop}
				icon='ios-remove-circle-outline'
				pressItem={async () => {
					Keyboard.dismiss();
					await this.props.clearErrors();
					Actions.departures({ busStop: item.busStop, id: item.id, title: item.busStop });
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

	renderSearchItem = ({ item }) => {
		return (
			<ListItem
				text={item.name}
				icon={item.icon}
				pressItem={() => {
					Keyboard.dismiss();
					Actions.departures({ busStop: item.name, id: item.id, title: item.name });
				}}
				pressIcon={() => {
					Keyboard.dismiss();
					if (item.icon === 'ios-star') {
						track('Favorite Stop Remove', { Stop: item.name, Parent: item.parent });
					} else {
						track('Favorite Stop Add', { Stop: item.name, Parent: item.parent });
					}
					this.props.favoriteCreate({ busStop: item.name, id: item.id });
				}}
				iconVisible
				iconColor={colors.warning}
			/>
		);
	}

	renderNearbyStops = () => {
		if (!this.props.allowedGPS) {
			return null;
		}
		return (
			<View>
				<ListHeading text={'Hållplatser nära dig'} icon={'md-refresh'} onPress={() => this.refreshNearbyStops()} loading={this.props.gpsLoading} />
				{(!this.props.gpsLoading && this.props.stopsNearby.length === 0 && this.state.hasUsedGPS) ? <Text style={{ marginTop: metrics.margin.md, marginLeft: metrics.margin.md }}>Vi kunde inte hitta några hållplatser nära dig.</Text> : null}
				<FlatList
					data={this.props.stopsNearby}
					renderItem={this.renderSearchItem}
					keyExtractor={item => item.id}
					ItemSeparatorComponent={ListItemSeparator}
					scrollEnabled={false}
					keyboardShouldPersistTaps='always'
				/>
			</View>
		);
	}

	renderSectionList() {
		if (this.props.favoritesLoading) {
			return (
				<View style={{ marginTop: 10 }}>
					<Spinner
						size="large"
						color={colors.primary}
					/>
				</View>
			);
		}
		return (
			<View>
				{(this.props.departureList.length > 0) ? <Text style={component.text.heading}>Sökresultat</Text> : null}
				<FlatList
					data={this.props.departureList}
					renderItem={this.renderSearchItem}
					keyExtractor={item => item.id}
					ItemSeparatorComponent={ListItemSeparator}
					scrollEnabled={false}
					keyboardShouldPersistTaps='always'
				/>
				{this.renderNearbyStops()}
				<ListHeading text={'Mina hållplatser'} icon={this.props.favorites.length > 0 ? 'edit' : null} iconSize={16} onPress={() => { track('Edit Stops Toggle', { On: !this.state.editing }); this.setState({ editing: !this.state.editing }); }} />
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
			<View style={{ flex: 1 }}>
				{this.renderPopup()}
				<ScrollView scrollEnabled keyboardShouldPersistTaps={'always'}>
					<Input
						placeholder="Sök hållplats.."
						onChangeText={this.onInputChange}
						value={this.props.busStop}
						icon="ios-search"
						loading={this.props.searchLoading && this.props.busStop.length > 0}
						iconRight={this.props.busStop.length > 0 ? 'ios-close' : null}
						iconRightPress={this.resetSearch}
						underlineColorAndroid={'#fff'}
						onFocus={() => track('Search Focused')}
						style={{ borderRadius: 15, paddingLeft: metrics.margin.sm, paddingRight: metrics.margin.sm, marginTop: metrics.margin.md, marginLeft: metrics.margin.md, marginRight: metrics.margin.md, marginBottom: metrics.margin.md, backgroundColor: '#fff' }}
					/>
					{(this.props.error) ?
						<Message
							type="warning"
							message={this.props.error}
						/> :
						null
					}
					{this.renderSectionList()}
					{(this.props.favorites.length === 0 && !this.props.favoritesLoading) ?
						<Text style={{ marginTop: metrics.margin.md, marginLeft: metrics.margin.md }}>
							Du har inte sparat några favoriter än.
						</Text> : null
					}
				</ScrollView>
			</View>
		);
	}
}

const mapStateToProps = state => {
	const { favoriteOrder, allowedGPS } = state.settings;
	const favorites = _.orderBy(state.fav.favorites, (o) => o[favoriteOrder] || 0, favoriteOrder === 'busStop' ? 'asc' : 'desc');
	const favoritesLoading = state.fav.loading;
	const { error } = state.errors;
	const favoriteIds = _.map(favorites, 'id');
	const { busStop, stops, gpsLoading } = state.search;
	const stopsNearby = _.map(stops, (item) => {
		return { ...item, icon: (_.includes(favoriteIds, item.id)) ? 'ios-star' : 'ios-star-outline', parent: 'Stops Nearby' };
	});
	const searchLoading = state.search.loading;
	const departureList = _.map(state.search.departureList, (item) => {
		return { ...item, icon: (_.includes(favoriteIds, item.id)) ? 'ios-star' : 'ios-star-outline', parent: 'Search List' };
	});
	return { favorites, favoritesLoading, error, busStop, departureList, favoriteIds, searchLoading, stopsNearby, gpsLoading, allowedGPS };
};

export default connect(mapStateToProps,
	{
		favoriteGet,
		favoriteDelete,
		clearErrors,
		searchStops,
		searchChanged,
		favoriteCreate,
		getNearbyStops,
		setSetting
	})(FavoriteList);
