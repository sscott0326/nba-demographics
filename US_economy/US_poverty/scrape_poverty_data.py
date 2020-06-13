from selenium import webdriver
from splinter import Browser
from bs4 import BeautifulSoup as bs
import pandas as pd
import time

states = []
counties = []
years = []
poverty_rates = []

def save_to_csv(states, counties, years, poverty_rates):
    df = {
            "State" : states,
            "County" : counties,
            "Year" : years,
            "Poverty Rate" : poverty_rates
        }

    poverty_df = pd.DataFrame(df)
    poverty_df.to_csv("poverty.csv", index=False, header=True)

def scrape_info():
    driver = webdriver.Chrome()

    url = "https://www.povertyusa.org/data"
    driver.get(url)
    time.sleep(1)

    state_select = driver.find_element_by_tag_name('select')
    state_options = state_select.find_elements_by_tag_name('option')
    del state_options[0]

    checkpoint_count = 0

    for state in state_options:
        state.click()
        time.sleep(0.5)

        county_select = driver.find_elements_by_tag_name('select')[1]
        county_options = county_select.find_elements_by_tag_name('option')
        del county_options[0]
        
        for county in county_options:
            county.click()
            time.sleep(0.5)

            year_select = driver.find_elements_by_tag_name('select')[2]
            year_options = year_select.find_elements_by_tag_name('option')

            for year in year_options:
                year.click()
                time.sleep(2)

                overview_section = driver.find_element_by_class_name('section-overview')
                try:
                    poverty_rate_div = overview_section.find_element_by_class_name('poverty-rate')
                    poverty_rate_stat = poverty_rate_div.find_element_by_class_name('stat')\
                                                        .find_element_by_tag_name('span')
                    poverty_rate = round(float(poverty_rate_stat.text.split('%')[0]),1)
                except Exception as e:
                    population_div = overview_section.find_element_by_class_name('population')
                    population_stat = population_div.find_element_by_class_name('stat')\
                                                    .find_element_by_tag_name('span')
                    population = float(population_stat.text.replace(',',''))
                    
                    in_poverty_div = overview_section.find_element_by_class_name('in-poverty')
                    in_poverty_stat = in_poverty_div.find_element_by_class_name('stat')\
                                                    .find_element_by_tag_name('span')
                    in_poverty = float(in_poverty_stat.text.replace(',',''))

                    poverty_rate = round((in_poverty/population)*100, 1)
                    print(f"{state.text}, {county.text}, {year.text}, {poverty_rate} was missing poverty rate stat")
                    print(e)

                states.append(state.text)
                counties.append(county.text)
                years.append(year.text)
                poverty_rates.append(poverty_rate)

                checkpoint_count += 1
                if checkpoint_count % 500 == 0:
                    save_to_csv(states, counties, years, poverty_rates)
                    print("saved")

    driver.quit()
    checkpoint_count = 0

scrape_info()
