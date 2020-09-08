import json, xlrd, datetime, os
import urllib.parse
from xlutils.copy import copy

from .utils import util
from flask import Flask, request, send_from_directory
from flask_cors import CORS
from decimal import Decimal

app = Flask(__name__, static_url_path='/file_store')
CORS(app)

project_path = os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir))
file_dir = project_path + "/api/file_store"


@app.route('/')
def hello_world():
    return 'Hello, World!'


@app.route('/get/static_file', methods=['GET'])
def get_model_file():
    filename = request.args.get('filename')
    return send_from_directory(project_path + "/api/file_store", filename=filename, as_attachment=True)


@app.route('/aaa', methods=['POST', 'GET'])
def aaa():
    a = request.args.get('a')
    b = request.args.get('b')
    c = request.args.get('c', '111')
    d = {'a': a, 'b': b, 'c': c}
    return json.dumps(d)


@app.route('/file/upload', methods=['POST'])
def import_file():
    params = request.form.to_dict()
    rindex = params['filename'].rindex('.')
    file_name = params['filename']

    # read params
    rb = xlrd.open_workbook(file_contents=request.files['file'].read())
    wb = copy(rb)
    ws = wb.get_sheet(1)
    sheets = rb.sheets()

    #处理文件
    product_params = util.get_product_constants(sheets[0])
    util.fill_out_sheet(product_params, sheets[1], ws)

    file_name = file_name[:rindex]+'_'+str(datetime.datetime.now().strftime('%Y%m%d_%H-%M-%S_%f')) + file_name[rindex:]
    file_path = os.path.join(file_dir, file_name)
    # request.files['file'].save(file_path)

    wb.save(file_path)

    return json.dumps({
        "filename": urllib.parse.quote(file_name),
        "product_params": product_params
    }, cls=DecimalEncoder)


@app.route('/get/location', methods=['GET'])
def get_location():
    value_sheet, data_sheet = get_sheet()
    column_index_poison_json = util.get_column_index_poison_json(data_sheet)
    location_json = util.compose_location_json(data_sheet, column_index_poison_json)
    return json.dumps(location_json, cls=DecimalEncoder)


@app.route('/get/count/sample', methods=['GET'])
def get_count_sample():
    value_sheet, data_sheet = get_sheet()
    item_arr = util.compose_sample_count(data_sheet)
    return json.dumps(util.revser_sample_count(item_arr))


@app.route('/get/count/check', methods=['GET'])
def get_count_check():

    value_sheet, data_sheet = get_sheet()
    column_index_poison_json = util.get_column_index_poison_json(data_sheet)
    return json.dumps(util.compose_check_count(data_sheet, column_index_poison_json), cls=DecimalEncoder)


@app.route('/get/data/by/weight', methods=['GET'])
def get_data_by_weight():
    value_sheet, data_sheet = get_sheet()
    weight = request.args.get('weight')
    column_index_poison_json = util.get_column_index_poison_json(data_sheet)
    product_params_json = util.get_product_constants(value_sheet)

    result = util.compose_data_by_weight(data_sheet, column_index_poison_json, product_params_json, weight)
    return json.dumps(result, cls=DecimalEncoder)


def get_sheet():
    file_name = urllib.parse.unquote(request.args.get('filename'))
    raw_data = xlrd.open_workbook(os.path.join(file_dir, file_name))
    return raw_data.sheets()[0], raw_data.sheets()[1]


class DecimalEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, Decimal):
            return float(o)
        super(DecimalEncoder, self).default(o)

