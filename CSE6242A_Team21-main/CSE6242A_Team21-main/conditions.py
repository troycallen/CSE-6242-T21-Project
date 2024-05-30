import pandas as pd
data = pd.read_csv('US_Accidents_March23.csv')

# Print old unique values
#print(data['Weather_Condition'].unique())
print(len(data['Weather_Condition'].unique()))

condition_map = {
    'Drizzle / Windy' : 'Drizzle',
    'Heavy Drizzle' : ' Drizzle',
    'Heavy Rain / Windy' : 'Heavy Rain',
    'Heavy Rain Shower' : 'Heavy Rain',
    'Heavy Rain Shower / Windy' : 'Heavy Rain',
    'Heavy Rain Showers' : 'Heavy Rain',
    'Heavy Snow / Windy' : 'Heavy Snow',
    'Heavy Snow with Thunder' : 'Heavy Snow',
    'Heavy T-Storm / Windy': 'Thunderstorms',
    'Heavy T-Storm': 'Thunderstorms',
    'Heavy Thunderstorms and Rain': 'Thunderstorms',
    'Heavy Thunderstorms and Rain' : 'Thunderstorms',
    'Heavy Thunderstorms and Snow' : 'Thunderstorms',
    'Heavy Thunderstorms with Small Hail' : 'Thunderstorms',
    'Light Blowing Snow': 'Light Snow',
    'Light Drizzle / Windy' :' Light Drizzle',
    'Light Rain / Windy' : 'Light Rain',
    'Light Rain Shower' : 'Light Rain',
    'Light Rain Shower / Windy' : 'Light Rain',
    'Light Rain Showers' : 'Light Rain',
    'Light Rain with Thunder' : 'Light Rain',
    'Light Sleet / Windy' :'Light Sleet',
    'Light Snow / Windy' : 'Light Snow',
    'Light Snow and Sleet' : 'Light Snow',
    'Light Snow Grains' : 'Light Snow',
    'Light Snow Shower' : 'Light Snow',
    'Light Thunderstorms and Rain' : 'Light Thunderstorms',
    'Light Thunderstorms and Snow' : 'Light Thunderstorms',
    'Rain / Windy' : 'Rain',
    'Rain Shower' : 'Rain', 
    'Rain Shower / Windy' : 'Rain',
    'Rain Showers' : 'Rain',
    'Snow / Windy' : 'Snow',
    'Snow and Sleet' : 'Snow',
    'Thunder' : 'Thunderstorms',
    'T-Storm' : ' Thunderstorms',
    'T-Storm / Windy' : ' Thunderstorms',
    'Thunder / Windy' : 'Thunderstorms',
    'Thunder in the Vicinity' : 'Thunderstorms',
    'Thunderstorms and Rain' : 'Thunderstorms',
    'Thunderstorms and Snow' : 'Thunderstorms',
    'Wintry Mix / Windy' : 'Wintry Mix',
    'Scattered Clouds' : 'Partly Cloudy',
    'Overcast' : 'Mostly Cloudy',
    'Light Drizzle': 'Light Rain',
    'Cloudy / Windy' : 'Windy',
    'Fair / Windy' : 'Windy',
    'Mostly Cloudy / Windy' : 'Windy',
    'Partly Cloudy / Windy' : 'Windy',
    'Fair' : 'Clear',

}

# Replace redundant conditions
data2 = data
data2['Weather_Condition'].replace(condition_map, inplace=True)

# Print new unique values
#print(data2['Weather_Condition'].unique())
print(len(data2['Weather_Condition'].unique()))

data2.to_csv('fixed_conditions.csv', index=False)