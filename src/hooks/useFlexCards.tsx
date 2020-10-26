import { useEffect, useState } from "react";
import { throttle } from 'lodash'

/**
 * 连接 flex 布局
 */
interface useFlexCardsProps {
  count: number;
  minWidth: number;
  containRef: any;
}

function useFlexCards(props: useFlexCardsProps) {
  const {count, minWidth, containRef} = props

  const [patchNumber, setPatchNumber] = useState<number>(0)

  const changeNumber = throttle(() => {
    console.log(containRef.current)
    if (!containRef.current) {
      return
    }
    const width: number = parseInt(window.getComputedStyle(containRef.current, null).width)
    const lineCount = Math.floor(width / minWidth)
    const overLineCount = count % lineCount
    setPatchNumber(overLineCount ? lineCount - overLineCount : 0)
  }, 250, {
    leading: true
  })

  useEffect(() => {
    if (!containRef.current) {
      return
    }
    changeNumber()
  }, [containRef.current])

  window.addEventListener('resize', changeNumber)

  return patchNumber
}

export default useFlexCards