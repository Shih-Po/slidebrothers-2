import os, time
import requests
import pandas as pd
from bs4 import BeautifulSoup

def get_ptt_case_urls(i=355):
    print('\n{}\nStart to get ptt case urls...'.format('='*80))
    case_urls = []
    while i:
        url = 'https://www.ptt.cc/bbs/CodeJob/index{}.html'.format(i)
        i += 1
        time.sleep(1)
        
        res = requests.get(url)
        soup = BeautifulSoup(res.text, 'html.parser')
        a_tags = soup.select('div.title a')

        if len(a_tags)>0:
            print(url)
            case_urls += [a.get('href') for a in a_tags if '[發案]' in a.text]
        else:
            print('\n{0}\n{1} has no cases!\n'.format('='*80, url))
            break

    domain = 'https://www.ptt.cc'
    return [domain + e for e in case_urls]

def get_single_ptt_case_info(url):
    res = requests.get(url)
    soup = BeautifulSoup(res.text, 'html.parser')
    meta_values = soup.select('span.article-meta-value')

    try:
        author = meta_values[0].text
        title = meta_values[2].text
        time = meta_values[3].text

        main_contents = soup.select_one('div#main-content').text.split('\n')[1:]
        content = '\n'.join([line.replace('\t', '') for line in main_contents if line != ''])
    except IndexError as e:
        return {'url': url}
    
    return (url, author, title, time, content)


def get_full_ptt_case_df(i=355):
    # start from index 355 (close to 20160105)
    ptt_case_urls = get_ptt_case_urls(i=i)

    rows = []
    from tqdm import tqdm
    for case_url in tqdm(ptt_case_urls):
        row = get_single_ptt_case_info(case_url)
        rows.append(row)

    df = pd.DataFrame(rows)
    df.columns = ['url', 'author', 'title', 'time', 'content']
    df['time'] = pd.to_datetime(df['time'], format='%a %b %d %H:%M:%S %Y')
    return df[df['title'].notnull()].reset_index(drop=True)


if __name__ == '__main__':
    # 1. get codejob case list from start_index: 355
    # 2. get single case advance info
    # 3. append to df
    # 4. parse df
    df = get_full_ptt_case_df()

    # 5. send df to MongoDB
    from pymongo import MongoClient
    mongo_uri = os.environ['MONGODB_URI']
    client = MongoClient(mongo_uri)
    db = client['heroku_ltkbmr55']

    _collection = df.to_dict(orient='records')
    db['case_ptt'].drop() # drop existed collection
    db['case_ptt'].insert_many(_collection)
    print('\n{}\nUpdate case_ptt collection successed!\n'.format('='*80))
