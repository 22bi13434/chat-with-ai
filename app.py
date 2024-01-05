# Use Werkzeug==2.2.0 instead of 3

from flask import Flask, render_template, request, jsonify, redirect, make_response
import openai
import random
app = Flask(__name__, static_url_path='/static')
import uuid

creativity=1
maxWord=500
modelGPT='gpt-3.5-turbo-0301'

conversation_history_dic = {}
user_session_id=""

API_1="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"
API_2="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"
API_3="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"
API_4="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"
API_5="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"
API_6="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"
API_7="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"
API_8="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"
API_9="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"
API_10="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"

@app.route("/")
def index():
    global user_session_id
    user_session_id = request.cookies.get('user_session_id', str(uuid.uuid4()))
    response = make_response(render_template("index.html", response=""))
    response.set_cookie('user_session_id', user_session_id)
    return response
@app.route("/version")
def version():
    return render_template("ver_description.html")
@app.route("/about")
def about():
    return render_template("about.html")
@app.route('/delete-conversation', methods=['GET'])
def delete_conversation():
    try:
        user_session_id = request.cookies.get('user_session_id')
        conversation_history_dic.pop(user_session_id)
        print("Delete conversation successfully!")
        return redirect("/")
    except:
        return redirect("/")

def askGPT(prompt):
    global conversation_history_dic
    try:
        response_ai = openai.ChatCompletion.create(
            model=modelGPT,
            messages=[
                {"role": "user", "content": prompt}],
            max_tokens=maxWord,
            temperature=creativity,
        )
        response_history=response_ai['choices'][0]['message']['content']
        user_session_id = request.cookies.get('user_session_id', str(uuid.uuid4()))
        if user_session_id not in conversation_history_dic:
            conversation_history_dic[user_session_id] = ""
        conversation_history_dic[user_session_id] += "User: " + prompt_get + "\n" + response_history + "\n"
        #print(conversation_history_dic)
        return response_ai['choices'][0]['message']['content']
    except:
        return "Limit reached. Try again in a few minutes!"

@app.route("/api/message")
def get_response():
    global prompt_get
    prompt_get = request.args.get("message")
    user_session_id = request.cookies.get('user_session_id', str(uuid.uuid4()))
    prompt= f"{conversation_history_dic.get(user_session_id)} {prompt_get}"
    print(prompt_get)
    response = askGPT(prompt)
    openai.api_key=random.choice([API_1, API_2, API_3, API_4, API_5, API_6, API_7, API_8, API_9, API_10])
    return jsonify({"response": response})

if __name__ == "__main__":
    app.run()