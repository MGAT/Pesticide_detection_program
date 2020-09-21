import re
from . import config
from decimal import Decimal
import numpy as np

pattern = re.compile(r'^[-+]?[0-9]+\.?[0-9]+$')

cons_title_arr = ['C膳食比例得分', 'D农药使用频率得分', 'E高暴露人群得分']

def get_product_constants(product_sheet) :
    arr_title = product_sheet.row_values(0)
    arr_value = product_sheet.row_values(1)
    result = {}
    for i, title in enumerate(arr_title):
        title = title.replace(' ', '')
        if len(title) != 0:
            value = str(arr_value[i]).replace(' ', '')
            result[title] = Decimal(value) if pattern.match(value) else value

    return result


def fill_out_sheet(product_params, data_sheet, ws):
    title_arr = data_sheet.row_values(config.row_index_of_operation_order)
    degree_arr = data_sheet.row_values(config.row_adi_value)
    #the starting row index
    data_row = config.row_index_of_operation_order + 1
    nrows = data_sheet.nrows

    while data_row < nrows:
        data_cells = data_sheet.row_values(data_row)
        for i, title in enumerate(title_arr):
            if i < config.column_index_of_operation_order+1:
                continue

            title = title.replace(' ', '')
            if title in cons_title_arr:
                ws.write(data_row, i, product_params[title])
                # data_cells[i] = product_params[title]
                product_params["total_degrees"]['right'] += product_params[title]

            elif (i-5) % 8 == 0:
                product_params['adi_toxicity'] = float(degree_arr[i]) if degree_arr[i] != '' else 0.0
                product_params['check_value'] = float(data_cells[i]) if data_cells[i] != '' else ''#代表未检出
                product_params["total_degrees"] = {
                    'left': 0,
                    'right': 0
                }
            elif title == 'B毒效得分LOD50':
                toxicity_degree = 0
                adi_toxicity = product_params.pop('adi_toxicity')
                if adi_toxicity >= 0.01:
                    adi_toxicity = 0
                    toxicity_degree = 2
                elif adi_toxicity >= 0.001:
                    adi_toxicity = 1
                    toxicity_degree = 3
                elif adi_toxicity >= 0.0001:
                    adi_toxicity = 2
                    toxicity_degree = 4
                else:
                    adi_toxicity = 3
                    toxicity_degree = 5

                ws.write(data_row, i, adi_toxicity)
                ws.write(data_row, i-1, toxicity_degree)
                #由于B毒效得分LOD50 在 A毒性得分之后遍历
                #所以只能处理B之后，再处理A
                product_params["total_degrees"]['left'] += (adi_toxicity+toxicity_degree)

            elif title == 'F残留水平得分':
                check_value = product_params.pop('check_value')
                if check_value == '':
                    check_value = 1
                elif check_value < 1:
                    check_value = 2
                elif check_value < 10:
                    check_value = 3
                else:
                    check_value = 4
                ws.write(data_row, i, check_value)
                product_params["total_degrees"]['right'] += check_value

            elif title == 'B毒效得分LOD50':
                # 所以只能处理B之后，再处理A
                #    product_params["total_degrees"]['left'] += data_cells[i]
                pass

            elif title.startswith("风险得分S"):
                ws.write(data_row, i, Decimal(product_params["total_degrees"]['left']) * product_params["total_degrees"]['right'])
                # data_cells[i] = product_params["total_degrees"]

        data_row += 1

    product_params.pop("total_degrees")
    product_params.pop("adi_toxicity")
    product_params.pop("check_value")

def get_column_index_poison_json(sheet):
    arr = sheet.row_values(config.row_index_of_operation_order)
    degree_arr = sheet.row_values(config.row_index_of_toxic_degree)
    arfd_ncbi_arr = sheet.row_values(config.row_index_of_arfd_ncbi)
    adi_everyday_arr = sheet.row_values(config.row_adi_everyday)

    i = config.column_index_of_operation_order + 1
    length = len(arr)
    column_index_poison_json = {}

    while i < length:
        degree = degree_arr[i].replace(' ', '')
        if degree == '':
            break
        adi_everyday = str(adi_everyday_arr[i]).replace(' ', '')
        adi_everyday = Decimal(adi_everyday) if pattern.match(adi_everyday) else adi_everyday

        column_index_poison_json[str(i)] = {
            'degree': degree,
            'name': arr[i].replace(' ', ''),
            'arfd_ncbi': Decimal(arfd_ncbi_arr[i]) if arfd_ncbi_arr[i] != 'unnecessary' else -1,
            'adi_everyday': adi_everyday
        }

        i += config.interval_of_poisons

    return column_index_poison_json


def compose_location_json(sheet, column_index_poison_json):
    data_row = config.row_index_of_operation_order + 1
    location_json = {} #location : {name: averages}
    # make averages
    total_average_json = {}

    nrows = sheet.nrows
    while nrows > data_row:
        data_cells = sheet.row_values(data_row)
        if data_cells[config.column_index_of_operation_order].replace(' ', '') == '':
            break

        location = data_cells[config.column_index_of_location].replace(' ', '')
        #init location
        if location not in location_json:
            location_json[location] = {}
            for column_index, poison_json in column_index_poison_json.items():
                location_json[location][poison_json['name']] = []

        #iterate data
        for column_index, poison_json in column_index_poison_json.items():
            value = data_cells[int(column_index)]
            if poison_json['name'] not in total_average_json:
                total_average_json[poison_json['name']] = []

            if value:
                value = Decimal(data_cells[int(column_index)])

                location_json[location][poison_json['name']].append(value)
                total_average_json[poison_json['name']].append(value)

        data_row += 1

    for value in list(location_json.items()):
        average_json = value[1]
        for value1 in list(average_json.items()):
            average = value1[1]
            average_json[value1[0]] = {
                "average": np.mean(average) if average else None,
                "arr": average
            }

    for value in list(total_average_json.items()):
        average_arr = value[1]
        total_average_json[value[0]] = np.mean(average_arr) if average_arr else None

    return {
        "location_json": location_json,
        "total_average_json": total_average_json
    }

#按照一个样品中检出的农药残留种类排序
def compose_sample_count(sheet):
    data_row = config.row_index_of_operation_order + 1
    degree_arr = sheet.row_values(config.row_index_of_toxic_degree)

    item_arr = []
    nrows = sheet.nrows
    while nrows > data_row:
        data_cells = sheet.row_values(data_row)
        if data_cells[config.column_index_of_operation_order].replace(' ', '') == '':
            break

        point = config.column_index_of_operation_order
        item = {
            'sample':  data_cells[point],
            'cnt': 0
        }
        item_arr.append(item)
        point += 1
        while degree_arr[point].replace(' ', '') != '':
            value = data_cells[point]
            if value != '':
                item['cnt'] += 1
            point += config.interval_of_poisons
        data_row += 1

    #reverse
    return item_arr


def revser_sample_count(item_arr):
    final_json = {}
    for i, value in enumerate(item_arr):
        cnt = str(value['cnt'])
        if cnt not in final_json:
            final_json[cnt] = {
                "names": [],
                "sample_cnt": 0,
            }
        final_json[cnt]['names'].append(value['sample'])
        final_json[cnt]['sample_cnt'] += 1

    return [(k, final_json[k]) for k in sorted(final_json.keys())]


def compose_check_count(sheet, column_index_poison_json):

    data_row = config.row_index_of_operation_order + 1
    nrows = sheet.nrows
    while nrows > data_row:
        data_cells = sheet.row_values(data_row)
        if data_cells[config.column_index_of_operation_order].replace(' ', '') == '':
            break

        for index, json_value in column_index_poison_json.items():
            data_cell = data_cells[int(index)]
            if data_cell == '':
                continue
            if 'cnt' not in json_value:
                json_value['cnt'] = 0
            json_value['cnt'] += 1

        data_row += 1

    return sorted(list(column_index_poison_json.values()), key=lambda x: x['cnt'], reverse=True)


def compose_data_by_weight(sheet, column_index_poison_json, product_params_json, weight):
    data_row = config.row_index_of_operation_order + 1
    nrows = sheet.nrows

    while nrows > data_row:
        data_cells = sheet.row_values(data_row)
        if data_cells[config.column_index_of_operation_order].replace(' ', '') == '':
            break
        for index, json_value in column_index_poison_json.items():
            data_cell = data_cells[int(index)]

            score_cell = data_cells[int(index)+config.interval_of_poisons-1]
            if score_cell == '':
                score_cell = 0

            if 'values' not in json_value:
                json_value['values'] = []
                json_value['scores'] = []
            if data_cell != '':
                json_value['values'].append(Decimal(data_cell))

            json_value['scores'].append(Decimal(score_cell))

        data_row += 1

    final_arr = []
    weight = Decimal(weight)

    for i, value in enumerate(column_index_poison_json.values()):
        # print(value)
        value['average_value'] = np.mean(value['values'])
        value['average_score'] = np.mean(value['scores'])
        value['adi'] = value['average_value'] * product_params_json['居民日均消费量/kg'] / weight / value['adi_everyday'] * 100
        value['percentile_99.9'] = np.percentile(value['values'], Decimal(99.9))

        value['esti'] = (product_params_json['单果重/kg'] * value['percentile_99.9'] * config.mutate_factor +
                 (product_params_json['大餐份/kg'] - product_params_json['单果重/kg']) * value['percentile_99.9']) / weight

        arfd_ncbi = value['arfd_ncbi']
        if arfd_ncbi == -1:
            value['arfd'] = -1
            value['SM'] = None

        else:
            value['arfd'] = Decimal(value['esti']) / arfd_ncbi * 100
            value['SM'] = arfd_ncbi * weight / (product_params_json['单果重/kg'] * config.mutate_factor
                                                    + product_params_json['大餐份/kg'] - product_params_json['单果重/kg'])

        value['eMRL'] = value['adi_everyday'] * weight / product_params_json['大餐份/kg']

        final_arr.append(value)

    return final_arr
