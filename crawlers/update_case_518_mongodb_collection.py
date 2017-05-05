from selenium import webdriver
from bs4 import BeautifulSoup
import requests
import pandas as pd
import numpy as np
import time
from tqdm import tqdm

def get_518_login_session(WEBDRIBER_PATH):
    br = webdriver.PhantomJS(WEBDRIBER_PATH)

    # fill info to get login session
    import config
    account = config.account
    pwd = config.pd

    br.get('http://case.518.com.tw/member-logout.html')
    br.get('https://case.518.com.tw/member-login.html')
    br.find_element_by_id('account').send_keys(account)
    br.find_element_by_id('pwd').send_keys(pwd)
    br.find_element_by_xpath('//*[@id="content-inner"]/form/div/p[4]/input').click()
    
    br.get('http://case.518.com.tw/casepage-index.html')
    s = requests.Session()
    for c in br.get_cookies():
        s.cookies.set(c['name'], c['value'])

    br.quit()
    return s

def get_case_list_df_by_page_url(page_url):
    res = s.get(page_url)
    soup = BeautifulSoup(res.text, 'html.parser')
    
    # parse needed data
    titles = [a.text.strip() for a in soup.select('li.title div a')]
    links = [a.get('href') for a in soup.select('li.title div a')]
    propose_amount = [int(a.text.strip()) for a in soup.select('li.active a')]
    budgets = [s.text.strip() for s in soup.select('li.budget span')]
    views = [int(s.text.strip()) for s in soup.select('li.view span')]
    locations = [s.text.strip() for s in soup.select('li.status span')]
    post_dates = [s.text.strip() for s in soup.select('time')]

    df = pd.DataFrame({
        'title': titles,
        'link': links,
        'propose_amount': propose_amount,
        'budget': budgets,
        'view': views,
        'location': locations,
        'post_date': post_dates
    })
    time.sleep(1)
    return df

def get_basic_info_df(section_url):
    # 1. 
    def get_final_page(section_url):
        soup = BeautifulSoup(s.get(section_url).text, 'html.parser')
        return int(soup.select_one('span.pagecountnum span').text\
                                                            .split('/')[1]\
                                                            .strip())
    final_page = get_final_page(section_url)

    # 2.
    frame = []
    pages = range(1, final_page+1)
    for page in tqdm(pages):
        page_url = web_section_url.replace('.html?', 
                                           '.html?page={}&'.format(page))
        _df = get_case_list_df_by_page_url(page_url)
        frame.append(_df)

    basic_info_df = pd.concat(frame).reset_index(drop=True)
    return basic_info_df

def get_advance_info_df(basic_info_df):
    # 1. 
    def get_case_info_by_link(link):
        """
        return tuple contains
        link, content, location, office, time_limit and owner_positive
        """
        res = s.get(link)
        soup = BeautifulSoup(res.text, 'html.parser')

        content = soup.select_one('dd.conttext p').text.strip()
        try:
            office = soup.select('dd.loc')[1].text.strip()
        except Exception as e:
            office = np.nan

        time_limit = soup.select_one('dd.date').text.strip()
        owner_positive = soup.select_one('p.positive').text.strip()

        time.sleep(0.5)
        return (link, content, office, time_limit, owner_positive)

    # 2. 
    rows = []
    for link in tqdm(basic_info_df['link']):
        row = get_case_info_by_link(link)
        rows.append(row)

    advance_info_columns = ['link', 'content', 'office', 
                            'time_limit', 'owner_positive']
    return pd.DataFrame(rows, columns=advance_info_columns)

if __name__ == '__main__':
    def print_step(statement):
        print('\n{sep}\n{statement}'.format(sep='='*80, statement=statement))

    print_step('1. get case 518 website login session')
    WEBDRIBER_PATH = './drivers/phantomjs-2.1.1-macosx/bin/phantomjs'
    s = get_518_login_session(WEBDRIBER_PATH)

    print_step('2. Gather case_basic_info from every page of section')
    web_section_url = 'http://case.518.com.tw/casepage-index.html?srh=KWCC20MMTA7MM'
    basic_info_df = get_basic_info_df(web_section_url)

    print_step('3. gather case_advance_info from every link of basic_info_df')
    advance_info_df = get_advance_info_df(basic_info_df)
    rs_df = basic_info_df.merge(advance_info_df, on='link')

    print_step('4. send rs_df to MongoDB')
    from pymongo import MongoClient
    from config import mongo_uri
    client = MongoClient(mongo_uri)
    db = client['heroku_ltkbmr55']

    _collection = rs_df.to_dict(orient='records')
    db['case_518'].drop() # drop existed collection
    db['case_518'].insert_many(_collection)
