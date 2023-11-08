import axios from '../utils/axios'

/**
 * 首页-首页检索(POST)
 * @method post
 * @param {*} data 
 * @returns 
 */
export function homePreview_homeQuery(data: any) {
  return axios.post(`/api/rest_j/v1/dataManagement/homePreview/homeQuery`, data)
}
 

/**
 * 首页--首页检索-表(GET)
 * @method get
 * @param {*} params 
 * @returns 
 */
export function homePreview_homeQueryTable(params: any) {
  return axios.get(`/api/rest_j/v1/dataManagement/homePreview/homeQueryTable`, params)
}

/**
 * 首页--首页检索-字典(GET)
 * @method get
 * @param {*} params 
 * @returns 
 */
export function homePreview_homeQueryMetadata(params: any) {
  return axios.get(`/api/rest_j/v1/dataManagement/homePreview/homeQueryMetadata`, params)
}

/**
 * 首页--首页检索-指标(GET)
 * @method get
 * @param {*} params 
 * @returns 
 */
export function homePreview_homeQueryCriterion(params: any) {
  return axios.get(`/api/rest_j/v1/dataManagement/homePreview/homeQueryCriterion`, params)
}

/**
 * 首页--首页检索-字段(GET)
 * @method get
 * @param {*} params 
 * @returns 
 */
export function homePreview_homeQueryDetail(params: any) {
  return axios.get(`/api/rest_j/v1/dataManagement/homePreview/homeQueryDetail`, params)
}

/**
 * 首页--首页检索-主题域(GET)
 * @method get
 * @param {*} params 
 * @returns 
 */
export function homePreview_homeQuerySubject(params: any) {
  return axios.get(`/api/rest_j/v1/dataManagement/homePreview/homeQuerySubject`, params)
}


/**
 * 首页--字典详情(POST)
 * @method post
 * @param {*} data 
 * @returns 
 */
export function homePreview_metadataQuery(data: any) {
  return axios.post(`/api/rest_j/v1/dataManagement/homePreview/metadataQuery`, data)
}


/**
 * 首页--指标详情(POST)
 * @method post
 * @param {*} data 
 * @returns 
 */
export function homePreview_criterionQuery(data: any) {
  return axios.post(`/api/rest_j/v1/dataManagement/homePreview/criterionQuery`, data)
}


/**
 * 首页--检索记录(POST)
 * @method post
 * @param {*} data 
 * @returns 
 */
export function homePreview_querySearchLog(data: any) {
  return axios.post(`/api/rest_j/v1/dataManagement/homePreview/querySearchLog`, data)
}
