import _ from 'lodash';
import { connect } from 'react-redux';
import React, { PureComponent } from 'react';
import { View, ScrollView, FlatList } from 'react-native';
import { Actions } from 'react-native-router-flux';
import fetch from 'react-native-cancelable-fetch';
import { getDepartures, clearDepartures, clearErrors, favoriteLineToggle } from '../actions';
import { DepartureListItem, Spinner, Message, ListItemSeparator } from './common';
import { updateStopsCount } from './helpers';
import { colors } from './style';

class ShowDepartures extends PureComponent {
	
	componentWillMount() {
		Actions.refresh({ title: this.props.busStop });
		this.props.getDepartures({ id: this.props.id });
		updateStopsCount();
	}

	componentDidMount() {
		this.startRefresh();
	}

	componentWillReceiveProps({ favorites, departures, timestamp }) {
		const favoritesUpdated = JSON.stringify(this.props.favorites) !== JSON.stringify(favorites);
		const departuresUpdated = JSON.stringify(this.props.departures) !== JSON.stringify(departures);
		if (favoritesUpdated) {
			this.populateFavorites(favorites);
		}
		if (departuresUpdated) {
			this.populateDepartures(departures);
		}
		if (this.props.timestamp !== timestamp) {
			Actions.refresh({ right: null });
		}
	}

	componentWillUnmount() {
		clearInterval(this.interval);
		this.interval = null;
		this.props.clearDepartures();
		this.props.clearErrors();
		fetch.abort('getDepartures');
	}

	startRefresh() {
		const self = this;
		self.interval = setInterval(self.refresh.bind(self), 10000);
	}

	refresh() {
		Actions.refresh({ right: () => <Spinner color={colors.alternative} /> });
		this.props.getDepartures({ id: this.props.id });
	}

	populateFavorites(favorites) {
		window.log('Updated favorites:', favorites);
		this.props.favorites = favorites;
	}

	populateDepartures(departures) {
		window.log('Updated departures:', departures);
		this.props.departures = departures;
	}

	ListFooterComponent = () => {
		return (this.props.departures.length === 0 || this.props.favorites.length === 0) ? null : <View style={{ height: 5, backgroundColor: colors.primary }} />;
	}

	renderDepartures = ({ item, index }) => {
		const itemWithNewIndex = { ...item, index };
		return (
			<DepartureListItem
				item={itemWithNewIndex}
				onPress={() => this.props.favoriteLineToggle(item)}
			/>
		);
	}

	renderSpinner() {
		if (this.props.loading) {
			return (
				<Spinner
					size="large"
					color={colors.primary}
				/>
			);
		} else if (this.props.error) {
			return <Message type="warning" message={this.props.error} />;
		}

		return (
			<ScrollView>
				<FlatList
					data={this.props.favorites}
					renderItem={this.renderDepartures}
					keyExtractor={item => item.journeyid}
					ItemSeparatorComponent={ListItemSeparator}
					ListFooterComponent={this.ListFooterComponent}
					getItemLayout={(data, index) => (
						{ length: 51, offset: 51 * index, index }
					)}
					maxToRenderPerBatch={11}
					initialNumToRender={11}
					scrollEnabled={false}
					extraData={this.props.favorites}
				/>
				<FlatList
					data={this.props.departures}
					renderItem={this.renderDepartures}
					title={'departures'}
					keyExtractor={item => item.journeyid}
					ItemSeparatorComponent={ListItemSeparator}
					getItemLayout={(data, index) => (
						{ length: 51, offset: 51 * index, index }
					)}
					maxToRenderPerBatch={11}
					initialNumToRender={11}
					scrollEnabled={false}
					extraData={this.props.departures}
				/>
			</ScrollView>
		);
	}

	render() {
		return (
			<View style={{ flex: 1 }}>
				{this.renderSpinner()}
			</View>
		);
	}
}

const MapStateToProps = (state) => {
	const { lines } = state.fav;
	const { loading, timestamp } = state.departures;
	let favorites = [];
	let departures = [];
	_.forEach(state.departures.departures, item => {
		const { sname, direction } = item;
		const departure = `${sname} ${direction}`;
		if (_.includes(lines, departure)) {
			favorites = [...favorites, item];
		} else {
			departures = [...departures, item];
		}
	});
	const { error } = state.errors;
	return { departures, loading, error, timestamp, favorites };
};

export default connect(MapStateToProps,
	{ getDepartures, clearDepartures, clearErrors, favoriteLineToggle })(ShowDepartures);
