import librosa.display
import matplotlib.pyplot as plt
import numpy as np
from os import listdir
from os.path import isfile, join
import soundfile as sf

n_fft = 1024
hop_length = 512
path = '../audio/Training/Negative/'
i = 0
onlyfiles = [f for f in listdir(path) if isfile(join(path, f))]
for entry in onlyfiles:
    print(entry)
    file = path + entry

    # waveform
    signal, sr = librosa.load(file, sr=None) #sr * T -> 22050 * 30
    yt, index = librosa.effects.trim(signal)
    print(librosa.get_duration(yt))
    f = sf.SoundFile(file)
    tamanho = librosa.get_duration(yt)
    MFCCs = librosa.feature.mfcc(signal, n_fft=n_fft, hop_length=hop_length, n_mfcc=5)

    librosa.display.specshow(MFCCs, sr=sr, hop_length=hop_length)
    plt.xlabel("Time")
    plt.ylabel("MFCC")
    plt.colorbar()

    from matplotlib.backends.backend_agg import FigureCanvasAgg as FigureCanvas

    window_size = 2048
    window = np.hanning(window_size)

    fig = plt.figure()
    canvas = FigureCanvas(fig)
    ax = fig.add_subplot(111)
    print("Ax: " + str(tamanho))
    p = librosa.display.specshow(MFCCs, ax=ax, y_axis='log', x_axis='time')
    plt.xlabel('')
    plt.ylabel("")
    plt.xlim([0, tamanho])
    plt.ylim([256, 8192])
    plt.axis('off')
    num = "% s" % i
    fig.savefig('../Images/Training/Negative/' + num + '.png')
    i += 1

path = '../audio/Training/Positive/'
i = 0
onlyfiles = [f for f in listdir(path) if isfile(join(path, f))]
for entry in onlyfiles:

    file = path + entry
    print(file)

    signal, sr = librosa.load(file, sr=None) #sr * T -> 22050 * 30
    yt, index = librosa.effects.trim(signal)
    print(librosa.get_duration(yt))
    f = sf.SoundFile(file)
    tamanho = librosa.get_duration(yt)
    MFCCs = librosa.feature.mfcc(signal, n_fft=n_fft, hop_length=hop_length, n_mfcc=5)

    librosa.display.specshow(MFCCs, sr=sr, hop_length=hop_length)
    plt.xlabel("Time")
    plt.ylabel("MFCC")
    plt.colorbar()

    # For plotting headlessly
    from matplotlib.backends.backend_agg import FigureCanvasAgg as FigureCanvas

    window_size = 2048
    window = np.hanning(window_size)

    fig = plt.figure()
    canvas = FigureCanvas(fig)
    ax = fig.add_subplot(111)
    print("Ax: " + str(tamanho))

    p = librosa.display.specshow(MFCCs, ax=ax, y_axis='log', x_axis='time')
    plt.xlabel('')
    plt.ylabel("")
    plt.xlim([0, tamanho])
    plt.ylim([256, 8192])
    plt.axis('off')
    num = "% s" % i
    fig.savefig('../Images/Training/Positive/' + num + '.png')
    i += 1