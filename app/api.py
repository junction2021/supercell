import asyncio
import json
import os
import time
import re
import string
import traceback

import aiohttp
from aiohttp import BasicAuth
import numpy as np
import pandas as pd
from fastapi import FastAPI, Response, HTTPException

from app.logging import get_logger

import random

logger = get_logger(__name__)

from fitbert import FitBert

bad_words = pd.read_csv(os.environ['BAD_WORDS_PATH'], names=['words'])
bad_words = bad_words['words'].to_list()

# fb = FitBert(model_name='bert-base-cased', disable_gpu=True)
logger.info('Bert model loaded!')

app = FastAPI()


async def make_request(url, auth, headers, params):
    async with aiohttp.ClientSession(headers=headers) as session:
        async with session.get(url=url, params=params, auth=auth) as response:
            response = await response.read()
            response = response.decode('utf-8')
            response = json.loads(response)
            return response


async def analyze_text(message: str):
    auth = BasicAuth(
        os.environ['API_USER'],
        os.environ['API_KEY']
    )

    params = {
        'version': '2021-11-01',
        'language': 'en',
        'text': message,
        'features': 'emotion,sentiment',
        'emotion.document': 'true',
        'sentiment.document': 'true'
    }

    return await make_request(os.environ['API_URL'], auth, None, params)


# def correct_message(message: str):
#     regexp = (r'\b(%s)\b' % '|'.join(bad_words))

#     r = re.compile(regexp, re.IGNORECASE)

#     message = 'i have a dick its bigger than yours hahaha'

#     mask_token = fb.mask_token
#     span_dict = {}
#     for match in re.finditer(r, message):
#         old_word = match.group(0)
#         s1, s2 = match.span()
#         masked_message = message[:s1] + mask_token + message[s2:]
        
#         guess_list = set(fb.guess(masked_message, n=20))
#         remove_set = set(bad_words + list(string.punctuation))
#         guess_list = guess_list.difference(remove_set)
#         guess_list = list(guess_list)
        
#         new_word = guess_list[0]
#         span_dict[(s1, s2)] = (old_word, new_word)
        
#     span_dict = sorted(span_dict.items(), key=lambda item: item[0])

#     new_message = message
#     for s in span_dict:
#         old_word, new_word = s[1]
#         new_message = new_message.replace(old_word, new_word)
        
#     new_message = new_message.replace('##', '')

#     return new_message


@app.get("/proceed_text/")
async def proceed_text(message: str, response: Response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    
    try:
        result = await analyze_text(message)
    except Exception as e:
        error_info = traceback.format_exc()
        logger.info(f'Error: {error_info}')

        raise HTTPException(status_code=400, detail='Error')

    sentiment_score = result['sentiment']['document']['score']
    emotions_scores = result['emotion']['document']['emotion']

    logger.info(sentiment_score)
    logger.info(emotions_scores)

    sentiment_index = 1.0
    if sentiment_score < 0:
        sentiment_index = round(0.5*(1 + sentiment_score)) # weight = 5

    # sadness_index = round(1 - emotions_scores['sadness'], 2) # weight = 0.5
    # joy_index = round(emotions_scores['joy'], 2) # weight = 3
    # fear_index = round(1 - emotions_scores['fear'], 2) # weight = 0.5
    disgust_index = round(1 - emotions_scores['disgust'], 2) # weight = 0.5
    anger_index = round(1 - emotions_scores['anger'], 2) # weight 2

    indexes = [
        sentiment_index,
        # sadness_index,
        # joy_index,
        # fear_index,
        disgust_index,
        anger_index
    ]

    weights = [1.5, 2, 2]

    message_index = round(np.average(indexes, weights=weights), 2)
    # message_index = round(np.quantile(indexes, ), 2)

    label = 'positive'
    if message_index < 0.4:
        label = 'negative'
        #message = correct_message(message)
        message = ''.join(random.choices(string.ascii_uppercase + string.digits, k=5))

    return {
        'new_message': message,
        'label': label,
        'message_index': message_index
        }
