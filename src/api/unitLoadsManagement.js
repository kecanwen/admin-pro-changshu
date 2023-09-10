import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/UnitLoads/getUnitLoadsList',
    method: 'get',
    params: params,
  })
}

export function getExcelList(params) {
  return request({
    url: '/UnitLoads/ExportGetUnitLoadsList',
    method: 'get',
    params: params,
  })
}
export function getMaterialsTypeOptionApi(params) {
  return request({
    url: '/ContainerType/GetMaterialsTypeOption',
    method: 'get',
    params,
  })
}
export function doEdit(data) {
  return request({
    url: '/Tasks/AddOrUpdate',
    method: 'post',
    data,
  })
}

export function doDelete(data) {
  return request({
    url: '/Tasks/Delete',
    method: 'post',
    data,
  })
}
//锁定批次 updateBatchNo
export function updateBatchNo(params) {
  return request({
    url: '/UnitLoads/updateBatchNo',
    method: 'get',
    params,
  })
}

//禁入
export function updateForbidInbound(data) {
  return request({
    url: '/PlainLocations/UpdateForbidInbound',
    method: 'post',
    data,
  })
}

//禁出
export function updateupForbidOutbound(data) {
  return request({
    url: '/PlainLocations/UpdateupForbidOutbound',
    method: 'post',
    data,
  })
}

//导出
// export function getExcelList(params) {
//   return request({
//     url: '/UnitLoads/ExportGetUnitLoadsList',
//     method: 'get',
//     params: params,
//   })
// }
