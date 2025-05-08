import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const PlanJourneyCard = ({ navigation }: { navigation: any }) => {
  const handleProceed = () => {
    navigation.navigate('RoutingTest'); 
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Plan your journey with RiseEV</Text>
     
      <Image
        source={require('../../assets/img/trip2.jpg')} 
        style={styles.image}
      />

      
      <TouchableOpacity style={styles.button} onPress={handleProceed}>
        <Text style={styles.buttonText}>Proceed</Text>
        <Icon name="arrow-right" size={16} color="white" style={styles.icon} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 12,
    margin: 1,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 5,
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    padding: 5,
    color: '#333',
  },
  
  image: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    marginBottom: 15,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#059768',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
    
  },
  buttonText: {
    color: 'white',
    fontSize: 13,
    fontWeight: 'bold',
    marginRight: 10,
  },
  icon: {
    color: 'white',
  },
});

export default PlanJourneyCard;