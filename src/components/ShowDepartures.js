import _ from 'lodash';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { View, SectionList } from 'react-native';
import { Actions } from 'react-native-router-flux';
import fetch from 'react-native-cancelable-fetch';
import { getDepartures, clearDepartures, clearErrors, favoriteLineToggle } from '../actions';
import { DepartureListItem, Spinner, Message, ListItemSeparator } from './common';
import { updateStopsCount } from './helpers';
import { colors } from './style';

class ShowDepartures extends Component {
	
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

	renderDepartures = ({ item, index }) => {
		const itemWithNewIndex = { ...item, index };
		return (
			<DepartureListItem
				item={itemWithNewIndex}
				onLongPress={() => this.props.favoriteLineToggle(item)}
			/>
		);
	}

	renderSectionFooter = ({ section }) => {
		return (section.data.length === 0 || section.title === 'departures' || this.props.departures.length === 0) ? null : <View style={{ height: 5, backgroundColor: colors.primary }} />;
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
			<SectionList
				sections={[
					{
						data: this.props.favorites,
						renderItem: this.renderDepartures
					},
					{
						data: this.props.departures,
						renderItem: this.renderDepartures,
						title: 'departures'
					}
				]}
				keyExtractor={item => item.journeyid}
				ItemSeparatorComponent={ListItemSeparator}
				renderSectionFooter={this.renderSectionFooter}
			/>
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
	const favorites = [];
	const departures = [];
	_.forEach(state.departures.departures, item => {
		const { sname, direction } = item;
		const departure = `${sname} ${direction}`;
		if (_.includes(lines, departure)) {
			favorites.push(item);
		} else {
			departures.push(item);
		}
	});
	const { error } = state.errors;
	return { departures, loading, error, timestamp, favorites };
};

export default connect(MapStateToProps,
	{ getDepartures, clearDepartures, clearErrors, favoriteLineToggle })(ShowDepartures);
