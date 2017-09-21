import _ from 'lodash';
import fetch from 'react-native-cancelable-fetch';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { FlatList, View } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { getNearbyStops, favoriteCreate, favoriteDelete, clearErrors } from '../actions';
import { ListItem, Spinner, Message } from './common';
import { colors } from './style';

class ShowNearbyStops extends Component {
	
	componentWillMount() {
		this.props.getNearbyStops();
		this.createDataSource(this.props);
	}

	componentWillReceiveProps(nextProps) {
		this.createDataSource(nextProps);
	}

	componentWillUnmount() {
		this.props.clearErrors();
		fetch.abort('getNearbyStops');
	}

	createDataSource({ stops }) {
		this.props.stops = stops;
	}

	renderItem = ({ item }) => {
		return (
			<ListItem
				text={item.name}
				icon={(_.includes(this.props.favorites, item.id)) ? 'ios-star' : 'ios-star-outline'}
				pressItem={async () => {
					await this.props.clearErrors();
					Actions.departures({ busStop: item.name, id: item.id });
				}}
				pressIcon={() => {
					this.props.favoriteCreate({ busStop: item.name, id: item.id });
				}}
				iconVisible
				iconColor={colors.warning}
			/>
		);
	}

	renderList() {
		if (this.props.loading) {
			return (
				<Spinner
					size="large"
					color={colors.primary}
				/>
			);
		} else if (this.props.error) {
			return (
				<Message
					type="warning"
					message={this.props.error}
				/>
			);
		}

		return (
			<FlatList
				data={this.props.stops}
				renderItem={this.renderItem}
				keyExtractor={item => item.id}
			/>
		);
	}

	render() {
		return (
			<View style={{ flex: 1 }}>
				{this.renderList()}
			</View>
		);
	}
}

const MapStateToProps = (state) => {
	const favorites = _.map(_.values(state.fav.list), 'id');
	const { stops, loading } = state.search;
	const { error } = state.errors;
	return { stops, loading, error, favorites };
};

export default connect(MapStateToProps, { getNearbyStops, favoriteCreate, favoriteDelete, clearErrors })(ShowNearbyStops);
