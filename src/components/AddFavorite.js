import _ from 'lodash';
import React, { Component } from 'react';
import { FlatList, Keyboard, View } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { searchDepartures, searchChanged, favoriteCreate } from '../actions';
import { ListItem, Spinner, Input } from './common';
import colors from './style/color';
import { showMessage } from './helpers/message';

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

	componentDidUpdate() {
		if (this.props.addError || this.props.searchError) {
			const error = this.props.addError || this.props.searchError;
			showMessage(null, error);
		}
	}

	componentWillUnmount() {
		clearTimeout(this.timeout);
	}

	onInputChange(busStop) {
		this.props.searchChanged(busStop);
		clearTimeout(this.timeout);
		this.timeout = setTimeout(() => {
			console.log('Searching for stops.');
			this.setState({ loading: true });
			const { access_token } = this.props;
			this.props.searchDepartures({ busStop, access_token });
		}, 100);
	}

	createDataSource({ departureList }) {
		this.props.departureList = departureList;
	}

	renderItem({ item }) {
		return (
			<ListItem
				text={item.name}
				icon={(_.includes(this.props.favorites, item.id)) ? 'ios-star' : 'ios-star-outline'}
				pressItem={() => {
					Keyboard.dismiss();
					Actions.departures({ busStop: item.name, id: item.id });
				}}
				pressIcon={() => {
					Keyboard.dismiss();
					this.props.favoriteCreate({ busStop: item.name, id: item.id });
				}}
				iconVisible
				iconColor={colors.info}
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
		}

		return (
			<FlatList
				data={this.props.departureList}
				renderItem={this.renderItem.bind(this)}
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
					onChangeText={this.onInputChange.bind(this)}
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
	const { busStop, departureList, searchError, loading } = state.search;
	const { access_token } = state.auth.token;
	const { addError } = state.fav;
	return { busStop, access_token, departureList, addError, searchError, favorites, loading };
};

export default connect(MapStateToProps,
	{ searchDepartures, searchChanged, favoriteCreate }
)(AddFavorite);
