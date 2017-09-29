import React from 'react';
import { View, TouchableWithoutFeedback } from 'react-native';
import { Text } from './';
import { colors } from '../style';

export const DepartureListItem = ({ item, onLongPress }) => {
	let timeLeft = '';
    if (item.timeLeft === 0) {
        timeLeft = 'Nu';
    } else {
        timeLeft = item.timeLeft;
    }
    const getFontColor = () => {
        if (!item.rtTime) {
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
            height: 60,
            backgroundColor: (item.index % 2) ? colors.alternative : colors.lightgrey,
            marginLeft: 0,
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
            height,
            flex: 1,
            paddingLeft: 10,
            justifyContent: 'center'
        },
        col3Style: {
            height,
            width: 40,
            alignItems: 'center',
            justifyContent: 'center'
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
    const { stopNumStyle, col1Style, col2Style, col3Style, stopNumText,
            departureStyle, nextDepStyle, directionStyle, listStyle } = styles;

	return (
        <TouchableWithoutFeedback
            onLongPress={onLongPress}
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
                    <Text>Läge {item.track}</Text>
                </View>

                <View style={col3Style}>
                    <Text style={departureStyle}>{timeLeft}</Text>
                    <Text style={nextDepStyle}>{item.nextStop}</Text>
                </View>
            </View>
        </TouchableWithoutFeedback>
	);
};
