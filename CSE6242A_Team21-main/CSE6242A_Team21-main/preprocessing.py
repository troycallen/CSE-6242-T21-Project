from sklearn.preprocessing import StandardScaler
import pandas as pd
data = pd.read_csv('US_Accidents_March23.csv')

missing = data.isnull().sum()
print(missing)
print("Number of Entries before drop = ", len(data))

# dropping columns with NaN 
data_dropped = data.dropna()
print("Number of Entries after drop = ", len(data_dropped))

print(data_dropped['End_Time'])

# converting columns to datetime 
data_dropped['Start_Time'] = pd.to_datetime(data_dropped['Start_Time'], errors='coerce')
data_dropped['End_Time'] = pd.to_datetime(data_dropped['End_Time'], errors='coerce')

print(data_dropped['End_Time'])

# dropping unneeded column (can drop more if decided)
data_cleaned = data_dropped.drop(['Source'], axis=1)
data_cleaned.to_csv('preprocessed_data.csv', index=False)

# could potentially use scaling depending on models we plan on using