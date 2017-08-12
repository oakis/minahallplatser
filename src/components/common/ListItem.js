import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../style';

export const ListItem = ({ text, icon = null, pressItem, pressIcon = null, iconVisible = false, iconColor = '#000' }) => {	
	const styles = {
		view: {
			flex: 1,
			flexDirection: 'row',
			justifyContent: 'space-between',
			marginTop: 5,
			marginHorizontal: 10,
			paddingBottom: 5,
			height: 50,
			borderBottomWidth: 1,
			borderBottomColor: colors.darkgrey
		},
		text: {
			justifyContent: 'flex-start',
			alignSelf: 'center'
		},
		icon: {
			justifyContent: 'flex-end',
			alignSelf: 'center',
			color: iconColor
		}
	};

	return (
		<TouchableOpacity
			onPress={pressItem}
			style={styles.view}
		>
			<Text style={styles.text}>
				{text}
			</Text>
			{(!iconVisible) ? null :
				<Icon
					style={styles.icon}
					name={icon}
					size={24}
					onPress={pressIcon}
				/>
			}
		</TouchableOpacity>
	);
};
