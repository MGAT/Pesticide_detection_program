
from . import config
from decimal import Decimal
import numpy as np


def get_column_index_poison_json(sheet):
    arr = sheet.row_values(config.row_index_of_operation_order)
    degree_arr = sheet.row_values(config.row_index_of_toxic_degree)
    arfd_ncbi_arr = sheet.row_values(config.row_index_of_arfd_ncbi)

    i = config.column_index_of_operation_order + 1
    length = len(arr)
    column_index_poison_json = {}

    while i < length:
        degree = degree_arr[i].replace(' ', '')
        if degree == '':
            break

        column_index_poison_json[str(i)] = {
            'degree': degree,
            'name': arr[i].replace(' ', ''),
            'arfd_ncbi': Decimal(arfd_ncbi_arr[i]) if arfd_ncbi_arr[i] != 'unnecessary' else -1
        }

        i += config.interval_of_poisons

    return column_index_poison_json


def compose_location_json(sheet, column_index_poison_json):
    data_row = config.row_index_of_operation_order + 1
    location_json = {} #location : {name: averages}

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
            if value:
                value = Decimal(data_cells[int(column_index)])
            else:
                value = Decimal(0)
            location_json[location][poison_json['name']].append(value)

        data_row += 1

    #make averages
    for value in list(location_json.items()):
        average_json = value[1]
        for value1 in list(average_json.items()):
            average = value1[1]
            average_json[value1[0]] = {
                "average": np.mean(average),
                "arr": average
            }

    return location_json

#按照一个样品中检出的农药残留种类排序
def compose_smaple_count(sheet):
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


def compose_data_by_weight(sheet, column_index_poison_json, weight):
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
        value['adi'] = value['average_value'] * config.daily_consumption / weight / (config.daily_adi * 100)
        value['percentile_99.9'] = np.percentile(value['values'], Decimal(99.9))

        value['esti'] = (
                            config.weight_per_fruit * value['percentile_99.9'] * config.mutate_factor +
                            (config.big_meal - config.weight_per_fruit) * value['percentile_99.9'] / weight
                        ) / weight
        arfd_ncbi = value['arfd_ncbi']
        if arfd_ncbi == -1:
            value['arfd'] = -1
        else:
            value['arfd'] = Decimal(value['esti']) / arfd_ncbi * 100

        final_arr.append(value)

    return final_arr
