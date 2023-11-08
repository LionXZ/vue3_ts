import axios from '../utils/axios'

/**
 * 资产总览--首页统计接口(POST) 
 * @method post
 * @param {*} data
 * @returns
 */
export function homePreview_dataTotalNumber(data: any) {
  return axios.post(`/api/rest_j/v1/dataManagement/homePreview/dataTotalNumber`, data)
}

/**
 * 资产总览--数据表分布-来源(POST) 
 * @method post
 * @param {*} data
 * @returns
 */
export function homePreview_dataPercentTier(data: any) {
  return axios.post(`/api/rest_j/v1/dataManagement/homePreview/dataPercentTier`, data)
}

/**
 * 资产总览--数据指标分布(POST) 
 * @method post
 * @param {*} data
 * @returns
 */
export function homePreview_dataCriterionPercent(data: any) {
  return axios.post(`/api/rest_j/v1/dataManagement/homePreview/dataCriterionPercent`, data)
}

/**
 * 资产总览--数据表分布-按主题域(POST) 
 * @method post
 * @param {*} data
 * @returns
 */
export function homePreview_dataPercentSubject(data: any) {
  return axios.post(`/api/rest_j/v1/dataManagement/homePreview/dataPercentSubject`, data)
}

/**
 * 资产总览--数据量变化趋势(POST) 
 * @method post
 * @param {*} data
 * @returns
 */
export function homePreview_dataPercentTrend(data: any) {
  return axios.post(`/api/rest_j/v1/dataManagement/homePreview/dataPercentTrend`, data)
}