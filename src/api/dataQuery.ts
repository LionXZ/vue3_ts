import axios from '../utils/axios'
/**
 * 数据表中提供sql语句验证是否正确的接口(POST)
 * @method post
 * @param {*} data 
 * @returns 
 */
export function dw_tablesql_verifySQL(data: any) {
  return axios.post(`/api/rest_j/v1/dw/tablesql/verifySQL`, data)
}



/**
 * 获取数据库和表
 * @method get
 * @param {*}  
 * @returns 
 */
export function datasource_all() {
  return axios.get(`/api/rest_j/v1/datasource/all`)
}


/**
 *  获取字段
 * @method get
 * @param {*}  params
 * @returns 
 */
export function datasource_columns(params: any) {
  return axios.get(`/api/rest_j/v1/datasource/columns`, params)
}


/**
 * 执行
 * @method post
 * @param {*} data 
 * @returns 
 */
/**{"executeApplicationName":"hive","executionCode":"select * from hz_dwd.hz_dwd_signal_logs limit 100","runType":"hql","params":{"variable":{},"configuration":{}},"source":{"scriptPath":"hz_dwd.hz_dwd_signal_logs_select.hql"}}
 */
export function entrance_execute(data: any) {
  return axios.post(`/api/rest_j/v1/entrance/execute`, data)
}

/**
 *  停止
 * @method get
 * @param {*}  params
 * @returns 
 */
export function entrance_kill(params: any) {
  return axios.get(`/api/rest_j/v1/dss/flow/entrance/${params.execID
    }/kill`, { taskID: params.taskID })
}

/**
 *  执行状态监听
 * @method get
 * @param {*}  params
 * @returns 
 */
export function entrance_status(params: any) {
  return axios.get(`/api/rest_j/v1/entrance/${params.execID
    }/status`, { taskID: params.taskID })
}

/**
 *  执行进度监听
 * @method get
 * @param {*}  params
 * @returns 
 */
export function entrance_progress(params: any) {
  return axios.get(`/api/rest_j/v1/entrance/${params.execID
    }/progress`)
}


/**
 *  实时获取log
 * @method get
 * @param {*}  params
 * @returns 
 */
export function entrance_log(params: any) {
  return axios.get(`/api/rest_j/v1/entrance/${params.execID
    }/log?fromLine=18&size=-1`)
}



/**
 *  获取info
 * @method get
 * @param {*}  params
 * @returns 
 */
export function jobhistory_get(params: any) {
  return axios.get(`/api/rest_j/v1/jobhistory/${params.taskID
    }/get`)
}


/**
 *  获取log(根据历史接口获取)
 * @method get
 * @param {*}  params
 * @returns 
 */
export function filesystem_openLog(params: any) {
  return axios.get(`/api/rest_j/v1/filesystem/openLog`, params)
}
/**
 *  获取结果集
 * @method get
 * @param {*}  params
 * @returns 
 */
export function filesystem_getDirFileTrees(params: any) {
  return axios.get(`/api/rest_j/v1/filesystem/getDirFileTrees`, params)
}

/**
 *  获取结果
 * @method get
 * @param {*}  params
 * @returns 
 */
export function filesystem_openFile(params: any) {
  return axios.get(`/api/rest_j/v1/filesystem/openFile`, params)
}


/**
 *  日志下载
 * @method postDownload
 * @param {*}  data
 * @returns 
 */
export function filesystem_download(data: any) {
  return axios.postDownload(`/api/rest_j/v1/filesystem/download`, data, "blob")
}




/**
 * 数据查询--保存接口(POST)
 * @method post
 * @param {*} data 
 * @returns 
 */
export function saveScript(data: any) {
  return axios.post(`/api/rest_j/v1/dataManagement/script/saveScript
`, data)
}


/**
 * 数据查询--删除接口(POST)
 * @method post
 * @param {*} data 
 * @returns 
 */
export function deleteScript(data: any) {
  return axios.post(`/api/rest_j/v1/dataManagement/script/deleteScipt
`, data)
}



/**
 * 数据查询--分页查询保存的sql接口(GET)
 * @method get
 * @param {*} params 
 * @returns 
 */
export function listScript(params: any) {
  return axios.get(`/api/rest_j/v1/dataManagement/script/listScript
`, params)
}
