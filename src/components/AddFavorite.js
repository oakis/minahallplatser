import React, { Component } from 'react';
import { ToastAndroid } from 'react-native';
import { connect } from 'react-redux';
import { Container, Content, InputGroup, Input, Text, ListItem, List, Icon } from 'native-base';
import { searchDepartures, searchChanged, favoriteCreate } from '../actions';

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
			ToastAndroid.showWithGravity(error, ToastAndroid.SHORT, ToastAndroid.CENTER);
		}
	}

	onInputChange(busStop) {
		this.props.searchChanged(busStop);
		const { access_token } = this.props;
		this.props.searchDepartures({ busStop, access_token });
	}

	createDataSource({ departureList }) {
		this.props.departureList = departureList;
	}

	renderDepartures(stop) {
		return (
			<ListItem
				iconRight
				button
				onPress={() => {
					this.props.favoriteCreate({ busStop: stop.name, id: stop.id });
				}}
			>
				<Text>
					{stop.name}
				</Text>
				<Icon name='ios-star-outline' style={{ color: '#FFA500' }} />
			</ListItem>
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
					<List
						dataArray={this.props.departureList}
						renderRow={this.renderDepartures.bind(this)}
					/>
				</Content>
			</Container>
		);
	}
}

const MapStateToProps = (state) => {
	const { busStop, departureList, searchError } = state.search;
	const { access_token } = state.auth.token;
	const { addError } = state.fav;
	return { busStop, access_token, departureList, addError, searchError };
};

export default connect(MapStateToProps,
	{ searchDepartures, searchChanged, favoriteCreate }
)(AddFavorite);
