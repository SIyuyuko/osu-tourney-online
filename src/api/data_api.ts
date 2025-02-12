/*
 * @Author: SIyuyuko 3228981717@qq.com
 * @Date: 2024-10-10 22:34:35
 * @LastEditors: SIyuyuko 3228981717@qq.com
 * @LastEditTime: 2024-10-12 22:32:51
 * @FilePath: \osu-tourney-online\src\api\data_api.js
 */
import axios from '../http/axios.js';

// 登录获取授权链接
const getOauthUrl = () => {
  return axios({
    method: 'get',
    url: '/sp/public/getOauthUrl',
    baseURL: window.location.href,
  });
};

/** token登陆 */
const login = (params: string) => {
  return axios({
    method: 'get',
    url: `/api/user/login?code=${params}`,
  });
};

// 创建图池
const addPool = () => {
  return axios({
    method: 'put',
    url: '/api/map/createPool',
  });
};

// 生成比赛图池
const getMappool = (params) => {
  return axios({
    method: 'post',
    url: `/pool?name=${params.name}`,
    data: params.data,
    responseType: 'blob',
  });
};
// 投骰子
const getDice = (params) => {
  return axios({
    method: 'get',
    url: `/dice`,
    params,
  });
};
// 玩家登录
const getLogin = (params) => {
  return axios({
    method: 'get',
    url: `/bot/login`,
    params,
  });
};
// 获取玩家信息
const getUserInfo = (params) => {
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
const getBeatmapInfo = (params) => {
  return axios({
    method: 'get',
    url: `/bot/api/info/${params}`,
  });
};
/**
 * @description 获取谱面附加信息
 * @param {Object} params 谱面ID
 * @return void
 */
const getBeatmapAttributes = (params) => {
  return axios({
    method: 'get',
    url: `/bot/attr/json?bid=${params.bid}&mods=${params.mod}&mode=${params.mode}`,
  });
};
// 获取谱面bg
const getBeatmapBg = (params) => {
  return axios({
    method: 'get',
    url: `/bot/api/background/${params}`,
    headers: {
      'Cache-Control': 'max-age=604800000',
    },
    responseType: 'blob',
  });
};
// 获取谱面文件
const getBeatmapFile = (params) => {
  return axios({
    method: 'get',
    url: `/sp/file/map/fileName/song/${params}`,
    baseURL: window.location.href,
  });
};

export {
  getOauthUrl,
  login,

  // pool
  addPool,
  getMappool,
  getDice,
  getLogin,
  getUserInfo,

  // beatmap
  getBeatmapInfo,
  getBeatmapAttributes,
  getBeatmapBg,
  getBeatmapFile,
};
