from fastapi import FastAPI, UploadFile, File
import pickle
import io
import os
from pydantic import BaseModel
import numpy as np

from fastapi.middleware.cors import CORSMiddleware

# FastAPIのインスタンスを1つに統一
app = FastAPI()

# CORSミドルウェアを追加
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # すべてのオリジンを許可。特定のドメインに限定するのが推奨されます。
    allow_credentials=True,
    allow_methods=["*"],  # すべてのHTTPメソッドを許可
    allow_headers=["*"],  # すべてのHTTPヘッダーを許可
)


class IrisInput(BaseModel):
    sepal_length: float
    sepal_width: float
    petal_length: float
    petal_width: float

# モデルの読み込み
try:
    with open('model.pkl', mode='rb') as f:
        model = pickle.load(f)
except Exception as e:
    print(f"Error loading model: {e}")
    raise

@app.post('/predict')
async def make_predictions(input_data: IrisInput):
    data = np.array([[input_data.sepal_length, input_data.sepal_width,
                      input_data.petal_length, input_data.petal_width]])
    y_pred = model.predict(data)
    return {"prediction": int(y_pred)}

