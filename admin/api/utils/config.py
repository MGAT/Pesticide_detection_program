#prerequisite:
#1.实例数据内，数据表格和统计表格之间至少空一行
#2.数据表格之间不能空行
from decimal import Decimal

#‘上机顺序‘ 字段在excel的列索引值，第一列的索引值为0
column_index_of_operation_order = 4
#‘上机顺序‘ 字段在excel的行索引值，第一列的索引值为0
row_index_of_operation_order = 5
#’毒性‘字段的行数
row_index_of_toxic_degree = 0

#两个毒物之间的列索引值的差值
interval_of_poisons = 8
#'省份' 字段的列索引值
column_index_of_location = 2

#居民日消费量 0.0406kg
daily_consumption = Decimal(0.0406)

#每日允许摄入量ADI值(mg/kg bw)
daily_adi = Decimal(0.03)

#变异因子
mutate_factor = 3

#急性参考计量ARfd ncbi 查询 的 行索引值
row_adi_value = 1

#急性参考计量ARfd ncbi 查询 的 行索引值
row_index_of_arfd_ncbi = 3

#每日允许摄入量ADI值（mg/kg bw） 的行索引值
row_adi_everyday = 4

