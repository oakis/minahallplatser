import moment from 'moment';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { Spinner, Container, Content, Text, List, ListItem, Grid, Row, Col } from 'native-base';
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
		console.log('refreshing');
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
				console.log(stop.direction, '*** ordinarie ***')
				return minahallplatser.brandWarning;
			} else if (isNaN(timeLeft)) {
				console.log('--- går nu ---')
				return minahallplatser.brandDanger;
			}
			return '#000';
		}
		const styles = {
			rowStyle: {
				height: 50
			},
			iconStyle: {
				color: stop.bgColor
			},
			col1Style: {
				backgroundColor: stop.fgColor,
				borderWidth: 2,
				borderRadius: 3,
				width: 50,
				alignItems: 'center',
				justifyContent: 'center'
			},
			col2Style: {
				flex: 1,
				marginLeft: 15,
				justifyContent: 'center'
			},
			col3Style: {
				width: 60,
				alignItems: 'flex-end',
				justifyContent: 'center'
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
		const { rowStyle, iconStyle, col1Style, col2Style, col3Style,
				departureStyle, nextDepStyle, directionStyle } = styles;
		return (
			<ListItem style={{ backgroundColor: (stop.index % 2) ? '#fff' : '#efefef', marginLeft: 0, paddingLeft: 17 }}>
					<Row style={rowStyle}>
						<Col style={col1Style}>
							<Text style={iconStyle}>{stop.sname}</Text>
						</Col>
						<Col style={col2Style}>
							<Row>
								<Text style={directionStyle}>{stop.direction}</Text>
							</Row>
							<Row>
								<Text>Läge {stop.track}</Text>
							</Row>
						</Col>
						<Col style={col3Style}>
							<Row style={{ alignItems: 'center' }}>
								<Col size={2}>
									<Text style={departureStyle}>{timeLeft}</Text>
								</Col>
								<Col size={1}>
									<Text style={nextDepStyle}>{stop.nextStop}</Text>
								</Col>
							</Row>
						</Col>
					</Row>
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
			<Container theme={minahallplatser}>
				<Content>
					<Grid>
						{this.renderSpinner()}
					</Grid>
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

export default connect(MapStateToProps, { getDepartures, clearDepartures, getToken })(ShowDepartures);
