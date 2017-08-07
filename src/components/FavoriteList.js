import _ from 'lodash';
import React, { Component } from 'react';
import { Keyboard, Alert, AsyncStorage, FlatList, TouchableOpacity } from 'react-native';
import firebase from 'firebase';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { Container, Content, Text, Spinner } from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import { favoriteGet, favoriteDelete } from '../actions';
import minahallplatser from '../themes/minahallplatser';

class FavoriteList extends Component {

	constructor(props) {
		super(props);
		this.favoriteDelete = this.props.favoriteDelete.bind(this);
	}

	componentWillMount() {
		Keyboard.dismiss();
		firebase.auth().onAuthStateChanged((fbUser) => {
			AsyncStorage.getItem('minahallplatser-user').then((dataJson) => {
				const user = JSON.parse(dataJson);
				if (user.uid === fbUser.uid) {
					this.props.favoriteGet(user);
				}
			});
			this.createDataSource(this.props);
		});
	}

	componentWillReceiveProps(nextProps) {
		this.createDataSource(nextProps);
	}

	createDataSource({ favorites }) {
		this.props.favorites = favorites;
	}

	keyExtractor(item) {
		return item.id;
	}

	renderItem({ item }) {
		const styles = {
			view: {
				flex: 1,
				flexDirection: 'row',
				justifyContent: 'space-between',
				marginTop: 5,
				marginHorizontal: 10,
				paddingBottom: 5,
				borderBottomWidth: 1,
				borderBottomColor: '#dedede'
			},
			text: {
				justifyContent: 'flex-start'
			},
			icon: {
				justifyContent: 'flex-end',
				color: minahallplatser.brandDanger
			}
		};
		return (
			<TouchableOpacity
				iconRight
				button
				onPress={() => Actions.departures(item)}
				style={styles.view}
			>
				<Text style={styles.text}>
					{item.busStop}
				</Text>
				<Icon
					name='ios-remove-circle-outline'
					style={styles.icon}
					size={24}
					onPress={() => {
						Alert.alert(
							item.busStop,
							`Är du säker att du vill ta bort ${item.busStop}?`,
							[
								{ text: 'Avbryt' },
								{ text: 'Ja', onPress: () => favoriteDelete(item.id) }
							]
						);
					}}
				/>
			</TouchableOpacity>
		);
	}

	renderList() {
		if (this.props.loading) {
			return (
				<Content contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}>
					<Spinner />
				</Content>
			);
		} else if (this.props.error) {
			return (
				<Content>
					<Text style={{ textAlign: 'center' }}>{this.props.error}</Text>
				</Content>
			);
		} else if (this.props.favorites.length > 0) {
			return (
				<Content>
					<FlatList
						data={this.props.favorites}
						renderItem={this.renderItem}
						favoriteDelete={this.props.favoriteDelete}
						keyExtractor={this.keyExtractor}
					/>
				</Content>
			);
		}

		return (
			<Content>
				<Text style={{ textAlign: 'center' }}>Du har inte sparat några favoriter än.</Text>
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

const mapStateToProps = state => {
	const favorites = _.values(state.fav.list);
	console.log(favorites);
	const { loading, error } = state.fav;
	return { favorites, loading, error };
};

export default connect(mapStateToProps, { favoriteGet, favoriteDelete })(FavoriteList);
