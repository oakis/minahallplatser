import _ from 'lodash';
import fetch from 'react-native-cancelable-fetch';
import React, { Component } from 'react';
import { Keyboard, Alert, AsyncStorage, FlatList, View, ScrollView } from 'react-native';
import firebase from 'firebase';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { favoriteGet, favoriteDelete, clearErrors, searchDepartures, searchChanged, favoriteCreate, getNearbyStops } from '../actions';
import { ListItem, Spinner, Message, Input, ListItemSeparator } from './common';
import { colors } from './style';
import { CLR_SEARCH, CLR_ERROR } from '../actions/types';
import { store } from '../App';


class FavoriteList extends Component {

	componentWillMount() {
		Keyboard.dismiss();
		firebase.auth().onAuthStateChanged((fbUser) => {
			AsyncStorage.getItem('minahallplatser-user').then((dataJson) => {
				const user = JSON.parse(dataJson);
				if (user.uid === fbUser.uid) {
					this.props.favoriteGet(user);
				}
			});
			this.populateFavorites(this.props);
			this.props.getNearbyStops();
		});
	}

	componentWillReceiveProps(nextProps) {
		this.populateSearchResults(nextProps);
		this.populateFavorites(nextProps);
	}

	componentWillUnmount() {
		fetch.abort('searchDepartures');
		this.props.clearErrors();
	}

	onInputChange = (busStop) => {
		fetch.abort('searchDepartures');
		this.props.searchChanged(busStop);
		this.props.searchDepartures({ busStop });
	}

	resetSearch = () => {
		store.dispatch({ type: CLR_SEARCH });
		store.dispatch({ type: CLR_ERROR });
	}

	populateSearchResults({ departureList }) {
		this.props.departureList = departureList;
	}


	populateFavorites({ favorites }) {
		this.props.favorites = favorites;
	}

	renderFavoriteItem = ({ item }) => {
		return (
			<ListItem
				text={item.busStop}
				icon='ios-remove-circle-outline'
				pressItem={async () => {
					Keyboard.dismiss();
					await this.props.clearErrors();
					Actions.departures(item);
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
				iconVisible={this.props.editing}
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
					Actions.departures({ busStop: item.name, id: item.id });
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
				<FlatList
					data={this.props.departureList}
					renderItem={this.renderSearchItem}
					keyExtractor={item => item.id}
					ItemSeparatorComponent={ListItemSeparator}
					scrollEnabled={false}
					keyboardShouldPersistTaps='always'
				/>
				{(this.props.departureList.length > 0) ? <View style={{ height: 5, backgroundColor: colors.primary }} /> : null}
				<FlatList
					data={this.props.stopsNearby}
					renderItem={this.renderSearchItem}
					keyExtractor={item => item.id}
					ItemSeparatorComponent={ListItemSeparator}
					scrollEnabled={false}
					keyboardShouldPersistTaps='always'
				/>
				{(this.props.stopsNearby.length > 0) ? <View style={{ height: 5, backgroundColor: colors.primary }} /> : null}
				<FlatList
					data={this.props.favorites}
					renderItem={this.renderFavoriteItem}
					keyExtractor={item => item.id}
					ItemSeparatorComponent={ListItemSeparator}
					scrollEnabled={false}
					keyboardShouldPersistTaps='always'
					extraData={this.props.editing}
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
					loading={this.props.searchLoading}
					iconRight="ios-close"
					iconRightPress={this.resetSearch}
					style={{ marginLeft: 5, marginRight: 5, marginBottom: 0 }}
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
	const { busStop, stops } = state.search;
	const stopsNearby = _.map(stops, (item) => {
		return { ...item, icon: (_.includes(favoriteIds, item.id)) ? 'ios-star' : 'ios-star-outline' };
	});
	const searchLoading = state.search.loading;
	const departureList = _.map(state.search.departureList, (item) => {
		return { ...item, icon: (_.includes(favoriteIds, item.id)) ? 'ios-star' : 'ios-star-outline' };
	});
	return { favorites, favoritesLoading, error, busStop, departureList, favoriteIds, searchLoading, stopsNearby };
};

export default connect(mapStateToProps, { favoriteGet, favoriteDelete, clearErrors, searchDepartures, searchChanged, favoriteCreate, getNearbyStops })(FavoriteList);
