# recommend_ev_knn.py
import sys
import json
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.neighbors import NearestNeighbors

# Load dataset
df = pd.read_csv("dataset/ElectricCarData_Clean.csv")

# Preprocess
df['FastCharge_KmH'] = pd.to_numeric(df['FastCharge_KmH'], errors='coerce')
df['FastCharge_KmH'].fillna(df['FastCharge_KmH'].mean(), inplace=True)
df['ChargingTime'] = df['Range_Km'] / df['FastCharge_KmH']
df['ChargingTime'].replace([float('inf'), -float('inf')], df['ChargingTime'].mean(), inplace=True)
df['ChargingTime'].fillna(df['ChargingTime'].mean(), inplace=True)
df['PriceINR'] = df['PriceEuro'] * 95  

# Parse user input
user_input = json.loads(sys.argv[1])
min_price = user_input['min_price']
max_price = user_input['max_price']
desired_range = user_input['desired_range']
desired_charging_time = user_input['desired_charging_time']
top_n = user_input.get('top_n', 5)

# Filter by price
candidates = df[(df['PriceINR'] >= min_price) & (df['PriceINR'] <= max_price)].copy()

if candidates.empty:
    print(json.dumps({'message': 'No EVs found in given price range.'}))
    sys.exit(0)

# Features for comparison
features = ['Range_Km', 'ChargingTime']
scaler = StandardScaler()
X = scaler.fit_transform(candidates[features])

# Fit KNN
knn = NearestNeighbors(n_neighbors=min(top_n, len(candidates)), metric='euclidean')
knn.fit(X)

# Transform user input
user_vector = scaler.transform([[desired_range, desired_charging_time]])
distances, indices = knn.kneighbors(user_vector)

# Get recommendations
recommendations = candidates.iloc[indices[0]].copy()
recommendations['Distance'] = distances[0].round(3)
output = recommendations[['Model', 'Brand', 'PriceINR', 'Range_Km', 'ChargingTime', 'Distance']].to_dict(orient='records')

# Return result
print(json.dumps(output))
