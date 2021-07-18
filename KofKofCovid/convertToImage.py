import os
import uuid

import librosa, librosa.display
import numpy as np
import soundfile as sf
from test import Test
import matplotlib.pyplot as plt
plt.switch_backend('agg')


n_fft = 1024
hop_length = 512

class Audio:
  def __init__(self, audio):
    self.audio = audio

  async def getImage(audios):

      signal, sr = librosa.load(audios, sr=None)  # sr * T -> 22050 * 30

      yt, index = librosa.effects.trim(signal)

      # print(librosa.get_duration(yt))
      # devolve a duração em segundos do som
      tamanho = librosa.get_duration(yt)
      #converte o sinal audio em
      MFCCs = librosa.feature.mfcc(signal, n_fft=n_fft, hop_length=hop_length, n_mfcc=5)

      librosa.display.specshow(MFCCs, sr=sr, hop_length=hop_length)


      fig = plt.figure()

      plt.xlabel('')
      plt.ylabel("")
      plt.xlim([0, tamanho])
      plt.ylim([256, 8192])
      plt.axis('off')

      # caminho onde fica guardado a imagem temporária - e nome de ficheiro gerado aleaotóriamente
      # (Para se poder chamar o serviço mais de uma vez)
      fig_path = "../"+str(uuid.uuid4())+".png"
      # Guarda a imagem no sistema
      fig.savefig(fig_path)
      # função que envia a imagem guardada no sitema com o sptograma do som e devolve o resultado
      ispositive = Test.test(fig_path)
      os.remove(fig_path)
      # retorna o resultado da ánlise
      return ispositive