import { connect } from 'react-redux';
import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import { Actions } from 'react-native-router-flux';
import fetch from 'react-native-cancelable-fetch';
import { getDepartures, clearDepartures, clearErrors } from '../actions';
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

	componentWillReceiveProps({ departures, timestamp }) {
		if (JSON.stringify(this.props.departures) !== JSON.stringify(departures)) {
			this.createDataSource(departures);
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

	createDataSource(departures) {
		window.log('Updated departure list:', departures);
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
			return <Message type="warning" message={this.props.error} />;
		}

		return ( 
			<FlatList
				data={this.props.departures}
				renderItem={this.renderDepartures}
				keyExtractor={item => item.journeyid}
				ItemSeparatorComponent={ListItemSeparator}
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
	const { departures, loading, timestamp } = state.departures;
	const { error } = state.errors;
	return { departures, loading, error, timestamp };
};

export default connect(MapStateToProps,
	{ getDepartures, clearDepartures, clearErrors })(ShowDepartures);
