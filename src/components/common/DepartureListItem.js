import React, { PureComponent } from 'react';
import { View, TouchableWithoutFeedback } from 'react-native';
import moment from 'moment';
import { Text } from './';
import { colors } from '../style';

function formatTime(minutes) {
    const duration = moment.duration(minutes, 'minutes');
    return (minutes > 59) ? `${duration.hours()}h ${duration.minutes()}m` : minutes;
}

export class DepartureListItem extends PureComponent {
    render() {
        const { item, onPress } = this.props;
        const timeLeft = (item.timeLeft <= 0) ? 'Nu' : formatTime(item.timeLeft);
        const timeNext = (item.timeNext <= 0 && item.timeNext !== null) ? 'Nu' : formatTime(item.timeNext);
        const getFontColor = () => {
            if (!item.isLive) {
                return colors.warning;
            } else if (isNaN(timeLeft)) {
                return colors.danger;
            }
            return colors.default;
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
                justifyContent: 'center'
            },
            col2Style: {
                flex: 1,
                paddingLeft: 10,
                justifyContent: 'center'
            },
            col3Style: {
                height,
                width: 50,
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
                fontSize: (item.timeLeft > 59) ? 14 : 24,
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
            }
        };
        const { stopNumStyle, col1Style, col2Style, col3Style, stopNumText,
                departureStyle, nextDepStyle, directionStyle, listStyle, viaStyle } = styles;

        return (
            <TouchableWithoutFeedback
                onPress={onPress}
                delayLongPress={500}
            >
                <View style={listStyle}>
                    <View style={col1Style}>
                        <View style={stopNumStyle}>
                            <Text style={stopNumText}>{item.sname}</Text>
                        </View>
                    </View>

                    <View style={col2Style}>
                        <Text style={directionStyle}>{item.direction}</Text>
                        {(item.via) ? <Text style={viaStyle}>{item.via}</Text> : null}
                        <Text>Läge {item.track}</Text>
                    </View>

                    <View style={col3Style}>
                        <Text style={departureStyle}>{timeLeft}</Text>
                        <Text style={nextDepStyle}>{timeNext}</Text>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}
