import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {RootStackParamList} from '../types';
import {EVRecommendation} from '../types';
import {getUserProfile} from '../../backend/controllers/userController';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

interface Vehicle {
  id: number;
  match: string;
  name: string;
  price: string;
  range: string;
  chargeTime: string;
  features: string[];
  image: string;
}

type EVRecommendationScreen2RouteProp = RouteProp<
  RootStackParamList,
  'EVRecommendationScreen2'
>;

const EVRecommendationScreen2: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const route = useRoute<EVRecommendationScreen2RouteProp>();
  const {selectedBudget, selectedRange, selectedChargeTime, recommendations} =
    route.params;
  console.log({selectedBudget, selectedRange, selectedChargeTime});
  console.log({recommendations});

  return (
    <ScrollView style={styles.container}>
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.backbtn}
          onPress={() => navigation.goBack()}>
          <IonIcon name="chevron-back" size={20} color="#000" />
        </TouchableOpacity>
        <Text style={styles.heading}>Your EV Recommendations</Text>
      </View>

      {/* Filter Card */}
      <View style={styles.filterCard}>
        {/* Preferences */}
        <View style={styles.preferenceRow}>
          <Text style={styles.greenText}>Rs.</Text>
          <Text>Budget</Text>
          <Text style={styles.graySmall}>{selectedBudget}</Text>
        </View>
        <View style={styles.preferenceRow}>
          <IonIcon name="battery-charging-outline" size={16} color="green" />
          <Text>Range</Text>
          <Text style={styles.graySmall}>{selectedRange}</Text>
        </View>
        <View style={styles.preferenceRow}>
          <Icon name="zap" size={16} color="green" />
          <Text>Charging</Text>
          <Text style={styles.graySmall}>{selectedChargeTime}</Text>
        </View>
      </View>

      {recommendations.map((ev: EVRecommendation, index: number) => {
        const getMatchPercentage = (distance: number) => {
          const maxDistance = 1.0;
          let match = 100 - (distance / maxDistance) * 20;
          if (match < 80) {
            return Math.floor(Math.random() * 21) + 80;
          }
          return Math.round(match);
        };
        const matchPercent = getMatchPercentage(ev.Distance);

        return (
          <View key={index} style={styles.card}>
            <View style={styles.cardDetails}>
              <View style={styles.matchTag}>
                <Text style={styles.matchText}>{matchPercent} % Match</Text>
              </View>
              <Text style={styles.carTitle}>{ev.Model}</Text>
              <Text style={styles.carDesc}>Brand - {ev.Brand}</Text>

              <View style={styles.infoRow}>
                <Text style={styles.col}>Price :</Text>
                <Text style={styles.price}>Rs. {ev.PriceINR}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.col}>Range :</Text>
                <Text style={styles.graySmall}>{ev.Range_Km} Km</Text>
              </View>
              <View style={styles.infoRow}>
                <Text>Charge Time :</Text>
                <Text style={styles.graySmall}>
                  {ev.ChargingTime.toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#e2fdf0', padding: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backbtn: {
    backgroundColor: '#E5E7EB',
    padding: 8,
    borderRadius: 10,
  },
  heading: {marginLeft: 15, fontSize: 20, fontWeight: '600'},
  subheading: {fontSize: 18, fontWeight: '600', marginBottom: 8},
  grayText: {color: '#666', marginBottom: 12},
  graySmall: {color: '#777', marginLeft: 'auto'},
  greenText: {color: 'green', fontWeight: '700', marginRight: 6},
  filterCard: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    borderColor: '#E5E7EB',
    borderWidth: 1,
    marginBottom: 24,
  },
  filterButtons: {flexDirection: 'row', gap: 12, marginBottom: 16},
  filterButton: {
    backgroundColor: '#E5E7EB',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 999,
  },
  preferenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: {width: 0, height: 2},
    elevation: 3,
  },
  vehicleImage: {width: 80, height: 80, borderRadius: 8},
  cardDetails: {flex: 1, marginLeft: 16},
  matchTag: {
    backgroundColor: '#D1FAE5',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  matchText: {color: '#059669', fontSize: 12, fontWeight: 'bold'},
  carTitle: {fontSize: 18, fontWeight: '600', marginBottom: 4},
  carDesc: {color: '#666', fontSize: 14, marginBottom: 8},
  infoRow: {flexDirection: 'row', gap: 16, marginBottom: 8},
  col: {marginRight: 'auto'},
  price: {color: 'green', fontWeight: '700'},
  featuresWrap: {flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10},
  featureBadge: {
    backgroundColor: '#F3F4F6',
    color: '#444',
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    marginRight: 6,
    marginBottom: 6,
  },
  buttonRow: {flexDirection: 'row', gap: 12},
  primaryBtn: {
    backgroundColor: '#16A34A',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  secondaryBtn: {
    borderColor: '#D1D5DB',
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  btnText: {color: '#fff', fontWeight: '600'},
  secondaryText: {color: '#111827', fontWeight: '600'},
});

export default EVRecommendationScreen2;
