import { useState, useEffect } from 'react'

const useImage = (url) => {
  const [image, setImage] = useState(null)
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    if (!url) {
      setStatus('failed')
      return
    }

    // 自动添加 base URL（用于 GitHub Pages 部署）
    // import.meta.env.BASE_URL 在开发环境是 '/'，在生产环境是 '/plants-vs-zombies/'
    const baseUrl = import.meta.env.BASE_URL || '/'
    // 如果 URL 以 / 开头，需要加上 base URL（去掉开头的 /，然后加上 base）
    // 例如：'/images/applied/xxx' -> '/plants-vs-zombies/images/applied/xxx'
    const fullUrl = url.startsWith('/') 
      ? baseUrl + url.slice(1)  // 去掉开头的 /，然后加上 base
      : url

    const img = new window.Image()
    img.crossOrigin = 'anonymous'
    img.src = fullUrl
    
    img.onload = () => {
      setImage(img)
      setStatus('loaded')
    }
    
    img.onerror = () => {
      setStatus('failed')
      setImage(null)
    }

    return () => {
      img.onload = null
      img.onerror = null
    }
  }, [url])

  return [image, status]
}

export default useImage

