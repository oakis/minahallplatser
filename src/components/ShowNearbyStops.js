import _ from 'lodash';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { FlatList, View } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { getNearbyStops, favoriteCreate, favoriteDelete } from '../actions';
import { ListItem, Spinner, Message } from './common';
import { colors } from './style';

class ShowNearbyStops extends Component {
	
	componentWillMount() {
		const { access_token } = this.props;
		this.props.getNearbyStops({ access_token });
		this.createDataSource(this.props);
	}

	componentWillReceiveProps(nextProps) {
		this.createDataSource(nextProps);
	}

	createDataSource({ stops }) {
		this.props.stops = stops;
	}

	renderItem({ item }) {
		return (
			<ListItem
				text={item.name}
				icon={(_.includes(this.props.favorites, item.id)) ? 'ios-star' : 'ios-star-outline'}
				pressItem={() => {
					Actions.departures({ busStop: item.name, id: item.id });
				}}
				pressIcon={() => {
					this.props.favoriteCreate({ busStop: item.name, id: item.id });
				}}
				iconVisible
				iconColor={colors.info}
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
		} else if (this.props.searchError) {
			return (
				<Message
					type="warning"
					message={this.props.searchError}
				/>
			);
		}

		return (
			<FlatList
				data={this.props.stops}
				renderItem={this.renderItem.bind(this)}
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
	const { stops, loading, searchError } = state.search;
	const { access_token } = state.auth.token;
	return { access_token, stops, loading, searchError, favorites };
};

export default connect(MapStateToProps, { getNearbyStops, favoriteCreate, favoriteDelete })(ShowNearbyStops);
