# -*- coding: utf-8 -*-
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.metrics.pairwise import cosine_similarity
import sys
import json

df = pd.read_csv("dataset/ElectricCarData_Clean.csv")

# Convert FastCharge_KmH to numeric
df['FastCharge_KmH'] = pd.to_numeric(df['FastCharge_KmH'], errors='coerce')
df['FastCharge_KmH'] = df['FastCharge_KmH'].fillna(df['FastCharge_KmH'].mean())

# Compute charging time = Range_Km / FastCharge_KmH
df['ChargingTime'] = df['Range_Km'] / df['FastCharge_KmH']
df['ChargingTime'].replace([float('inf'), -float('inf')], df['ChargingTime'].mean(), inplace=True)
df['ChargingTime'].fillna(df['ChargingTime'].mean(), inplace=True)

# 1 Euro ≈ 90 INR
conversion_rate = 90
df['PriceINR'] = df['PriceEuro'] * conversion_rate

def recommend_by_features(min_price, max_price, desired_range, desired_charging_time, top_n=5):
    candidates = df[(df['PriceINR'] >= min_price) & (df['PriceINR'] <= max_price)].copy()

    if candidates.empty:
        return [{'message': 'No EVs found in given price range.'}]

    features = ['Range_Km', 'ChargingTime']
    scaler = StandardScaler()
    candidates_scaled = scaler.fit_transform(candidates[features])
    user_vector = scaler.transform([[desired_range, desired_charging_time]])
    similarities = cosine_similarity(user_vector, candidates_scaled).flatten()

    top_indices = similarities.argsort()[::-1][:top_n]
    recommended = candidates.iloc[top_indices][['Model', 'Brand', 'PriceINR', 'Range_Km', 'ChargingTime']].copy()
    recommended['SimilarityScore'] = similarities[top_indices].round(3)

    return recommended.to_dict(orient='records')

if __name__ == '__main__':
    try:
        user_input = json.loads(sys.argv[1])
        result = recommend_by_features(
            min_price=user_input['min_price'],
            max_price=user_input['max_price'],
            desired_range=user_input['desired_range'],
            desired_charging_time=user_input['desired_charging_time']
        )
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({'error': str(e)}))
