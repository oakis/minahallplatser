import React from 'react';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { component } from '../style';
import { Text } from '../common';

export const ListItem = ({ text, icon = null, pressItem, pressIcon = null, iconVisible = false, iconColor = '#000' }) => {
	return (
		<TouchableOpacity
			onPress={pressItem}
			style={component.listitem.view}
		>
			<Text style={component.listitem.text}>
				{text}
			</Text>
			{(!iconVisible) ? null :
				<Icon
					style={[component.listitem.icon, { color: iconColor }]}
					name={icon}
					size={24}
					onPress={pressIcon}
				/>
			}
		</TouchableOpacity>
	);
};
