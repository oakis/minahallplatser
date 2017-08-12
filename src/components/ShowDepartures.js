import moment from 'moment';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { View, Text, FlatList } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { getDepartures, clearDepartures } from '../actions';
import { DepartureListItem, Spinner } from './common';
import colors from './style/color';

class ShowDepartures extends Component {
	
	componentWillMount() {
		Actions.refresh({ title: this.props.busStop });
		this.props.getDepartures({
			id: this.props.id,
			access_token: this.props.access_token,
			date: moment().format('YYYY-MM-DD'),
			time: moment().format('HH:mm') });
		this.createDataSource(this.props);
	}

	componentDidMount() {
		this.startRefresh();
	}

	componentWillReceiveProps(nextProps) {
		this.createDataSource(nextProps);
	}

	componentWillUnmount() {
		clearInterval(this.interval);
		this.interval = null;
		this.props.clearDepartures();
	}

	startRefresh() {
		const self = this;
		self.interval = setInterval(self.refresh.bind(self), 10000);
	}

	refresh() {
		this.props.getDepartures({
			id: this.props.id,
			access_token: this.props.access_token,
			date: moment().format('YYYY-MM-DD'),
			time: moment().format('HH:mm')
		});
	}

	createDataSource({ departures }) {
		this.props.departures = departures;
		this.props.loading = (departures.length === 0);
	}

	renderDepartures({ item }) {
		return (
			<DepartureListItem item={item} />
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
			return <Text style={{ textAlign: 'center' }}>{this.props.error}</Text>;
		}

		return ( 
			<FlatList
				data={this.props.departures}
				renderItem={this.renderDepartures}
				keyExtractor={item => item.journeyid}
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
	const { departures, time, date, loading, error } = state.departures;
	const { access_token } = state.auth.token;
	console.log('Recieved departures:', departures);
	return { access_token, departures, time, date, loading, error };
};

export default connect(MapStateToProps,
	{ getDepartures, clearDepartures })(ShowDepartures);
