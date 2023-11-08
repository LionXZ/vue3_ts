import axios from '../utils/axios'

/**
 * 登录
 * @method post
 * @param {*} data
 * @returns
 */
export function user_login(data: any) {
  return axios.post(`/api/rest_j/v1/user/login`, data)
}