import { connect } from 'react-redux';
import React, { Component } from 'react';
import { Spinner, Container, Content, Text, List, ListItem, Icon } from 'native-base';
import { Actions } from 'react-native-router-flux';
import { getNearbyStops, favoriteCreate } from '../actions';
import minahallplatser from '../themes/minahallplatser';

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

	renderStops(stop) {
		return (
			<ListItem
				iconRight
				button
				onPress={() => {
					Actions.departures({ busStop: stop.name, id: stop.id });
				}}
			>
				<Text>
					{stop.name}
				</Text>
				<Icon
					name='ios-star-outline'
					style={{ color: '#FFA500' }}
					onPress={() => {
						this.props.favoriteCreate({ busStop: stop.name, id: stop.id });
					}}
				/>
			</ListItem>
		);
	}

	renderList() {
		if (this.props.loading) {
			return (
				<Content
					contentContainerStyle={{
						flex: 1,
						flexDirection: 'column',
						justifyContent: 'center',
						alignItems: 'center'
					}}
				>
					<Spinner />
				</Content>
			);
		} else if (this.props.searchError) {
			return (
				<Content>
					<Text style={{ textAlign: 'center' }}>{this.props.searchError}</Text>
				</Content>
			);
		}

		return (
			<Content>
				<List
					dataArray={this.props.stops}
					renderRow={this.renderStops.bind(this)}
				/>
			</Content>
		);
	}

	render() {
		return (
			<Container>
				{this.renderList()}
			</Container>
		);
	}
}

const MapStateToProps = (state) => {
	const { stops, loading, searchError } = state.search;
	const { access_token } = state.auth.token;
	return { access_token, stops, loading, searchError };
};

export default connect(MapStateToProps, { getNearbyStops, favoriteCreate })(ShowNearbyStops);
