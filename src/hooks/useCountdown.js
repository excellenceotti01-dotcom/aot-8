import { useEffect, useState } from 'react'

function getRemainingTime(targetDate) {
  const difference = Math.max(new Date(targetDate).getTime() - Date.now(), 0)
  const totalSeconds = Math.floor(difference / 1000)

  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  }
}

export function useCountdown(targetDate) {
  const [remainingTime, setRemainingTime] = useState(() => getRemainingTime(targetDate))

  useEffect(() => {
    const updateCountdown = () => setRemainingTime(getRemainingTime(targetDate))
    updateCountdown()
    const intervalId = window.setInterval(updateCountdown, 1000)
    return () => window.clearInterval(intervalId)
  }, [targetDate])

  return remainingTime
}
