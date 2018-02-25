import React from 'react';
import { View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import { Text, Spinner } from './';
import { component, metrics, colors } from '../style';

export const ListHeading = ({ text, icon, iconSize = 20, onPress, loading = false, style = null }) => {
    return (
        <View>
            <View style={[{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: 29 }, style]}>
                <Text style={[component.text.heading, { height: 29 }]}>{text}</Text>
                <View style={{ flex: 1, marginTop: metrics.margin.md, paddingRight: metrics.padding.md, height: 29, justifyContent: 'center' }}>
                    {loading ? <Spinner color={colors.primary} noFlex left />
                    : (icon === 'md-refresh') ? <Ionicons name={icon} onPress={onPress} size={iconSize} style={{ textAlign: 'left', padding: metrics.padding.md }} />
                    : <Entypo name={icon} onPress={onPress} size={iconSize} style={{ textAlign: 'left', padding: metrics.padding.md }} />}
                </View>
            </View>
            <View
                style={{ height: 2, width: '100%', backgroundColor: colors.primary }}
            />
        </View>
    );
};
