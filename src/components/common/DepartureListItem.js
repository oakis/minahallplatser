import React from 'react';
import { View, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import { Text } from './';
import { colors } from '../style';

export const DepartureListItem = (props) => {

    function getDepartureType(type) {
		switch (type) {
            case 'BOAT':
                return 'directions-boat';
            case 'BUS':
                return 'directions-bus';
            case 'TAXI':
                return 'local-taxi';
            case 'TRAM':
                return 'tram';
            case 'VAS':
            case 'REG':
                return 'train';
            default:
                return null;
		}
    }

    function getSnameFontsize(sname) {
        if (sname.length > 4) return 10;
        if (sname.length > 3) return 12;
        return 14;
    }

    function getFontColor(isLive, timeLeft) {
        if (!isLive) {
            return colors.warning;
        } else if (timeLeft === 'Nu') {
            return colors.danger;
        }
        return colors.default;
    }

    function getFontSize(shouldShowMin, timeLeft) {
        if (!shouldShowMin) {
            return 18;
        } else if (timeLeft > 59) {
            return 14;
        }
        return 24;
    }

    function formatTime(minutes) {
        const duration = moment.duration(minutes, 'minutes');
        return (minutes > 59) ? `${duration.hours()}h ${duration.minutes()}m` : minutes;
    }

    const height = 50;
    const { item, onPress, onLongPress } = props;
    const shouldShowMin = item.timeFormat === 'minutes';
    const { clockLeft, clockNext } = item;
    const timeLeft = (item.timeLeft <= 0) ? 'Nu' : formatTime(item.timeLeft);
    const timeNext = (item.timeNext <= 0 && item.timeNext !== null) ? 'Nu' : formatTime(item.timeNext);
    const left = shouldShowMin ? timeLeft : clockLeft;
    const next = shouldShowMin ? timeNext : clockNext;

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
            fontSize: getSnameFontsize(item.sname),
        },
        departureStyle: {
            fontSize: getFontSize(shouldShowMin, item.timeLeft),
            color: getFontColor(item.isLive, timeLeft)
        },
        nextDepStyle: {
            fontSize: 12
        },
        directionStyle: {
            fontWeight: 'bold'
        },
        viaStyle: {
            marginTop: -5,
            fontSize: 12
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
            onLongPress={onLongPress}
            delayLongPress={500}
        >
            <View style={listStyle}>
                <View style={col1Style}>
                    <View style={stopNumStyle}>
                        <Text style={stopNumText}>{item.sname}</Text>
                        <Icon name={getDepartureType(item.type)} size={15} color={item.bgColor} />
                    </View>
                </View>

                <View style={col2Style}>
                    <View style={{ display: 'flex', flexDirection: 'row' }}>
                        <Text style={directionStyle}>{item.direction}</Text>
                        {item.global && <Icon name="public" size={13} style={{ ...iconStyle, marginTop: 2, marginLeft: 2, color: colors.primary }} />}
                    </View>
                    {(item.via) ? <Text style={viaStyle}>{item.via}</Text> : null}
                    <View style={{ flexDirection: 'row' }}>
                        <Text>Läge {item.track || 'A'}</Text>
                        {(Object.prototype.hasOwnProperty.call(item, 'accessibility') && item.accessibility === 'wheelChair') ?
                            <Icon name="accessible" size={13} style={iconStyle} />
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
