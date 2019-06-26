import React, { PureComponent } from 'react';
import { View, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import { Text } from './';
import { colors } from '../style';

function formatTime(minutes) {
    const duration = moment.duration(minutes, 'minutes');
    return (minutes > 59) ? `${duration.hours()}h ${duration.minutes()}m` : minutes;
}

export class DepartureListItem extends PureComponent {

    constructor(props) {
        super(props);

        this.getDepartureTypeIcon = this.getDepartureTypeIcon.bind(this);
    }

    getDepartureTypeIcon = (type, color) => {
		let iconName;
		switch (type) {
            case 'BOAT':
                iconName = 'directions_boat';
                break;
            case 'BUS':
                iconName = 'directions-bus';
                break;
            case 'TAXI':
                iconName = 'local-taxi';
                break;
            case 'TRAM':
                iconName = 'tram';
                break;
            case 'VAS':
            case 'REG':
                iconName = 'train';
                break;
            default:
                return null;
		}
		return <Icon name={iconName} size={15} color={color} />;
	}

    render() {
        const { item, onPress } = this.props;
        const shouldShowMin = item.timeFormat === 'minutes';
        const { clockLeft, clockNext } = item;
        const timeLeft = (item.timeLeft <= 0) ? 'Nu' : formatTime(item.timeLeft);
        const timeNext = (item.timeNext <= 0 && item.timeNext !== null) ? 'Nu' : formatTime(item.timeNext);
        const left = shouldShowMin ? timeLeft : clockLeft;
        const next = shouldShowMin ? timeNext : clockNext;
        const getFontColor = () => {
            if (!item.isLive) {
                return colors.warning;
            } else if (timeLeft === 'Nu') {
                return colors.danger;
            }
            return colors.default;
        };
        const getFontSize = () => {
            if (!shouldShowMin) {
                return 18;
            } else if (item.timeLeft > 59) {
                return 14;
            }
            return 24;
        };
        const height = 50;

        const styles = {
            listStyle: {
                flex: 1,
                backgroundColor: (item.index % 2) ? colors.alternative : colors.lightgrey,
                marginLeft: 0,
                paddingTop: 5,
                paddingBottom: 5,
                flexDirection: 'row',
                alignItems: 'center'
            },
            col1Style: {
                height: 40,
                width: 50,
                alignItems: 'center',
                justifyContent: 'center',
                paddingLeft: 7
            },
            col2Style: {
                flex: 1,
                paddingLeft: 10,
                justifyContent: 'center'
            },
            col3Style: {
                height,
                width: 56,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 5
            },
            stopNumStyle: {
                flex: 1,
                height: 40,
                width: 40,
                backgroundColor: item.fgColor,
                borderWidth: 2,
                borderRadius: 3,
                alignItems: 'center',
                justifyContent: 'center',
            },
            stopNumText: {
                color: item.bgColor,
                textAlign: 'center',
                textAlignVertical: 'center',
                fontWeight: 'bold',
                fontSize: (item.sname.length > 3) ? 12 : 14,
            },
            departureStyle: {
                fontSize: getFontSize(),
                color: getFontColor()
            },
            nextDepStyle: {
                fontSize: 12
            },
            directionStyle: {
                fontWeight: 'bold'
            },
            viaStyle: {
                marginTop: -5,
                fontSize: 10
            },
            iconStyle: {
                marginLeft: 5,
                alignSelf: 'center'
            }
        };
        const { stopNumStyle, col1Style, col2Style, col3Style, stopNumText,
                departureStyle, nextDepStyle, directionStyle, listStyle, viaStyle, iconStyle } = styles;

        return (
            <TouchableWithoutFeedback
                onPress={onPress}
                delayLongPress={500}
            >
                <View style={listStyle}>
                    <View style={col1Style}>
                        <View style={stopNumStyle}>
                            <Text style={stopNumText}>{item.sname}</Text>
                            {this.getDepartureTypeIcon(item.type, item.bgColor)}
                        </View>
                    </View>

                    <View style={col2Style}>
                        <Text style={directionStyle}>{item.direction}</Text>
                        {(item.via) ? <Text style={viaStyle}>{item.via}</Text> : null}
                        <View style={{ flexDirection: 'row' }}>
                            <Text>Läge {item.track || 'A'}</Text>
                            {(Object.prototype.hasOwnProperty.call(item, 'accessibility') && item.accessibility === 'wheelChair') ?
                                <Icon name="wheelchair" size={13} style={iconStyle} />
                                : null
                            }
                        </View>
                    </View>

                    <View style={col3Style}>
                        <Text style={departureStyle}>{left}</Text>
                        <Text style={nextDepStyle}>{next}</Text>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}
