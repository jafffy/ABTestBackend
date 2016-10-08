import sys
import numpy as np
import pandas as pd
from pymongo import MongoClient
from konlpy.tag import Twitter
import re
import os

client = MongoClient('mongodb://54.186.195.78/trauma', 27017)
db = client.get_database('trauma')
documents = db.get_collection('documents')
analysis = db.get_collection('analysis')

test = pd.DataFrame(list(documents.find()))

test['word_count'] = 0
test['scare_count'] = 0
test['senti_count'] = 0
test['diagnose'] = 0.0

pre = os.path.dirname(os.path.realpath(__file__))
fname = 'LIWC_senti_words.xlsx'
fname2 = 'LIWC_pos_words.xlsx'
fname3 = 'LIWC_neg_words.xlsx'
fname4 = 'LIWC_recog_words.xlsx'

path = os.path.join(pre, fname)
path2 = os.path.join(pre, fname2)
path3 = os.path.join(pre, fname3)
path4 = os.path.join(pre, fname4)

senti_words = pd.read_excel(path)
pos_words = pd.read_excel(path2)
neg_words = pd.read_excel(path3)
recog_words = pd.read_excel(path4)

twitter = Twitter()
pos = lambda d: ['/'.join(d) for d in twitter.pos(d, norm=True, stem=True) if d[1] in ['Noun', 'Adjective']]

def text_cleaning(text):
    text = re.sub('[^가-힝\\s]', ',', text)
    return text

test['content'] = test['content'].apply(lambda text: text_cleaning(text))
contents = [pos(each[1]['content']) for each in test.iterrows()]

senti_words = [pos(each[1]['word']) for each in senti_words.iterrows()]
pos_words = [pos(each[1]['word']) for each in pos_words.iterrows()]
neg_words = [pos(each[1]['word']) for each in neg_words.iterrows()]
recog_words = [pos(each[1]['word']) for each in recog_words.iterrows()]

word_length = []
for each in contents:
    word_length.append(len(each))
print(word_length)

test['word_count'] = word_length

def count_words(contents):
    senti_cnt = 0
    pos_cnt = 0
    neg_cnt = 0
    recog_cnt = 0

    for content in contents:
        for each in senti_words:
            if content in each:
                senti_cnt += 1

        for each in pos_words:
            if content in each:
                pos_cnt += 1

        for each in neg_words:
            if content in each:
                neg_cnt += 1

        for each in recog_words:
            if content in each:
                recog_cnt += 1

    return senti_cnt, pos_cnt, neg_cnt, recog_cnt

senti_count = []
for content in contents:
    senti_count.append(count_words(content))
test['senti_count'] = senti_count

diagnose = []
for i in range(test.shape[0]):
    senti = (test['senti_count'][i][1] - test['senti_count'][i][2]) / (test['senti_count'][i][1] + test['senti_count'][i][2])
    scare = test['scare_count'][i] / test['word_count'][i]
    recog = test['senti_count'][i][3] / test['word_count'][i]
    diagnose.append(senti * 0.7 + scare + recog)

test['diagnose'] = diagnose

analysis.insert(json.loads(test.to_json()))
client.close()