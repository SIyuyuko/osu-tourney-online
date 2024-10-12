/*
 * @Author: SIyuyuko 3228981717@qq.com
 * @Date: 2024-10-10 22:34:35
 * @LastEditors: SIyuyuko 3228981717@qq.com
 * @LastEditTime: 2024-10-12 22:32:51
 * @FilePath: \osu-tourney-online\src\api\data_api.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import axios from '../http/axios.js';
/** 登录获取授权链接 */
export const getOauthUrl = () => {
  return axios({
    method: 'get',
    url: '/sp/public/getOauthUrl',
    baseURL: window.location.href,
  });
};
/** token登陆 */
export const login = (params) => {
  return axios({
    method: 'get',
    url: `/api/user/login?code=${params}`,
  });
};
/** 创建图池 */
export const addPool = () => {
  return axios({
    method: 'put',
    url: '/api/map/createPool',
  });
};
// 生成比赛图池
export const getMappool = (params) => {
  return axios({
    method: 'post',
    url: `/pool?name=${params.name}`,
    data: params.data,
    responseType: 'blob',
  });
};
// 投骰子
export const getDice = (params) => {
  return axios({
    method: 'get',
    url: `/dice`,
    params,
  });
};
// 玩家登录
export const getLogin = (params) => {
  return axios({
    method: 'get',
    url: `/bot/login`,
    params,
  });
};
// 获取玩家信息
export const getUserInfo = (params) => {
  return axios({
    method: 'get',
    url: `/bot/info/json?uid=${params}`,
  });
};
/**
* @description 获取谱面信息
* @param {Number} params 谱面ID
* @return void
*/
export const getBeatmapInfo = params => {
  return axios({
    method: "get",
    url: `/bot/api/info/${params}`,
  });
};
/**
* @description 获取谱面附加信息
* @param {Object} params 谱面ID
* @return void
*/
export const getBeatmapAttributes = params => {
  return axios({
    method: "get",
    url: `/bot/attr/json?bid=${params.bid}&mods=${params.mod}&mode=${params.mode}`,
  });
};
// 获取谱面bg
export const getBeatmapBg = params => {
  return axios({
    method: "get",
    url: `/bot/api/background/${params}`,
    headers: {
      'Cache-Control': 'max-age=604800000'
    },
    responseType: 'blob',
  });
};
// 获取谱面文件
export const getBeatmapFile = params => {
  return axios({
    method: "get",
    url: `/sp/file/map/fileName/song/${params}`,
    baseURL: window.location.href,
  });
};
