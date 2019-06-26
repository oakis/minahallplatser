import _ from 'lodash';
import { connect } from 'react-redux';
import React, { PureComponent } from 'react';
import { View, ScrollView, FlatList, AppState } from 'react-native';
import { Actions } from 'react-native-router-flux';
import fetch from 'react-native-cancelable-fetch';
import { HelpButton } from '../Router';
import { getDepartures, clearDepartures, clearErrors, favoriteLineToggle, incrementStopsOpened } from '../actions';
import { DepartureListItem, Spinner, Message, ListItemSeparator, Popup, Text } from './common';
import { updateStopsCount, track } from './helpers';
import { colors, component } from './style';

class ShowDepartures extends PureComponent {

	constructor(props) {
		super(props);
		this.state = {
			init: true,
			showHelp: false,
		};
	}

	componentWillMount() {
		track('Page View', { Page: 'Departures', Stop: this.props.busStop, Parent: this.props.parent });
		this.props.getDepartures({ id: this.props.id });
		updateStopsCount();
		this.props.incrementStopsOpened(this.props.id);
	}

	componentDidMount() {
		this.startRefresh();
		AppState.addEventListener('change', this.handleAppStateChange);
	}

	componentWillReceiveProps({ favorites, departures, timestamp }) {
		if (this.state.init) {
			Actions.refresh({ right: HelpButton(this) });
			this.setState({ init: false });
		}
		const favoritesUpdated = JSON.stringify(this.props.favorites) !== JSON.stringify(favorites);
		const departuresUpdated = JSON.stringify(this.props.departures) !== JSON.stringify(departures);
		if (favoritesUpdated) {
			this.populateFavorites(favorites);
		}
		if (departuresUpdated) {
			this.populateDepartures(departures);
		}
		if (this.props.timestamp !== timestamp) {
			Actions.refresh({ right: HelpButton(this) });
		}
	}

	componentWillUnmount() {
		clearInterval(this.interval);
		this.interval = null;
		this.props.clearDepartures();
		this.props.clearErrors();
		fetch.abort('getDepartures');
		AppState.removeEventListener('change', this.handleAppStateChange);
	}

	handleAppStateChange = (nextAppState) => {
		clearInterval(this.interval);
		this.interval = null;
		this.props.clearDepartures();
		this.props.clearErrors();
		fetch.abort('getDepartures');
		if (nextAppState === 'active') {
			this.props.getDepartures({ id: this.props.id });
			this.startRefresh();
			track('Page View', { Page: 'Departures', Stop: this.props.busStop, Parent: 'Background' });
		}
	}

	startRefresh() {
		const self = this;
		self.interval = setInterval(self.refresh.bind(self), 10000);
	}

	refresh = () => {
		Actions.refresh({ right: () => {
			return (
				<View style={{ flexDirection: 'row', justifyContent: 'center' }}>
					<Spinner color={colors.alternative} />
					{HelpButton(this)}
				</View>
			);
		} });
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

	ListFooterComponent = () => {
		return (this.props.departures.length === 0 || this.props.favorites.length === 0) ? null : <View style={{ height: 5, backgroundColor: colors.primary }} />;
	}

	openPopup = () => {
		track('Show Help', { Page: 'Departures' });
		this.setState({
			showHelp: true
		});
	}

	renderDepartures = ({ item, index }) => {
		const { timeFormat } = this.props;
		const itemWithNewIndex = { ...item, index, timeFormat };
		return (
			<DepartureListItem
				item={itemWithNewIndex}
				onPress={() => {
					this.props.favoriteLineToggle(item);
				}}
			/>
		);
	}

	renderPopup() {
		// const { imageWidth, imageHeight } = calcImageSize(0.85, metrics.margin.md * 2.5);
		return (
			<Popup
				onPress={() => this.setState({ showHelp: false })}
				isVisible={this.state.showHelp}
			>
				<Text style={component.popup.header}>När går nästa avgång?</Text>
				<Text style={component.popup.text}>Längst till höger på varje rad står det antal minuter kvar till nästa avgång samt avgången efter det. <Text style={{ fontStyle: 'italic' }}>Det går även att ändra avgångstiden till klockslag, och det gör du i menyn på startsidan.</Text></Text>
				{/* <Image style={component.popup.image} source={require('../assets/help/non-live.png')} style={{ width: imageWidth, height: imageHeight }} ImageResizeMode="cover" /> */}

				<Text style={component.popup.header}>Varför har tiden till nästa avgång ibland färg?</Text>
				<Text style={component.popup.text}>När en avgång snart ska gå från en hållplats så kommer alltid texten "<Text style={{ color: colors.danger }}>Nu</Text>" att visas med röd färg. Ibland kan man också se att en avgång har <Text style={{ color: colors.warning }}>orange</Text> text. Det kan t.ex betyda att en buss har tappat anslutningen med Västtrafik och inte längre är live. Tiden som visas då är ordinarie avgång enligt tidtabell.</Text>
				{/* <Image style={component.popup.image} source={require('../assets/help/non-live.png')} style={{ width: imageWidth, height: imageHeight }} ImageResizeMode="cover" /> */}

				<Text style={component.popup.header}>Hur sparar man en linje som favorit?</Text>
				<Text style={component.popup.text}>För att spara en linje så räcker det med att klicka på den, linjen kommer då hamna högst upp på alla hållplatser som den linjen kör.</Text>
				{/* <Image style={component.popup.image} source={require('../assets/help/non-live.png')} style={{ width: imageWidth, height: imageHeight }} ImageResizeMode="cover" /> */}
			</Popup>
		);
	}

	renderContent() {
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
			<ScrollView>
				<FlatList
					data={this.props.favorites}
					renderItem={this.renderDepartures}
					keyExtractor={item => item.journeyid}
					ItemSeparatorComponent={ListItemSeparator}
					ListFooterComponent={this.ListFooterComponent}
					maxToRenderPerBatch={11}
					initialNumToRender={11}
					scrollEnabled={false}
					extraData={this.state}
				/>
				<FlatList
					data={this.props.departures}
					renderItem={this.renderDepartures}
					keyExtractor={item => item.journeyid}
					ItemSeparatorComponent={ListItemSeparator}
					getItemLayout={(data, index) => (
						{ length: 51, offset: 51 * index, index }
					)}
					maxToRenderPerBatch={11}
					initialNumToRender={11}
					scrollEnabled={false}
					extraData={this.state}
				/>
			</ScrollView>
		);
	}

	render() {
		return (
			<View style={{ flex: 1 }}>
				{this.renderPopup()}
				{this.renderContent()}
			</View>
		);
	}
}

const MapStateToProps = (state) => {
	const lines = _.map(state.fav.lines, (line) => line.replace('X', ''));
	const { loading, timestamp } = state.departures;
	let favorites = [];
	let departures = [];
	_.forEach(state.departures.departures, item => {
		const { sname, direction } = item;
		const departure = `${sname} ${direction}`.replace('X', '');
		if (_.includes(lines, departure)) {
			favorites = [...favorites, item];
		} else {
			departures = [...departures, item];
		}
	});
	const { error } = state.errors;
	const { timeFormat } = state.settings;
	const favoriteDepartures = state.fav.favorites;
	const favoriteIds = _.map(favoriteDepartures, 'id');
	return {
		departures: _.sortBy(departures, ['timeLeft', 'timeNext']),
		error,
		favoriteIds,
		favorites: _.sortBy(favorites, ['timeLeft', 'timeNext']),
		loading,
		timestamp,
		timeFormat,
	};
};

export default connect(MapStateToProps,
	{ getDepartures, clearDepartures, clearErrors, favoriteLineToggle, incrementStopsOpened })(ShowDepartures);
