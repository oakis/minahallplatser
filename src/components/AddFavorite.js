import _ from 'lodash';
import React, { Component } from 'react';
import { FlatList, Keyboard } from 'react-native';
import { connect } from 'react-redux';
import { Container, Content, InputGroup, Input } from 'native-base';
import { Actions } from 'react-native-router-flux';
import { searchDepartures, searchChanged, favoriteCreate } from '../actions';
import { ListItem } from './common/ListItem';
import colors from './style/color';
import { showMessage } from './helpers/message';

class AddFavorite extends Component {

	componentWillMount() {
		this.createDataSource(this.props);
	}

	componentWillReceiveProps(nextProps) {
		this.createDataSource(nextProps);
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
					Actions.departures(item);
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

	render() {
		return (
			<Container>
				<Content
					keyboardShouldPersistTaps="always"
					keyboardDismissMode="on-drag"
				>
					<InputGroup>
						<Input
							autoFocus
							returnKeyType="search"
							label="Sök"
							placeholder="Sök hållplats.."
							onChangeText={this.onInputChange.bind(this)}
							value={this.props.busStop}
						/>
					</InputGroup>
					<FlatList
						data={this.props.departureList}
						renderItem={this.renderItem.bind(this)}
						keyExtractor={item => item.id}
						keyboardShouldPersistTaps="always"
					/>
				</Content>
			</Container>
		);
	}
}

const MapStateToProps = (state) => {
	const favorites = _.map(_.values(state.fav.list), 'id');
	const { busStop, departureList, searchError } = state.search;
	const { access_token } = state.auth.token;
	const { addError } = state.fav;
	return { busStop, access_token, departureList, addError, searchError, favorites };
};

export default connect(MapStateToProps,
	{ searchDepartures, searchChanged, favoriteCreate }
)(AddFavorite);
