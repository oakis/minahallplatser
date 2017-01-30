import _ from 'lodash';
import React, { Component } from 'react';
import { Keyboard, Alert, AsyncStorage } from 'react-native';
import firebase from 'firebase';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { Container, Content, List, ListItem, Text, Spinner, Icon } from 'native-base';
import { favoriteGet, favoriteDelete } from '../actions';

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

	renderRow(favorite) {
		return (
			<ListItem
				iconRight
				button
				onPress={() => Actions.departures(favorite)}
			>
				<Text>
					{favorite.busStop}
				</Text>
				<Icon
					name='ios-remove-circle-outline'
					style={{ color: '#f00' }}
					onPress={() => {
						Alert.alert(
							favorite.busStop,
							`Är du säker att du vill ta bort ${favorite.busStop}?`,
							[
								{ text: 'Avbryt' },
								{ text: 'Ja', onPress: () => favoriteDelete(favorite.id) }
							]
						);
					}}
				/>
			</ListItem>
		);
	}

	renderList() {
		if (this.props.loading) {
			return (
				<Content contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}>
					<Spinner color="blue" />
				</Content>
			);
		} else if (this.props.error) {
			return (
				<Content>
					<Text style={{ textAlign: 'center' }}>{this.props.error}</Text>
				</Content>
			);
		} else if (this.props.favorites.length === 0) {
			return (
				<Content>
					<Text style={{ textAlign: 'center' }}>Du har inte sparat några favoriter än.</Text>;
				</Content>
			);
		}

		return ( 
			<Content>
				<List
					dataArray={this.props.favorites}
					renderRow={this.renderRow}
					favoriteDelete={this.props.favoriteDelete}
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

const mapStateToProps = state => {
	const favorites = _.values(state.fav.list);
	const { loading, error } = state.fav;
	return { favorites, loading, error };
};

export default connect(mapStateToProps, { favoriteGet, favoriteDelete })(FavoriteList);
