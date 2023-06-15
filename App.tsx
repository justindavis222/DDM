import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import dataModel1 from './src/models/dataModel1.json';
import dataModel2 from './src/models/dataModel2.json';
import CryptoJS from 'crypto-js';

interface Field {
  label: string;
  type: 'int' | 'float' | 'string';
  readonly: boolean;
  calculate: string | null;
  value?: string;
}

type Fields = {
  [key: string]: Field;
};

export const customCalculate = (key: string, f: Fields, selectedModel: any) => {
  if (selectedModel.name === 'Hash Combination' && key === 'hash') {
    return calculateSha256Hash(f.string1.value || '', f.string2.value || '');
  } else if (selectedModel.name === 'Statistics') {
    const values = Object.values(f)
      .filter(field => !field.readonly)
      .map(field => parseFloat(field.value || '0'));

    if (key === 'mean') {
      const sum = values.reduce((a, b) => a + b, 0);
      return (sum / values.length).toFixed(2);
    } else if (key === 'median') {
      const sorted = values.sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      return sorted.length % 2 !== 0
        ? sorted[mid].toFixed(2)
        : ((sorted[mid - 1] + sorted[mid]) / 2).toFixed(2);
    } else if (key === 'std_deviation') {
      const mean = values.reduce((a, b) => a + b, 0) / values.length;
      const variance =
        values.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) /
        values.length;
      return Math.sqrt(variance).toFixed(2);
    }
  }
};

const calculateSha256Hash = (input1: string, input2: string) => {
  const combined = input1 + '\0' + input2;
  return CryptoJS.SHA256(combined).toString();
};

const App = () => {
  const [selectedModel, setSelectedModel] = useState<any>(null);
  const [fields, setFields] = useState<Fields>({});

  useEffect(() => {
    if (selectedModel) {
      setFields(selectedModel.fields);
    }
  }, [selectedModel]);

  const handleInputChange = (fieldName: string, value: string) => {
    const newFields = {...fields};
    newFields[fieldName].value = value;
    setFields(newFields);
  };

  const calculateValues = () => {
    if (selectedModel) {
      const updatedFields = {...fields};
      for (const key in updatedFields) {
        const field = updatedFields[key];
        if (field.calculate) {
          const calculatedValue = customCalculate(key, fields, selectedModel)!;
          handleInputChange(key, calculatedValue);
        }
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View>
          <Text style={styles.title}>Dynamic Data Model App</Text>
          <Picker
            selectedValue={selectedModel}
            onValueChange={(itemValue: any) => setSelectedModel(itemValue)}>
            <Picker.Item label="Select a data model..." value={null} />
            <Picker.Item label="Data Model 1" value={dataModel1} />
            <Picker.Item label="Data Model 2" value={dataModel2} />
          </Picker>
          {selectedModel &&
            Object.entries(fields).map(([key, field]: [string, Field]) => (
              <View key={key} style={styles.fieldWrapper}>
                <Text style={styles.fieldLabel}>{field.label}:</Text>
                <TextInput
                  style={styles.fieldInput}
                  keyboardType={field.type === 'int' ? 'number-pad' : 'default'}
                  onChangeText={(text: string) => handleInputChange(key, text)}
                  value={field.value}
                  editable={!field.readonly}
                />
              </View>
            ))}
          <TouchableOpacity
            style={styles.calculateButton}
            onPress={calculateValues}>
            <Text style={styles.calculateButtonText}>Calculate</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  fieldWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  fieldLabel: {
    fontSize: 18,
  },
  fieldInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 18,
    borderBottomWidth: 1,
    borderColor: '#999',
    padding: 5,
  },
  calculateButton: {
    backgroundColor: '#3498db',
    padding: 10,
    margin: 20,
    borderRadius: 5,
  },
  calculateButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default App;
