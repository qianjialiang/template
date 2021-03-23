import request from '@/utils/request'

// 区域
export function fRegionList(data) {
  return request({
    url: '/common/region/list',
    method: 'post',
    data
  })
}

export function fRegionGet(regionId) {
  return request({
    url: '/account/manage/login.json',
    method: 'post',
    data: {
      regionId
    }
  })
}
