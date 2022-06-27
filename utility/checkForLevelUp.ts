
const checkForLevelUp = (currentXp: number, points: number, condition: number) => {

  if (!currentXp || !points || !condition) {
    return 0
  }
  // reference level
  const currentLevel = Math.floor(Number(currentXp) / Number(condition))

  const diff = Math.floor((Number(currentXp) + Number(points)) / condition)

  if (diff > currentLevel) {
    return diff - currentLevel
  }
  else if (diff <= currentLevel) {
    return 0
  }

}

export default checkForLevelUp;