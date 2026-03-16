import { getStartGuidance, getMotivationalGuidance, getAchievementGuidance } from '../guidance'

describe('Guidance System', () => {
  describe('getStartGuidance', () => {
    it('should return guidance for learning category', () => {
      const guidance = getStartGuidance('学习', 1)
      expect(guidance).toBeTruthy()
      expect(typeof guidance).toBe('string')
    })

    it('should return guidance for fitness category', () => {
      const guidance = getStartGuidance('健身', 5)
      expect(guidance).toBeTruthy()
      expect(typeof guidance).toBe('string')
    })

    it('should return guidance for different streaks', () => {
      const guidance1 = getStartGuidance('通用', 1)
      const guidance7 = getStartGuidance('通用', 7)
      const guidance30 = getStartGuidance('通用', 30)

      expect(guidance1).toBeTruthy()
      expect(guidance7).toBeTruthy()
      expect(guidance30).toBeTruthy()
      expect(typeof guidance1).toBe('string')
      expect(typeof guidance7).toBe('string')
      expect(typeof guidance30).toBe('string')
    })

    it('should return motivational messages for longer streaks', () => {
      const guidance = getStartGuidance('通用', 100)
      expect(guidance).toBeTruthy()
      expect(typeof guidance).toBe('string')
    })
  })

  describe('getMotivationalGuidance', () => {
    it('should return motivational message', () => {
      const guidance = getMotivationalGuidance('学习', 5)
      expect(guidance).toBeTruthy()
      expect(typeof guidance).toBe('string')
    })

    it('should include streak information when applicable', () => {
      const guidance = getMotivationalGuidance('通用', 10)
      expect(guidance).toBeTruthy()
      expect(typeof guidance).toBe('string')
      expect(guidance.length).toBeGreaterThan(0)
    })
  })

  describe('getAchievementGuidance', () => {
    it('should return achievement message', () => {
      const guidance = getAchievementGuidance('健身')
      expect(guidance).toBeTruthy()
      expect(typeof guidance).toBe('string')
    })

    it('should provide positive reinforcement', () => {
      const guidance = getAchievementGuidance('写作')
      expect(guidance).toBeTruthy()
      expect(guidance.length).toBeGreaterThan(0)
    })
  })
})
