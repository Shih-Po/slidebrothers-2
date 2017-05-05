from selenium import webdriver
from bs4 import BeautifulSoup
import pandas as pd
from tqdm import tqdm
import time

def login_104():
    import config
    account = config.account
    pwd = config.pd

    br.get('https://case.104.com.tw/logout_finish.cfm')
    br.get('https://login.104.com.tw/login.cfm')
    br.find_element_by_id('id_name').send_keys(account)
    br.find_element_by_id('password').send_keys(pwd)
    br.find_element_by_xpath('//*[@id="wrapper"]/div[3]/div[4]/ul/li[1]/input').click()
    print('Login sucess!')

def get_basic_info_df(case_url):
    br.get(case_url)
    soup = BeautifulSoup(br.page_source, 'html.parser')

    case_num = soup.select_one('div.insider_right_t h2 b').text.strip()
    final_page = int(soup.select_one('div.insider_right_t h2 em').text.strip())

    def get_case_list_by_page(url):    
        record = None
        while not record:
            try:
                br.get(url) # after login
                time.sleep(1)
                soup = BeautifulSoup(br.page_source, 'html.parser')
                caselist = soup.select_one('div.caselist')
                titles = [a.text for a in caselist.select('li dt a')]
                links = ['https://case.104.com.tw/' + a.get('href').split('&')[0] for a in soup.select('li dt a')]
                records = [(t, l) for t,l in zip(titles, links)]
                break
            except AttributeError as e:
                print(url, e)
                time.sleep(5)
                pass
        
        return pd.DataFrame(records, columns=['title', 'link'])

    frame = []
    for page in tqdm(range(1, final_page+1)):
        page_url = case_url.replace('page=1', 'page={}'.format(page))
        _df = get_case_list_by_page(page_url)
        frame.append(_df)

    return pd.concat(frame).reset_index(drop=True)

def get_advance_info_df(basic_info_df):
    record = []
    case_link_list = list(basic_info_df['link'])
    for case_link in tqdm(case_link_list):
        xpath_pair = {
            # example: 
            # https://case.104.com.tw/seek_view.cfm?caseno=1182014&cfrom=postcase_list_seeknum&clist=0&begin=2
            'case_type': '//*[@id="insider_wrapper"]/div[2]/div[1]/h1/span',
            'budget': '//*[@id="insider_wrapper"]/div[2]/div[3]/div[1]/dl/dd[1]',
            'content': '//*[@id="caseDesc1"]',
            'view': '//*[@id="insider_wrapper"]/div[2]/div[3]/div[2]/div[3]/dl/dd[1]',
            'propose_amount': '//*[@id="insider_wrapper"]/div[2]/div[3]/div[2]/div[3]/dl/dd[2]',
            'location': '//*[@id="insider_wrapper"]/div[2]/div[3]/div[3]/dl/dd[1]',
            'office': '//*[@id="insider_wrapper"]/div[2]/div[3]/div[3]/dl/dd[2]',
            'owner_type': '//*[@id="insider_wrapper"]/div[2]/div[3]/div[2]/div[2]/dl/dd[2]',
            'average_price': '//*[@id="insider_wrapper"]/div[2]/div[3]/div[2]/div[3]/dl/dd[4]',
            'highest_price': '//*[@id="insider_wrapper"]/div[2]/div[3]/div[2]/div[3]/dl/dd[5]',
            'lowest_price': '//*[@id="insider_wrapper"]/div[2]/div[3]/div[2]/div[3]/dl/dd[6]',
        }
        row = None
        count = 0
        while not row:
            try:
                br.get(case_link)
                time.sleep(1.5)
                
                case_type = br.find_element_by_xpath(xpath_pair['case_type']).text.strip()
                budget = br.find_element_by_xpath(xpath_pair['budget']).text.strip()
                content = br.find_element_by_xpath(xpath_pair['content']).text.strip()
                view = br.find_element_by_xpath(xpath_pair['view']).text.strip()
                propose_amount = br.find_element_by_xpath(xpath_pair['propose_amount']).text.strip()
                location = br.find_element_by_xpath(xpath_pair['location']).text.strip()
                office = br.find_element_by_xpath(xpath_pair['office']).text.strip()
                owner_type = br.find_element_by_xpath(xpath_pair['owner_type']).text.strip()
                           
                if '提案金額' in br.page_source:
                    average_price = br.find_element_by_xpath(xpath_pair['average_price']).text.strip()
                    highest_price = br.find_element_by_xpath(xpath_pair['highest_price']).text.strip()
                    lowest_price = br.find_element_by_xpath(xpath_pair['lowest_price']).text.strip()
                else:
                    average_price = None
                    highest_price = None
                    lowest_price = None
                
                row = (case_link, case_type, budget, content, view, 
                       propose_amount, location, office, owner_type,
                       average_price, highest_price, lowest_price)
                record.append(row)
                break
            except Exception as e:
                time.sleep(5)
                count += 1
            
            if count > 3:
                break

    return pd.DataFrame(record, columns=['link'] + [k for k in xpath_pair])


if __name__ == '__main__':
    def print_step(statement):
        print('\n{sep}\n{statement}'.format(sep='='*80, statement=statement))

    print_step('0. Use selenium browser and keep it alive')
    # WEBDRIBER_PATH = './drivers/chromedriver_mac64'
    # br = webdriver.Chrome(WEBDRIBER_PATH)
    WEBDRIBER_PATH = './drivers/phantomjs-2.1.1-macosx/bin/phantomjs'
    br = webdriver.PhantomJS(WEBDRIBER_PATH)

    print_step('1. Fill info to login')
    login_104()

    print_step('2. Get basic_info_df by case_url')
    case_url = ('https://case.104.com.tw/postcase_list.cfm?'
                'cat=0&area=0&role=0&iType=1&caseno=&cat_s=0&money=&enddays=&orderby=0&'
                'page=1&other=cat&otherVal=1&casetype=0&begin=0&cfrom=&IDNO=20000000737006')
    basic_info_df = get_basic_info_df(case_url)

    print_step('3. Get advance_info_df by case_link of basic_info_df')
    advance_info_df = get_advance_info_df(basic_info_df)
    rs_df = basic_info_df.merge(advance_info_df, on='link')
    br.quit()

    print_step('4. send rs_df to MongoDB')
    from pymongo import MongoClient
    from config import mongo_uri
    client = MongoClient(mongo_uri)
    db = client['heroku_ltkbmr55']

    _collection = rs_df.to_dict(orient='records')
    db['case_104'].drop() # drop existed collection
    db['case_104'].insert_many(_collection)

