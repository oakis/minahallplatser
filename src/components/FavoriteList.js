import _ from 'lodash';
import fetch from 'react-native-cancelable-fetch';
import React, { PureComponent } from 'react';
import { Keyboard, Alert, AsyncStorage, FlatList, View, ScrollView, Text, NativeModules } from 'react-native';
import firebase from 'firebase';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { favoriteGet, favoriteDelete, clearErrors, searchStops, searchChanged, favoriteCreate, getNearbyStops } from '../actions';
import { ListItem, Spinner, Message, Input, ListItemSeparator, ListHeading } from './common';
import { colors, component, metrics } from './style';
import { CLR_SEARCH, CLR_ERROR, SEARCH_BY_GPS_FAIL } from '../actions/types';
import { store } from '../App';
import { track } from './helpers';


class FavoriteList extends PureComponent {

	constructor(props) {
		super(props);
		this.state = {
			editing: false
		}
	}

	componentWillMount() {
		Keyboard.dismiss();
		firebase.auth().onAuthStateChanged((fbUser) => {
			if (fbUser && fbUser.uid) {
				AsyncStorage.getItem('minahallplatser-user').then((dataJson) => {
					const user = JSON.parse(dataJson);
					if (user && user.uid === fbUser.uid) {
						this.props.favoriteGet(user);
					}
				});
			}
		});
		if (this.props.stopsNearby.length == 0) {
			this.props.getNearbyStops();
		}
		track('Page View', { Page: 'Dashboard' });
	}

	componentWillUnmount() {
		fetch.abort('searchStops');
		this.props.clearErrors();
	}

	onInputChange = (busStop) => {
		fetch.abort('searchStops');
		this.props.searchChanged(busStop);
		this.props.searchStops({ busStop });
	}

	resetSearch = () => {
		store.dispatch({ type: CLR_SEARCH });
		store.dispatch({ type: CLR_ERROR });
	}

	refreshNearbyStops = () => {
		track('Refresh NearbyStops');
		store.dispatch({ type: SEARCH_BY_GPS_FAIL });
		this.props.getNearbyStops();
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
					this.props.favoriteCreate({ busStop: item.name, id: item.id });
				}}
				iconVisible
				iconColor={colors.warning}
			/>
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
				<ListHeading text={'Hållplatser nära dig'} icon={'md-refresh'} onPress={() => this.refreshNearbyStops()} loading={this.props.gpsLoading} />
				{(!this.props.gpsLoading && this.props.stopsNearby.length == 0) ? <Text style={{ marginTop: metrics.margin.md, marginLeft: metrics.margin.md }}>Vi kunde inte hitta några hållplatser nära dig.</Text> : null}
				<FlatList
					data={this.props.stopsNearby}
					renderItem={this.renderSearchItem}
					keyExtractor={item => item.id}
					ItemSeparatorComponent={ListItemSeparator}
					scrollEnabled={false}
					keyboardShouldPersistTaps='always'
				/>
				<ListHeading text={'Mina hållplatser'} icon={'edit'} iconSize={16} onPress={() => {  track('Edit Stops Toggle', { On: !this.state.editing }); this.setState({ editing: !this.state.editing }); }} />
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
					<Message
						type="warning"
						message={'Du har inte sparat några favoriter än.'}
					/> : null
				}
			</ScrollView>
		);
	}
}

const mapStateToProps = state => {
	const { favorites } = state.fav;
	const favoritesLoading = state.fav.loading;
	const { error } = state.errors;
	const favoriteIds = _.map(favorites, 'id');
	const { busStop, stops, gpsLoading } = state.search;
	const stopsNearby = _.map(stops, (item) => {
		return { ...item, icon: (_.includes(favoriteIds, item.id)) ? 'ios-star' : 'ios-star-outline' };
	});
	const searchLoading = state.search.loading;
	const departureList = _.map(state.search.departureList, (item) => {
		return { ...item, icon: (_.includes(favoriteIds, item.id)) ? 'ios-star' : 'ios-star-outline' };
	});
	return { favorites, favoritesLoading, error, busStop, departureList, favoriteIds, searchLoading, stopsNearby, gpsLoading };
};

export default connect(mapStateToProps,
	{
		favoriteGet, favoriteDelete, clearErrors, searchStops,
		searchChanged, favoriteCreate, getNearbyStops
	})(FavoriteList);
