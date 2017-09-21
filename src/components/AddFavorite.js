import _ from 'lodash';
import fetch from 'react-native-cancelable-fetch';
import React, { Component } from 'react';
import { FlatList, Keyboard, View } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { searchDepartures, searchChanged, favoriteCreate, clearErrors } from '../actions';
import { ListItem, Spinner, Input, Message } from './common';
import { colors } from './style';

class AddFavorite extends Component {

	constructor(props) {
		super(props);
		this.state = {
			loading: false
		};
	}

	componentWillMount() {
		this.createDataSource(this.props);
	}

	componentWillReceiveProps(nextProps) {
		this.createDataSource(nextProps);
		if (nextProps.loading !== this.state.loading) {
			this.setState({ loading: nextProps.loading });
		}
	}

	componentWillUnmount() {
		clearTimeout(this.timeout);
		this.props.clearErrors();
		fetch.abort('searchDepartures');
	}

	onInputChange = (busStop) => {
		fetch.abort('searchDepartures');
		this.props.searchChanged(busStop);
		clearTimeout(this.timeout);
		this.timeout = setTimeout(() => {
			window.log('Searching for stops.');
			this.setState({ loading: true });
			this.props.searchDepartures({ busStop });
		}, 100);
	}

	createDataSource({ departureList }) {
		this.props.departureList = departureList;
	}

	renderItem = ({ item }) => {
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

	renderList() {
		if (this.state.loading) {
			return (
				<View style={{ marginTop: 10 }}>
					<Spinner
						size="large"
						color={colors.primary}
						noFlex
					/>
				</View>
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
				data={this.props.departureList}
				renderItem={this.renderItem}
				keyExtractor={item => item.id}
				keyboardShouldPersistTaps="always"
			/>
		);
	}

	render() {
		return (
			<View>
				<Input
					autoFocus
					returnKeyType="search"
					placeholder="Sök hållplats.."
					onChangeText={this.onInputChange}
					value={this.props.busStop}
					icon="ios-search"
				/>
				{this.renderList()}
			</View>
		);
	}
}

const MapStateToProps = (state) => {
	const favorites = _.map(_.values(state.fav.list), 'id');
	const { busStop, loading } = state.search;
	const { error } = state.errors;
	const departureList = _.map(state.search.departureList, (item) => {
		return { ...item, icon: (_.includes(favorites, item.id)) ? 'ios-star' : 'ios-star-outline' };
	});
	return { busStop, departureList, error, favorites, loading };
};

export default connect(MapStateToProps,
	{ searchDepartures, searchChanged, favoriteCreate, clearErrors }
)(AddFavorite);
