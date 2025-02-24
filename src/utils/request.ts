import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosHeaders,
  RawAxiosRequestHeaders,
} from 'axios';
import { message } from 'ant-design-vue';

// 自定义配置接口
// 自定义配置接口
interface CustomRequestConfig extends Omit<InternalAxiosRequestConfig, 'headers'> {
  skipErrorHandler?: boolean;
  cache?: boolean;
  headers?: RawAxiosRequestHeaders;
}

// 创建请求实例
class Request {
  private instance: AxiosInstance;

  constructor(config: AxiosRequestConfig) {
    this.instance = axios.create({
      baseURL: import.meta.env.VITE_BASEURL,
      timeout: 60000,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      ...config,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // 请求拦截器
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // 确保 headers 存在
        const headers = new AxiosHeaders(config.headers);

        // 处理 token
        const userKey = localStorage.getItem('userKey');
        if (userKey) {
          const { token } = JSON.parse(userKey);
          if (token) {
            headers.token = token;
          }
        }

        // 处理缓存
        if ((config as CustomRequestConfig).cache) {
          headers['Cache-Control'] = 'max-age=604800000';
        }

        // 将修改后的 headers 赋值回 config
        config.headers = headers;

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response.data;
      },
      (error) => {
        if (!(error.config as CustomRequestConfig)?.skipErrorHandler) {
          this.handleError(error);
        }
        return Promise.reject(error);
      }
    );
  }

  private handleError(error: any) {
    if (error.response) {
      const status = error.response.status;
      const errorMessage = this.getErrorMessage(status);
      message.error(errorMessage);

      // 处理特殊状态码
      if (status === 401) {
        // 处理未授权，例如跳转到登录页
      }
    } else {
      message.error('网络连接失败，请稍后重试');
    }
  }

  private getErrorMessage(status: number): string {
    const messages: Record<number, string> = {
      400: '请求参数错误',
      401: '未授权，请重新登录',
      403: '访问被拒绝',
      404: '请求的资源不存在',
      408: '请求超时',
      500: '服务器内部错误',
      501: '服务未实现',
      502: '网关错误',
      503: '服务不可用',
      504: '网关超时',
      505: 'HTTP版本不受支持',
    };

    return messages[status] || `未知错误(${status})`;
  }

  // 封装请求方法
  request<T = any>(config: CustomRequestConfig): Promise<T> {
    const { headers, ...rest } = config;
    return this.instance.request({
      ...rest,
      headers: headers || {},
    });
  }

  get<T = any>(url: string, config: Partial<CustomRequestConfig> = {}): Promise<T> {
    return this.request({
      ...config,
      method: 'GET',
      url,
      headers: config.headers || {},
    });
  }

  post<T = any>(url: string, data?: any, config: Partial<CustomRequestConfig> = {}): Promise<T> {
    return this.request({
      ...config,
      method: 'POST',
      url,
      data,
      headers: config.headers || {},
    });
  }

  put<T = any>(url: string, data?: any, config: Partial<CustomRequestConfig> = {}): Promise<T> {
    return this.request({
      ...config,
      method: 'PUT',
      url,
      data,
      headers: config.headers || {},
    });
  }

  delete<T = any>(url: string, config: Partial<CustomRequestConfig> = {}): Promise<T> {
    return this.request({
      ...config,
      method: 'DELETE',
      url,
      headers: config.headers || {},
    });
  }
}

export const request = new Request({});
