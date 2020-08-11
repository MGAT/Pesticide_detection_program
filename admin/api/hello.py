import json, xlrd, datetime, os
import urllib.parse

from .utils import util
from flask import Flask, request
from flask_cors import CORS
from decimal import Decimal

app = Flask(__name__)
CORS(app)

file_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir)) + "/api/file_store"

@app.route('/')
def hello_world():
    return 'Hello, World!'


@app.route('/aaa', methods=['POST', 'GET'])
def aaa():
    a = request.args.get('a')
    b = request.args.get('b')
    c = request.args.get('c', '111')
    return json.dumps({'a': a, 'b': b, 'c': c})


@app.route('/file/upload', methods=['POST'])
def import_file():
    params = request.form.to_dict()
    rindex = params['filename'].rindex('.')
    file_name = params['filename']

    file_name = file_name[:rindex]+'_'+str(datetime.datetime.now().strftime('%Y%m%d_%H-%M-%S_%f')) + file_name[rindex:]

    file_path = os.path.join(file_dir, file_name)

    request.files['file'].save(file_path)
    return json.dumps(urllib.parse.quote(file_name))


@app.route('/get/location', methods=['GET'])
def get_location():
    sheet = get_sheet()
    column_index_poison_json = util.get_column_index_poison_json(sheet)
    location_json = util.compose_location_json(sheet, column_index_poison_json)
    return json.dumps(location_json, cls=DecimalEncoder)


@app.route('/get/count/sample', methods=['GET'])
def get_count_sample():
    sheet = get_sheet()
    item_arr = util.compose_smaple_count(sheet)
    return json.dumps(util.revser_sample_count(item_arr))


@app.route('/get/count/check', methods=['GET'])
def get_count_check():

    sheet = get_sheet()
    column_index_poison_json = util.get_column_index_poison_json(sheet)
    return json.dumps(util.compose_check_count(sheet, column_index_poison_json), cls=DecimalEncoder)


@app.route('/get/data/by/weight', methods=['GET'])
def get_data_by_weight():
    sheet = get_sheet()
    weight = request.args.get('weight')
    column_index_poison_json = util.get_column_index_poison_json(sheet)

    result = util.compose_data_by_weight(sheet, column_index_poison_json, weight)
    return json.dumps(result, cls=DecimalEncoder)


def get_sheet():
    file_name = urllib.parse.unquote(request.args.get('filename'))
    raw_data = xlrd.open_workbook(os.path.join(file_dir, file_name))
    return raw_data.sheets()[1]


class DecimalEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, Decimal):
            return float(o)
        super(DecimalEncoder, self).default(o)

