/* ========== ① 多CDN备用加载器 ==========
 * 每个参数是一组备选地址（数组），组内按顺序尝试，一个成功即止
 * 所有组都成功才 resolve，任一组全失败则 reject
 * 用法：loadCDN(['jsdelivr的vue','unpkg的vue'], ['jsdelivr的babel','unpkg的babel'])
 */
function loadCDN(...urlGroups) {
  const tryLoad = (url) => new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.onload = () => resolve(url)
    s.onerror = () => { s.remove(); reject(new Error('CDN 加载失败: ' + url)) }
    s.src = url
    document.head.appendChild(s)
  })
  // 组内依次降级：前一个失败才尝试下一个
  const tryGroup = (urls) =>
    urls.reduce((p, url) => p.catch(() => tryLoad(url)), Promise.reject())

  return Promise.all(urlGroups.map(tryGroup))
}

/* ========== ② JSX → Vue 渲染器 ==========
 * 把 JSX 源码编译成 Vue h 函数调用并执行
 * source: JSX 源码字符串；h: 渲染函数，默认 Vue.h
 * 返回执行结果（通常是 createApp 的返回）
 */
function runVueJsx(source, h = Vue.h) {
  window.h = h // Babel 编译产物中的 h 引用
  const { code } = Babel.transform(source, {
    presets: [['react', { runtime: 'classic', pragma: 'h' }]],
    filename: 'app.jsx',
  })
  return new Function(code)()
}