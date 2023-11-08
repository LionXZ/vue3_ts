import axios from '../utils/axios'


/**
 * 标签管理--标签列表
 * @method post
 * @param {*} data
 * @returns
 */
export function tableTag_queryTagList(data: any) {
  return axios.post(`/api/rest_j/v1/dataManagement/tableTag/queryTagList`, data)
}

/**
 * 标签管理--新增标签(POST
 * @method post
 * @param {*} data
 * @returns
 */
export function tableTag_addTag(data: any) {
  return axios.post(`/api/rest_j/v1/dataManagement/tableTag/addTag`, data)
}

/**
 * 标签管理--编辑标签(POST)
 * @method post
 * @param {*} data
 * @returns
 */
export function tableTag_editTag(data: any) {
  return axios.post(`/api/rest_j/v1/dataManagement/tableTag/editTag`, data)
}

/**
 * 标签管理--删除标签(POST)
 * @method post
 * @param {*} data
 * @returns
 */
export function tableTag_deleteTag(data: any) {
  return axios.post(`/api/rest_j/v1/dataManagement/tableTag/deleteTag`, data)
}


/**
 * 标签管理--标签关联列表-分页(GET)
 * @method get
 * @param {*} params
 * @returns
 */
export function tableTag_queryTableTagPageList(params: any) {
  return axios.get(`/api/rest_j/v1/dataManagement/tableTag/queryTableTagPageList`, params)
}

/**
 * 标签管理--删除关联标签(POST)
 * @method post
 * @param {*} data
 * @returns
 */
export function tableTag_deleteTableTag(data: any) {
  return axios.post(`/api/rest_j/v1/dataManagement/tableTag/deleteTableTag`, data)
}



/**
 * 标标签管理--数据库类型列表(POST)
 * @method post
 * @param {*} data
 * @returns
 */
export function tableTag_databaseTypeList(data: any) {
  return axios.post(`/api/rest_j/v1/dataManagement/tableTag/databaseTypeList`, data)
}

