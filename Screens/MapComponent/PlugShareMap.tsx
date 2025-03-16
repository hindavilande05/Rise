import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';


const PlugShareMap: React.FC = () => {
    return (
        <View style={styles.container}>
            <WebView
                source={{ uri: 'https://www.plugshare.com/widget2.html?plugs=1,2,3,4,5,6,42,13,7,8,9,10,11,12,14,15,16,17' }}
                style={styles.webview}
                allowsFullscreenVideo
                geolocationEnabled={true}  
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    webview: {
        flex: 1,
    },
});

export default PlugShareMap;
