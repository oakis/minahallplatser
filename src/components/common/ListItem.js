import React from 'react';
import { TouchableOpacity, Image, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { component } from '../style';
import { Text } from '../common';

export const ListItem = ({ text, icon = null, pressItem, pressIcon = null, iconVisible = false, iconColor = '#000', style = null, avatar = null }) => {
	return (
		<TouchableOpacity
			onPress={pressItem}
			style={[component.listitem.view, style]}
		>
			<Text style={component.listitem.text}>
				{text}
			</Text>
			<View style={component.listitem.icon}>
				{(!iconVisible || avatar !== null) ? null :
					<Icon
						style={{ color: iconColor }}
						name={icon}
						size={24}
						onPress={pressIcon}
					/>
				}
				{avatar === null ? null :
					<Image
						style={{ width: 24, height: 24, borderRadius: 12 }}
						source={{ uri: avatar }}
					/>
				}
			</View>
		</TouchableOpacity>
	);
};
