import _ from 'lodash';
import { connect } from 'react-redux';
import React, { PureComponent } from 'react';
import { View, ScrollView, FlatList, AppState, TouchableWithoutFeedback } from 'react-native';
import firebase from 'react-native-firebase';
import fetch from 'react-native-cancelable-fetch';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
	getDepartures,
	clearDepartures,
	clearErrors,
	favoriteLineToggle,
	favoriteLineLocalAdd,
	favoriteLineLocalRemove,
	incrementStopsOpened,
	setSetting,
} from '../actions';
import { DepartureListItem, Spinner, Message, ListItemSeparator, Popup, Text, MiniMenu } from './common';
import { updateStopsCount, track, isAndroid } from './helpers';
import { colors, component } from './style';

class ShowDepartures extends PureComponent {

	static navigationOptions = ({ navigation }) => ({
			title: navigation.getParam('title'),
			headerRight:
				<View style={{ flexDirection: 'row', justifyContent: 'center' }}>
					{navigation.state.params && navigation.state.params.reloading && <Spinner color={colors.alternative} style={{ marginRight: 5 }} />}
					<TouchableWithoutFeedback
						onPress={navigation.state.params && navigation.state.params.toggleMiniMenu}
					>
						<View style={{
							width: 30,
							height: 30,
							alignItems: 'center',
							justifyContent: 'center',
							right: 5,
						}}>
							<Icon
								name="more-horiz"
								style={{ color: colors.alternative, fontSize: 24 }}
							/>
						</View>
					</TouchableWithoutFeedback>
				</View>
			,
			headerTitleStyle: {
				width: 'auto',
				fontSize: 14,
				fontFamily: (isAndroid()) ? 'sans-serif' : 'System'
			},
	});

	constructor(props) {
		super(props);
		this.state = {
			init: true,
			showHelp: false,
			miniMenuOpen: false,
			timeformatVisible: false,
		};
	}

	componentDidMount() {
		firebase.analytics().setCurrentScreen('Departures', 'Departures');
		this.props.navigation.setParams({ toggleMiniMenu: this.toggleMiniMenu });
		track('Page View', { Page: 'Departures', Stop: this.props.navigation.getParam('busStop'), Parent: this.props.navigation.getParam('parent')});
		this.props.getDepartures({ id: this.props.navigation.getParam('id') });
		updateStopsCount();
		this.props.incrementStopsOpened(this.props.navigation.getParam('id'));
		this.startRefresh();
		AppState.addEventListener('change', this.handleAppStateChange);
	}

	componentWillReceiveProps({ favorites, departures, timestamp }) {
		if (this.state.init) {
			this.props.navigation.setParams({ reloading: false });
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
			this.props.navigation.setParams({ reloading: false });
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
			this.props.getDepartures({ id: this.props.navigation.getParam('id') });
			this.startRefresh();
			track('Page View', { Page: 'Departures', Stop: this.props.navigation.getParam('busStop'), Parent: 'Background' });
		}
	}

	renderMiniMenu = () => {
		return (
			<MiniMenu
				isVisible={this.state.miniMenuOpen}
				onClose={() => this.setState({ miniMenuOpen: false })}
				items={[
					{
						icon: 'access-time',
						content: 'Ändra tidsformat',
						onPress: this.openTimeformat,
					},
					{
						icon: 'help',
						content: 'Hjälp',
						onPress: this.openPopup,
					},
				]}
			/>
		);
	}

	renderTimeformat() {
		return (
			<MiniMenu
				isVisible={this.state.timeformatVisible}
				onClose={() => this.setState({ timeformatVisible: false })}
				items={[
					{
						content: 'Minuter',
						onPress: () => this.onTimeValueChange('minutes'),
					},
					{
						content: 'Klockslag',
						onPress: () => this.onTimeValueChange('clock'),
					},
				]}
			/>
		);
	}

	openTimeformat = () => {
		this.setState({ miniMenuOpen: false });
		setTimeout(() => {
			this.setState({ timeformatVisible: true });
		}, 1);
	}

	toggleMiniMenu = () => {
        this.setState(prevState => ({
            miniMenuOpen: !prevState.miniMenuOpen,
        }));
	}

	onTimeValueChange = (itemValue) => {
		this.props.setSetting('timeFormat', itemValue);
		this.setState({ timeformatVisible: false });
    }

	startRefresh() {
		const self = this;
		self.interval = setInterval(self.refresh.bind(self), 10000);
	}

	refresh = () => {
		this.props.navigation.setParams({ reloading: true });
		this.props.getDepartures({ id: this.props.navigation.getParam('id') });
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
			miniMenuOpen: false,
		});
		setTimeout(() => {
			this.setState({
				showHelp: true,
			})
		}, 1);
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
				onLongPress={() => {
					const localFavorites = this.props.favorites.filter(favorite => favorite.local);
					const localLines = localFavorites.map(({ sname, direction }) => `${sname} ${direction}`.replace('X', ''));
					if (_.includes(localLines, `${item.sname} ${item.direction}`.replace('X', ''))) {
						this.props.favoriteLineLocalRemove(item, this.props.navigation.getParam('id'));
					} else {
						this.props.favoriteLineLocalAdd(item, this.props.navigation.getParam('id'));
					}
				}}

			/>
		);
	}

	closePopup = () => this.setState({ showHelp: false });

	renderPopup() {
		return (
			<Popup
				onPress={this.closePopup}
				isVisible={this.state.showHelp}
			>
				<Text style={component.popup.header}>När går nästa avgång?</Text>
				<Text style={component.popup.text}>Längst till höger på varje rad står det antal minuter kvar till nästa avgång samt avgången efter det. <Text style={{ fontStyle: 'italic' }}>Det går även att ändra avgångstiden till klockslag, och det gör du i menyn på startsidan.</Text></Text>

				<Text style={component.popup.header}>Varför har tiden till nästa avgång ibland färg?</Text>
				<Text style={component.popup.text}>När en avgång snart ska gå från en hållplats så kommer alltid texten &quot;<Text style={{ color: colors.danger }}>Nu</Text>&quot; att visas med röd färg. Ibland kan man också se att en avgång har <Text style={{ color: colors.warning }}>orange</Text> text. Det kan t.ex betyda att en buss har tappat anslutningen med Västtrafik och inte längre är live. Tiden som visas då är ordinarie avgång enligt tidtabell.</Text>

				<Text style={component.popup.header}>Hur sparar man en linje som favorit?</Text>
				<Text style={component.popup.text}>För att spara en linje så räcker det med att klicka på den, linjen kommer då hamna högst upp på alla hållplatser som den linjen kör på. För att spara avgången som favorit för nuvarande hållplats så tryck på avgången och håll ner fingret i en halv sekund.</Text>
			</Popup>
		);
	}

	getItemLayout = (data, index) => ({ length: 51, offset: 51 * index, index })

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
					getItemLayout={this.getItemLayout}
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
				{this.renderTimeformat()}
				{this.renderMiniMenu()}
				{this.renderPopup()}
				{this.renderContent()}
			</View>
		);
	}
}

const MapStateToProps = (state, ownProps) => {
	const lines = _.map(state.fav.lines, (line) => line.replace('X', ''));
	const linesLocal = _.filter(state.fav.linesLocal, ({ stop }) => stop === ownProps.navigation.getParam('id')).map(o => o.lines).map(line => line)[0];
	const { loading, timestamp } = state.departures;
	let favorites = [];
	let departures = [];
	_.forEach(state.departures.departures, item => {
		const { sname, direction } = item;
		const departure = `${sname} ${direction}`.replace('X', '');
		if (_.includes(lines, departure) && _.includes(linesLocal, departure)) {
			favorites = [...favorites, { ...item, global: true, local: true }];
		}
		else if (_.includes(lines, departure)) {
			favorites = [...favorites, { ...item, global: true, local: false }];
		}
		else if (_.includes(linesLocal, departure)) {
			favorites = [...favorites, { ...item, global: false, local: true }];
		} else {
			departures = [...departures, item];
		}
	});
	const { error } = state.errors;
	const { timeFormat } = state.settings;
	return {
		departures: _.sortBy(departures, ['timeLeft', 'timeNext']),
		error,
		favorites: _.sortBy(favorites, ['timeLeft', 'timeNext']),
		loading,
		timestamp,
		timeFormat,
	};
};

export default connect(MapStateToProps,
	{
		getDepartures,
		clearDepartures,
		clearErrors,
		favoriteLineToggle,
		favoriteLineLocalAdd,
		favoriteLineLocalRemove,
		incrementStopsOpened,
		setSetting,
	})(ShowDepartures);
