import numpy as np
import tensorflow as tf
tf.config.list_physical_devices("GPU")

from tensorflow import keras
from keras.preprocessing.image import load_img
from keras.preprocessing import image

class Test:
    # Função que recebe o path da imagem a ser analisa e devolve o respetido resultado
    def test(load_image):
        result = ""
        # vai fazer o load do modelo de treino préviamente gravado
        model = keras.models.load_model('../ModeloAdam512')
        file_image = load_image
        # vai fazer load da imagem temporáriamente guardada no sistema
        img = load_img(file_image, target_size=(640, 480))

        # passar a imagem para um vector
        x = image.img_to_array(img)
        # expanssão das dimensões
        x = np.expand_dims(x, axis=0)
        images = np.vstack([x])
        # predição da imagem com o modelo
        classes = model.predict(images, batch_size=10)  # predição

        # Resultados
        if classes[0] > 0.5:
            result = "positive"
        else:
            result = "negative"

        return result
