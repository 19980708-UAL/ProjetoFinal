/* ******************* Envia o som para Analise - Através de serviço *************** */

function ipaudio(v_blob) {
    startRecordingButton.style.display = "none"
    document.getElementById("back").style.display = "none";
    $('#loader').show();

    var form = new FormData();
    form.append("file", v_blob, URL.createObjectURL(v_blob) + ".wav");
    // form.append("test_id", "7");

    var settings = {
        "url": "http://localhost:5000/audio",
        "method": "POST",
        "timeout": 0,
        "processData": false,
        "mimeType": "multipart/form-data",
        "contentType": false,
        "data": form
    };

    $.ajax(settings).done(function (response) {
        result = $.parseJSON(response);
        for (d in result)
            result = result[d];
        console.log(result);
        document.cookie = "result=" + result;

        /* ****  Chamar serviço para gravar na base de dados o som e resultados ****** */
        form.append("usr_id", getCookie("userId"));
        form.append("test_result", result);
        var settings = {
            "url": "http://213.30.2.186:22228/KOFKOF/webresources/fileUpload/upload",
            "method": "POST",
            "timeout": 0,
            "processData": false,
            "mimeType": "multipart/form-data",
            "contentType": false,
            "data": form
        };

        $.ajax(settings).done(function (response) {
            window.location = "result.html";
        });
    });
}


/*  Gravação de Voz com respetivo leitor(escondido) para testes */

var startRecordingButton = document.getElementById("startRecordingButton");
var stopRecordingButton = document.getElementById("stopRecordingButton");
$('#loader').hide();


var leftchannel = [];
var rightchannel = [];
var recorder = null;
var recordingLength = 0;
var volume = null;
var mediaStream = null;
var sampleRate = 44100;
var context = null;
var blob = null;

startRecordingButton.addEventListener("click", function () {
    // inicialização do gravador
    startRecordingButton.style.display = "none"
    stopRecordingButton.style.display = "block"
    document.getElementById("canvas").style.display = "block";warning
    document.getElementById("warning").style.display = "none";
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    navigator.getUserMedia(
        {
            audio: true
        },
        function (e) {
            console.log("user consent");

            // cria o audio context
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            context = new AudioContext();

            // cria rum nó de audio do stream do microfone
            mediaStream = context.createMediaStreamSource(e);

            var bufferSize = 2048;
            var numberOfInputChannels = 2;
            var numberOfOutputChannels = 2;
            if (context.createScriptProcessor) {
                recorder = context.createScriptProcessor(bufferSize, numberOfInputChannels, numberOfOutputChannels);
            } else {
                recorder = context.createJavaScriptNode(bufferSize, numberOfInputChannels, numberOfOutputChannels);
            }

            recorder.onaudioprocess = function (e) {
                leftchannel.push(new Float32Array(e.inputBuffer.getChannelData(0)));
                rightchannel.push(new Float32Array(e.inputBuffer.getChannelData(1)));
                recordingLength += bufferSize;
            }

            // para ligar ao gravador
            mediaStream.connect(recorder);
            recorder.connect(context.destination);
        },
        function (e) {
            console.error(e);
        });
});

stopRecordingButton.addEventListener("click", function () {

    // parar o gravador
    startRecordingButton.style.display = "block"
    stopRecordingButton.style.display = "none"
    document.getElementById("canvas").style.display = "none";
    recorder.disconnect(context.destination);
    mediaStream.disconnect(recorder);

    var leftBuffer = flattenArray(leftchannel, recordingLength);
    var rightBuffer = flattenArray(rightchannel, recordingLength);

    // intervalamos ambos os sinais

    var interleaved = interleave(leftBuffer, rightBuffer);

    // cria um ficheiro wav
    var buffer = new ArrayBuffer(44 + interleaved.length * 2);
    var view = new DataView(buffer);

    // RIFF chunk descriptor
    writeUTFBytes(view, 0, 'RIFF');
    view.setUint32(4, 44 + interleaved.length * 2, true);
    writeUTFBytes(view, 8, 'WAVE');
    // FMT sub-chunk
    writeUTFBytes(view, 12, 'fmt ');
    view.setUint32(16, 16, true); // chunkSize
    view.setUint16(20, 1, true); // wFormatTag
    view.setUint16(22, 2, true); // wChannels: stereo (2 channels)
    view.setUint32(24, sampleRate, true); // dwSamplesPerSec
    view.setUint32(28, sampleRate * 4, true); // dwAvgBytesPerSec
    view.setUint16(32, 4, true); // wBlockAlign
    view.setUint16(34, 16, true); // wBitsPerSample
    // data sub-chunk
    writeUTFBytes(view, 36, 'data');
    view.setUint32(40, interleaved.length * 2, true);

    // escreve as amostras PCM
    var index = 44;
    var volume = 1;
    for (var i = 0; i < interleaved.length; i++) {
        view.setInt16(index, interleaved[i] * (0x7FFF * volume), true);
        index += 2;
    }

    // o Blob final
    blob = new Blob([view], { type: 'audio/wav' });

    ipaudio(blob)
});


function flattenArray(channelBuffer, recordingLength) {
    var result = new Float32Array(recordingLength);
    var offset = 0;
    for (var i = 0; i < channelBuffer.length; i++) {
        var buffer = channelBuffer[i];
        result.set(buffer, offset);
        offset += buffer.length;
    }
    return result;
}

function interleave(leftChannel, rightChannel) {
    var length = leftChannel.length + rightChannel.length;
    var result = new Float32Array(length);

    var inputIndex = 0;

    for (var index = 0; index < length;) {
        result[index++] = leftChannel[inputIndex];
        result[index++] = rightChannel[inputIndex];
        inputIndex++;
    }
    return result;
}

function writeUTFBytes(view, offset, string) {
    for (var i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
}


/* ************** Medidor de Volume  *************** */
navigator.getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia;
if (navigator.getUserMedia) {
    navigator.getUserMedia({
        audio: true
    },
        function (stream) {
            audioContext = new AudioContext();
            analyser = audioContext.createAnalyser();
            microphone = audioContext.createMediaStreamSource(stream);
            javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);

            analyser.smoothingTimeConstant = 0.8;
            analyser.fftSize = 1024;

            microphone.connect(analyser);
            analyser.connect(javascriptNode);
            javascriptNode.connect(audioContext.destination);

            canvasContext = $("#canvas")[0].getContext("2d");

            javascriptNode.onaudioprocess = function () {
                var array = new Uint8Array(analyser.frequencyBinCount);
                analyser.getByteFrequencyData(array);
                var values = 0;

                var length = array.length;
                for (var i = 0; i < length; i++) {
                    values += (array[i]);
                }

                var average = values / length;

                //          console.log(Math.round(average - 40));

                canvasContext.clearRect(0, 0, 150, 300);
                canvasContext.fillStyle = '#BadA55';
                canvasContext.fillRect(0, 300 - average, 150, 300);
                canvasContext.fillStyle = '#262626';
                canvasContext.font = "48px impact";
                canvasContext.fillText(Math.round(average - 0), -2, 300);

            } 
        },
        function (err) {
            console.log("The following error occured: " + err.name)
        });
} else {
    console.log("getUserMedia not supported");
}
