import asyncio
import os
import uuid

from flask import Flask, jsonify, request
from convertToImage import Audio

app = Flask(__name__)

# Inicio do serviço que recebe um audio em forme data e devolve o resultado num json
@app.route('/audio', methods=['GET', 'POST'])
def uploadfile():
    if request.method == 'POST':
        # Guardar a informação recebida - Ficheiro de som
        f = request.files['file']
        # caminho onde fica guardado o som temporário e nome de ficheiro gerado aleaotóriamente
        # (Para se poder chamar o serviço mais de uma vez)
        filePath = "../audio/"+str(uuid.uuid4())
        # Guardar temporáriamente o ficheiro no sistema
        f.save(filePath)

        # envia para a função a path do ficheiro para converter em imagem e fazer o teste
        # Devolve o resultado da análise
        result = asyncio.run(Audio.getImage(filePath))
        f.close()
        # Cria um objecto com o resultado
        result = {'Result: ': result}
        # Elimina o som criado temporáriamente no sistema
        os.remove(filePath)
        # converte o resultado para jason envia como resposta do serviço
        return jsonify(result)
        request.close()

# inicio da aplicação
if __name__ == "__main__":
    app.run(debug=True)