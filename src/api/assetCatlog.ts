import axios from '../utils/axios'
import axios2 from '../utils/axios2'

/**
 * 资产目录-导航目录(POST)
 * @method post
 * @param {*} data
 * @returns
 */
export function assetCatalog_queryCatalog(data: any) {
  return axios.post(`/api/rest_j/v1/dataManagement/assetCatalog/queryCatalog`, data)
}


/**
 * 资产目录-表检索(GET)
 * @method get
 * @param {*}  
 * @returns 
 */
export function assetCatalog_queryTablePageList(params: any) {
  return axios.get(`/api/rest_j/v1/dataManagement/assetCatalog/queryTablePageList`, params)
}


/**
 * 资产目录-表详细(POST)
 * @method post
 * @param {*} data
 * @returns
 */
export function assetCatalog_queryTable(data: any) {
  return axios.post(`/api/rest_j/v1/dataManagement/assetCatalog/queryTable`, data)
}

/**
 * 资产目录-更新表详情(POST)
 * @method post
 * @param {*} data
 * @returns
 */
export function assetCatalog_editTable(data: any) {
  return axios.post(`/api/rest_j/v1/dataManagement/assetCatalog/editTable`, data)
}


/**
 * 资产目录-数据表管理--表详情页基本信息(POST)
 * @method post
 * @param {*} data
 * @returns
 */
export function assetCatalog_queryTableInfo(data: any) {
  return axios.post(`/api/rest_j/v1/dataManagement/assetCatalog/queryTableInfo`, data)
}

/**
 * 资产目录-数据表管理--表详情页数据预览  (POST)
 * @method post
 * @param {*} data
 * @returns
 */
export function dataPreview_preview(data: any) {
  return axios.post(`/api/rest_j/v1/dataManagement/dataPreview/preview`, data)
}


/**
 * 资产目录-数据表管理--表详情页变更记录  (GET)
 * @method get
 * @param {*} params
 * @returns
 */
export function assetCatalog_updateTableLog(params: any) {
  return axios.get(`/api/rest_j/v1/dataManagement/assetCatalog/updateTableLog`, params)
}

/**
 * 资产目录-数据表管理--表详情页-标签列表
 * @method post
 * @param {*} data
 * @returns
 */
export function tableTag_queryTagList(data: any) {
  return axios.post(`/api/rest_j/v1/dataManagement/tableTag/queryTagList`, data)
}

/**
 * 资产目录-数据表管理--表详情页-用户查询
 * @method get
 * @param {*} params
 * @returns
 */
export function listUser(params: any) {
  return axios.get(`/api/rest_j/v1/dss/framework/permission/listUser`, params)
}

/**
 * 资产目录--更新表结构业务描述
 * @method post
 * @param {*} data
 * @returns
 */
export function assetCatalog_updateDetailService(data: any) {
  return axios.post(`/api/rest_j/v1/dataManagement/assetCatalog/updateDetailService
`, data)
}


/**
 * 资产目录--模糊查询atlas信息接口(POST)
 * @method post
 * @param {*} data
 * @returns
 */
 export function search_basic(data: any) {
  return axios2.post(`/atlasApi/atlas/v2/search/basic`, data)
}


/**
 * 资产目录--根据id查询atlas信息接口（GET）
 * @method get
 * @param {*} params
 * @returns
 */
 export function lineage(params: any) {
  return axios2.get(`/atlasApi/atlas/v2/lineage/${params.guid}`)
}
/**
 * 资产目录--根据id查询atlas实体信息接口（GET）
 * @method get
 * @param {*} params
 * @returns
 */
 export function entity_guid(params: any) {
  return axios2.get(`/atlasApi/atlas/v2/entity/guid/${params.guid}`)
}
