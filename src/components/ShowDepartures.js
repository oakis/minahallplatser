import moment from 'moment';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { Spinner, Container, Content, Text, List, ListItem, Left, Body, Right } from 'native-base';
import { Actions } from 'react-native-router-flux';
import { getDepartures, clearDepartures, getToken } from '../actions';
import minahallplatser from '../themes/minahallplatser';

class ShowDepartures extends Component {
	
	componentWillMount() {
		Actions.refresh({ title: this.props.busStop });
		this.props.getToken();
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
		this.props.getToken();
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

	renderDepartures(stop) {
		let timeLeft = '';
		if (stop.timeLeft === 0) {
			timeLeft = 'Nu';
		} else {
			timeLeft = stop.timeLeft;
		}
		const getFontColor = () => {
			if (!stop.rtTime) {
				return minahallplatser.brandWarning;
			} else if (isNaN(timeLeft)) {
				return minahallplatser.brandDanger;
			}
			return '#000';
		};
		const height = 50;

		const styles = {
			listStyle: {
				flex: 1,
				height,
				backgroundColor: (stop.index % 2) ? '#fff' : '#efefef',
				marginLeft: 0,
				paddingRight: 10
			},
			col1Style: {
				height,
				width: 50,
				backgroundColor: 'red',
				alignItems: 'center',
				justifyContent: 'center'
			},
			col2Style: {
				height,
				width: 50,
				flex: 1,
				backgroundColor: 'blue',
				justifyContent: 'space-between'
			},
			col3Style: {
				height,
				backgroundColor: 'green',
				width: 60,
				alignItems: 'flex-end',
				justifyContent: 'center'
			},
			stopNumStyle: {
				width: 48,
				height: 48,
				backgroundColor: stop.fgColor,
				borderWidth: 1,
				borderRadius: 3,
				color: stop.bgColor
			},
			departureStyle: {
				fontSize: 24,
				color: getFontColor()
			},
			nextDepStyle: {
				fontSize: 12
			},
			directionStyle: {
				fontWeight: 'bold'
			}
		};
		const { stopNumStyle, col1Style, col2Style, col3Style,
				departureStyle, nextDepStyle, directionStyle, listStyle } = styles;
		return (
			<ListItem
				style={listStyle}
			>
				<Left style={col1Style}>
					<Text style={stopNumStyle}>{stop.sname}</Text>
				</Left>
				<Body style={col2Style}>	
					<Text style={directionStyle}>{stop.direction}</Text>
					<Text>Läge {stop.track}</Text>
				</Body>
				<Right style={col3Style}>		
					<Text style={departureStyle}>{timeLeft}</Text>
					<Text style={nextDepStyle}>{stop.nextStop}</Text>
				</Right>
			</ListItem>
		);
	}

	renderSpinner() {
		if (this.props.loading) {
			return (
				<Spinner
					style={{
						flex: 1,
						flexDirection: 'column',
						justifyContent: 'center',
						alignItems: 'center'
					}}
				/>
			);
		} else if (this.props.error) {
			return <Text style={{ textAlign: 'center' }}>{this.props.error}</Text>;
		}

		return ( 
			<List
				dataArray={this.props.departures}
				renderRow={this.renderDepartures.bind(this)}
			/>
		);
	}

	render() {
		return (
			<Container>
				<Content>
					{this.renderSpinner()}
				</Content>
			</Container>
		);
	}
}

const MapStateToProps = (state) => {
	const { departures, time, date, loading, error } = state.departures;
	const { access_token } = state.auth.token;
	return { access_token, departures, time, date, loading, error };
};

export default connect(MapStateToProps,
	{ getDepartures, clearDepartures, getToken })(ShowDepartures);
