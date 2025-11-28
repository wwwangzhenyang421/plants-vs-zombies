import { useState, useEffect } from 'react'

const useImage = (url) => {
  const [image, setImage] = useState(null)
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    if (!url) {
      setStatus('failed')
      return
    }

    const img = new window.Image()
    img.crossOrigin = 'anonymous'
    img.src = url
    
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

