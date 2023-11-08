import { Message } from 'view-ui-plus';
import axiosRetry from 'axios-retry';
import axios, { AxiosError, AxiosInstance, AxiosPromise, AxiosRequestConfig, AxiosResponse } from 'axios';
import router from '../router';

export interface IDataWithError<T> {
  data: T;
  status?: number;
  message?: string;
  method?: string;
}

class HttpService {
  private http!: AxiosInstance;

  constructor() {
    this.http = axios.create({
    });

    axiosRetry(this.http, {
      retries: 3,//重复请求次数
      shouldResetTimeout: true,
      // 重复请求延迟
      retryDelay: (retryCount: number) => {
        return retryCount * 1000;
      },
      retryCondition: (error: AxiosError) => {
        if (error.message.includes('timeout')) {
          return true;
        }

        return !error.response || error.response.status !== 401;
      },
    });

    this.addInterceptors(this.http);
  }

  get<T>(url: string, params?: unknown, config?: AxiosRequestConfig) {
    return this.handleErrorWrapper<T>(this.http.get(url, {
      ...config, params
    }));
  }

  post<T>(url: string, param: unknown, config?: AxiosRequestConfig) {
    return this.handleErrorWrapper<T>(this.http.post(url, param, config));
  }

  postDownload<T>(url: string, param: unknown, responseType: any) {
    return this.handleErrorWrapper<T>(this.http.post(url, param, {
      responseType: responseType
    }));
  }

  put<T>(url: string, param: unknown, config?: AxiosRequestConfig) {
    return this.handleErrorWrapper<T>(this.http.put(url, param, config));
  }

  delete<T>(url: string, param: unknown, config?: AxiosRequestConfig) {
    return this.handleErrorWrapper<T>(this.http.delete(url, { data: param, ...config }));
  }

  private addInterceptors(http: AxiosInstance) {
    // 一、请求拦截器
    http.interceptors.request.use((config: any) => {
      //https://www.cnblogs.com/hz-1762/p/10480274.html
      /**axios默认用get传值时用params传参，用post传值时，用data传参，就是用post传值时，url参数影响了请求地址自动加上了params,因此需要在请求开始时做一个拦截就好了 */
      if (config.method == 'post') {
        config.params = {};
      }
      return config
    });

    // 二、响应拦截器
    http.interceptors.response.use(
      (response: AxiosResponse) => {
        if (response.config.responseType && (response.config.responseType == 'arraybuffer' || response.config.responseType == 'blob')) {
          return response
        }
        const resData = response.data ? response.data : response
        return resData
      },
      (error: AxiosError | any) => {
        //错误处理
        switch (error.response.status) {
          case 401:
            // router.replace("/login")
            // location.href = `${window.location.host}/#/login`;
            if (window != top) {
              top.location.href = `${document.referrer}#/login`
            } else {
              router.replace("/login")
            }
            Message['error']({
              content: error.response.data.message,
              duration: 1,
              background: true
            })
            break;
          case 405 || 404:
            Message['error']({
              content: "未知请求，请检查请求是否错误？",
              duration: 2,
              background: true
            })
            break;
          default:
            break;
        }
        return Promise.reject(error);
      },
    );
  }

  private async handleErrorWrapper<T>(p: AxiosPromise): Promise<IDataWithError<T>> {
    return p
      .then((response) => {
        return response
      })
      .catch((error: AxiosError | any) => {
        return Promise.reject({
          ...error.response?.data,
        });
      });
  }
}

export default new HttpService();
