/*
   功能：保存cookies函数 
   参数：value值
*/
export function setCookie(name: string, value: string) {
  var Days = 1; //cookie 将被保存一天
  var exp = new Date(); //获得当前时间
  exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000); //换成毫秒
  document.cookie = name + '=' + value + ';expires=' + exp.toUTCString();
}

/*
功能：获取cookies函数 
参数：name，cookie名字
*/
export function getCookie(name: string) {
  var value = name + '=';
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i].trim();
    if (c.indexOf(value) == 0) {
      return c.substring(value.length, c.length);
    }
  }
  return '';
}

/*
  功能：删除cookies函数 
  参数：name，cookie名字
*/
export function removeCookie(name: string) {
  const domain = typeof window !== 'undefined' ? window.location.hostname : '';
  var oDate = new Date();
  oDate.setDate(oDate.getDate() - 1); //访问页面的前一天
  var token = getCookie(name);
  if (token != null)
    document.cookie =
      name + '=' + token + ';expires=' + oDate.toUTCString() + `path=/; domain=${domain};`;
}
