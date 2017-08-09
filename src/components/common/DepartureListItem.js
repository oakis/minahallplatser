import React from 'react';
import { Text, View } from 'react-native';
import colors from '../style/color';

export const DepartureListItem = ({ item }) => {
    console.log(item.index);
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
    const height = 55;

    const styles = {
        listStyle: {
            flex: 1,
            height,
            backgroundColor: (item.index % 2) ? '#fff' : '#efefef',
            marginLeft: 0,
            paddingTop: 10,
            paddingBottom: 10,
            flexDirection: 'row'
        },
        col1Style: {
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
            width: 40,
            alignItems: 'center',
            justifyContent: 'center'
        },
        stopNumStyle: {
            width: 48,
            height: 48,
            backgroundColor: item.fgColor,
            borderWidth: 2,
            borderRadius: 3,
            color: item.bgColor,
            textAlign: 'center',
            textAlignVertical: 'center',
            fontWeight: 'bold'
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
		<View style={listStyle}>
            <View style={col1Style}>
                <Text style={stopNumStyle}>{item.sname}</Text>
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
	);
};
