import _ from 'lodash';
import React, { Component } from 'react';
import { Keyboard, Alert, AsyncStorage, FlatList, View, Text } from 'react-native';
import firebase from 'firebase';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { favoriteGet, favoriteDelete } from '../actions';
import { ListItem } from './common/ListItem';
import { Spinner } from './common/Spinner';
import colors from './style/color';


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
				pressItem={() => Actions.departures(item)}
				pressIcon={() => {
					Alert.alert(
						item.busStop,
						`Är du säker att du vill ta bort ${item.busStop}?`,
						[
							{ text: 'Avbryt' },
							{
								text: 'Ja',
								onPress: () => {
									console.log(this.props);
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
				<Text style={{ textAlign: 'center' }}>{this.props.error}</Text>
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
			<Text style={{ textAlign: 'center' }}>Du har inte sparat några favoriter än.</Text>
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
	const { loading, error } = state.fav;
	return { favorites, loading, error };
};

export default connect(mapStateToProps, { favoriteGet, favoriteDelete })(FavoriteList);
