from app import app

if '__main__' == __name__:
    app.run(host='0.0.0.0', port=10000, debug=False)
