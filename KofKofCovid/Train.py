import itertools

from sklearn.metrics import confusion_matrix, precision_score, recall_score, f1_score
from matplotlib import pyplot
from tensorflow.keras.preprocessing.image import ImageDataGenerator
import tensorflow as tf
from tensorflow.keras.optimizers import RMSprop
import numpy as np


class MyCallback(tf.keras.callbacks.Callback):
    def on_epoch_end(self, epoch, logs={}):
        if logs.get('accuracy') > 0.999:
            print("\nReached 99% accuracy so cancelling training!")
            self.model.stop_training = True

def plot_confusion_matrix(cm, classes,
                          normalize=False,
                          title='Confusion matrix',
                          cmap=pyplot.cm.Blues):
    """
    Esta função imprime e faz plot da Confusion Matrix.
    Normalização pode ser conseguida apena mudando: `normalize=True`.
    """
    pyplot.imshow(cm, interpolation='nearest', cmap=cmap)
    pyplot.title(title)
    pyplot.colorbar()
    tick_marks = np.arange(len(classes))
    pyplot.xticks(tick_marks, classes, rotation=45)
    pyplot.yticks(tick_marks, classes)

    if normalize:
        cm = cm.astype('float') / cm.sum(axis=1)[:, np.newaxis]
        print("Normalized confusion matrix")
    else:
        print('Confusion matrix, without normalization')

    print(cm)

    thresh = cm.max() / 2.
    for i, j in itertools.product(range(cm.shape[0]), range(cm.shape[1])):
        pyplot.text(j, i, cm[i, j],
                 horizontalalignment="center",
                 color="white" if cm[i, j] > thresh else "black")

    pyplot.tight_layout()
    pyplot.ylabel('True label')
    pyplot.xlabel('Predicted label')

def main():

    TRAIN_BATCH_SIZE = 10
    VALIDATION_BATCH_SIZE = 4

    callbacks = MyCallback()
    train_datagen = ImageDataGenerator(
        rescale=1. / 255)  # normaliza as imagens para o caso de haver alguma de tamanho diferente
    train_dir = "../Images/Training"
    train_generator = train_datagen.flow_from_directory(
        train_dir,

        target_size=(640, 480),
        batch_size=TRAIN_BATCH_SIZE,
        class_mode='binary'
    )
    print(train_generator)
    train_image_count = train_generator.samples

    validation_dir = "../Images/Validation"
    validation_generator = train_datagen.flow_from_directory(
        validation_dir,
        target_size=(640, 480),
        batch_size=VALIDATION_BATCH_SIZE,
        class_mode='binary'
    )
    print(validation_generator)
    validation_image_count = validation_generator.samples

    Test_dir = "../Images/Test"
    test_generator = train_datagen.flow_from_directory(
        Test_dir,
        target_size=(640, 480),
        batch_size=VALIDATION_BATCH_SIZE,
        class_mode='binary',
        shuffle=False
    )
    # print(test_generator)

    TRAIN_STEPS_PER_EPOCH = np.ceil((train_image_count * 0.8 / TRAIN_BATCH_SIZE) - 1)
    # Assegura que exitem imagens suficientes na pasta treino
    VAL_STEPS_PER_EPOCH = np.ceil((validation_image_count * 0.2 / VALIDATION_BATCH_SIZE) - 1)

    # Este bloco de código serve para defenir e compilar Modelo
    model = tf.keras.models.Sequential([

        # Nota Este input shape é o tamanho  desejado da imagem 200X200 com 3 bytes de cor
        # Esta é a primeira convulsão
        tf.keras.layers.Conv2D(16, (3, 3), activation='relu', input_shape=(640, 480, 3)),# formato de entrada e como é RGB temos 3 bytes para cada pixel
        tf.keras.layers.MaxPooling2D(2, 2),
        # Segunda Convulção
        tf.keras.layers.Conv2D(32, (3, 3), activation='relu'),
        tf.keras.layers.MaxPooling2D(2, 2),
        # Terceira convulsão
        tf.keras.layers.Conv2D(64, (3, 3), activation='relu'),
        tf.keras.layers.MaxPooling2D(2, 2),

        # Achata (Flatten) o resultado para o DNN
        tf.keras.layers.Flatten(),

        # 256 neurónios na camada escondida
        tf.keras.layers.Dense(256, activation='relu'),
        # 512 neurónios na camada escondida
        tf.keras.layers.Dense(512, activation='relu'),

        # Apenas devolve 1 neurónio. Vai ter o valor de 0-1 onde 0 para uma classe ('negative') e 1 para a outra ('positive')
        tf.keras.layers.Dense(1, activation='sigmoid')  # 1 neurónio na camada de saída
    ])
    model.summary()

    # Mais facil se trocar o filtro de optimização
    opt = tf.keras.optimizers.Adam(learning_rate=0.001)

    # criação do modelo
    model.compile(loss='binary_crossentropy',  # função de erro de entropia binária (positivo ou negativo)
                  optimizer=RMSprop(learning_rate=0.001),
                  # Comentar a linha de cima e descomentar a debaixo para mudar de filtro de optimização
                  # optimizer=opt,
                  metrics=['accuracy'])

    # Treino da rede neural
    history = model.fit(
        train_generator,
        steps_per_epoch=TRAIN_STEPS_PER_EPOCH,
        epochs=70,
        validation_data=validation_generator,
        validation_steps=VAL_STEPS_PER_EPOCH,
        verbose=2,
        callbacks=[callbacks])

    # Guarda no sistema o histórico do treino
    np.save('../historyRMS512.npy', history.history)

    # Guarda no sistema o modelo treinado
    model.save('../rms512')
    pyplot.plot(history.history['accuracy'], label='Train Accuracy')
    pyplot.legend()
    pyplot.yscale('symlog', linthreshy=0.01)
    pyplot.title('Accurancy Vs Loss')
    pyplot.grid(True)
    pyplot.show()


    pyplot.plot(history.history['accuracy'], label='Train Accuracy')
    pyplot.plot(history.history['loss'], label='Train loss')
    pyplot.plot(history.history['val_accuracy'], label='Validation Accuracy')
    pyplot.plot(history.history['val_loss'], label='Validation loss')
    pyplot.legend()
    pyplot.yscale('symlog', linthreshy=0.01)
    pyplot.title('Accurancy Vs Loss')
    pyplot.grid(True)
    pyplot.show()


    #Modelo preditivo
    predictions = model.predict(test_generator, batch_size=10, verbose=2)

    rounded_predictions=[]
    for i in predictions:
        if i[0] > 0.5:
            rounded_predictions.append(1)
        else:
            rounded_predictions.append(0)

    cm = confusion_matrix(y_true=test_generator.labels , y_pred=rounded_predictions)
    cm_plot_labels = ['Negative','Positive']
    plot_confusion_matrix(cm=cm, classes=cm_plot_labels, title='Confusion Matrix')
    pyplot.show()

if __name__ == '__main__':
    main()
