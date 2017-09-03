import _ from 'lodash';
import React, { Component } from 'react';
import { Keyboard, Alert, AsyncStorage, FlatList, View } from 'react-native';
import firebase from 'firebase';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { favoriteGet, favoriteDelete, clearErrors } from '../actions';
import { ListItem, Spinner, Message } from './common';
import { colors } from './style';


class FavoriteList extends Component {

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

	renderItem({ item }) {
		return (
			<ListItem
				text={item.busStop}
				icon='ios-remove-circle-outline'
				pressItem={async () => {
					await this.props.clearErrors();
					Actions.departures(item);
				}}
				pressIcon={() => {
					Alert.alert(
						item.busStop,
						`Är du säker att du vill ta bort ${item.busStop}?`,
						[
							{ text: 'Avbryt' },
							{
								text: 'Ja',
								onPress: () => {
									this.props.favoriteDelete(item.id);
								}
							}
						]
					);
				}}
				iconVisible
				iconColor={colors.danger}
			/>
		);
	}

	renderList() {
		if (this.props.loading) {
			return (
				<Spinner
					size="large"
					color={colors.primary}
				/>
			);
		} else if (this.props.error) {
			return (
				<Message
					message={this.props.error}
					type="danger"
				/>
			);
		} else if (this.props.favorites.length > 0) {
			return (
				<FlatList
					data={this.props.favorites}
					renderItem={this.renderItem.bind(this)}
					keyExtractor={item => item.id}
				/>
			);
		}

		return (
			<Message
				message="Du har inte sparat några favoriter än."
				type="info"
			/>
		);
	}

	render() {
		return (
			<View style={{ flex: 1 }}>
				{this.renderList()}
			</View>
		);
	}
}

const mapStateToProps = state => {
	const favorites = _.values(state.fav.list);
	const { loading } = state.fav;
	const { error } = state.errors;
	return { favorites, loading, error };
};

export default connect(mapStateToProps, { favoriteGet, favoriteDelete, clearErrors })(FavoriteList);
