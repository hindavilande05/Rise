import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { RootStackParamList } from '../types';
import axios from 'axios';
import { BASE_URL } from '../../config';

const EVRecommendationScreen = () => {

const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [selectedBudget, setSelectedBudget] = useState<string | null>(null);
  const [selectedRange, setSelectedRange] = useState<string | null>(null);
  const [selectedChargeTime, setSelectedChargeTime] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);


  const handleFindEV = async () => {
    setLoading(true);

    if (!selectedBudget || !selectedRange || !selectedChargeTime) {
      Alert.alert('Error', 'Please select all preferences before proceeding.');
      setLoading(false);
      return;
    }
  
    let min_price = 0;
    let max_price = Infinity;
    switch (selectedBudget) {
      case 'Under ₹20L':
        max_price = 2000000;
        break;
      case '₹20L - ₹40L':
        min_price = 2000000;
        max_price = 4000000;
        break;
      case '₹40L - ₹60L':
        min_price = 4000000;
        max_price = 6000000;
        break;
      case '₹60L+':
        min_price = 6000000;
        break;
      default:
        break;
    }
  
    const desired_range = parseInt(selectedRange.replace('+ km', ''));
  
    let desired_charging_time = 0;
    switch (selectedChargeTime) {
      case 'Under 30 min':
        desired_charging_time = 0.5; 
        break;
      case 'Under 1 hour':
        desired_charging_time = 1;
        break;
      case 'Under 2 hours':
        desired_charging_time = 2;
        break;
      case 'Under 4 hours':
        desired_charging_time = 4;
        break;
      default:
        break;
    }
  
    try {  
      const response = await axios.post(`${BASE_URL}/api/recommend`, {
        min_price,
        max_price,
        desired_range,
        desired_charging_time,
        top_n: 5, 
      });
  
      console.log('Response from server:', response.data);
      

      if (response.data.success) {
        const recommendations = response.data.recommendations;
  
        if (recommendations.length === 0) {
          // No EVs found
          Alert.alert('No EVs Found', 'No electric vehicles match your preferences. Please try adjusting your preferences.');
        } else {
          
          navigation.navigate('EVRecommendationScreen2', {
            selectedBudget,
            selectedRange,
            selectedChargeTime,
            recommendations,
          });
        }
      } else {
        Alert.alert('Error', response.data.message || 'Failed to fetch recommendations.');
      }
    } catch (error: any) {
      console.error('Error fetching recommendations:', error);
      Alert.alert('Error', 'Something went wrong. Please try again later.');
    }
    finally{
      setLoading(false);
    }
  };

  if (loading) {
    return (
      
    <ActivityIndicator size="large" color="green" style={{ marginBottom: 20 }}/>
    );
  }
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.topIcon}>
        <Icon name="flash-outline" size={22} color="green" />
        </View>
        
      <Text style={styles.title}>Find Your Perfect Electric Car</Text>
      <Text style={styles.subtitle}>Your EV Preferences</Text>

      {/* Budget Options */}
      <View style={styles.optionLableContainer}>   
        <Icon name="wallet-outline" size={22} color="green" />
        <Text style={styles.label}> Budget Range</Text>
     </View>
      
      <View style={styles.optionsContainer}>
        {['Under ₹20L', '₹20L - ₹40L', '₹40L - ₹60L', '₹60L+'].map(option => (
          <TouchableOpacity
            key={option}
            style={[
              styles.optionButton,
              selectedBudget === option && styles.selectedOption
            ]}
            onPress={() => setSelectedBudget(option)}>
            <Text style={selectedBudget === option ? styles.selectedText : styles.optionText}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Range Options */}
      <View style={styles.optionLableContainer}>   
      <Icon name="battery-dead" size={20} color="green" />
      <Text style={styles.label}> Desired Range</Text>
      </View>
      <View style={styles.optionsContainer}>
        {['150+ km', '200+ km', '300+ km', '400+ km'].map(option => (
          <TouchableOpacity
            key={option}
            style={[
              styles.optionButton,
              selectedRange === option && styles.selectedOption
            ]}
            onPress={() => setSelectedRange(option)}
          >
            <Text style={selectedRange === option ? styles.selectedText : styles.optionText}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Charging Time Options */}
      <View style={styles.optionLableContainer}>   
        <Icon name="time-outline" size={20} color="green" />
        <Text style={styles.label}> Maximum Charging Time</Text>
    </View>
      <View style={styles.optionsContainer}>
        {['Under 30 min', 'Under 1 hour', 'Under 2 hours', 'Under 4 hours'].map(option => (
          <TouchableOpacity
            key={option}
            style={[
              styles.optionButton,
              selectedChargeTime === option && styles.selectedOption
            ]}
            onPress={() => setSelectedChargeTime(option)}
          >
            <Text style={selectedChargeTime === option ? styles.selectedText : styles.optionText}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleFindEV}>
        <Text style={styles.submitText}>Find My Perfect EV</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#fff',
  },
  topIcon:{
    
   
    width: '14%',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 100,
    backgroundColor: '#d4f9d4',
    alignSelf: 'center',

  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 12,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  optionLableContainer:
  {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 8,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 10,
  },
  optionButton: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    margin: 5,
  },
  selectedOption: {
    backgroundColor: '#d4f9d4',
    borderColor: '#28a745',
  },
  optionText: {
    color: '#000',
  },
  selectedText: {
    color: '#28a745',
    fontWeight: 'bold',
  },
  submitButton: {
    marginTop: 25,
    backgroundColor: '#28a745',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default EVRecommendationScreen;
