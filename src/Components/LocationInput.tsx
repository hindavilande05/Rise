import React from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity } from 'react-native';

interface LocationInputProps {
  label: string;
  value: string;
  suggestions: any[];
  onChangeText: (text: string) => void;
  onSelect: (item: any) => void;
  placeholder?: string;
}

const LocationInput: React.FC<LocationInputProps> = ({
  label,
  value,
  suggestions,
  onChangeText,
  onSelect,
  placeholder,
}) => (
  <View>
    <Text>{label}</Text>
    <TextInput
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      style={{
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginVertical: 8,
        borderRadius: 8,
      }}
    />
    <FlatList
      data={suggestions}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => onSelect(item)}>
          <Text style={{ padding: 8 }}>{item.address.freeformAddress}</Text>
        </TouchableOpacity>
      )}
    />
  </View>
);

export default LocationInput;
