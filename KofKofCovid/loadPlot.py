
from tensorflow import keras

# load do modelo guardo em sistema
model = keras.models.load_model('C:/Users/Paulo Bastos/Desktop/Model')

print('**********************************************************')
print('Summary')
print(model.summary())
print('**********************************************************')
print('Weights')
print(model.get_weights())
print('**********************************************************')
print('Optimizer')
print(model.optimizer)
print('**********************************************************')
print('Json')
print(model.to_json())
print('**********************************************************')
