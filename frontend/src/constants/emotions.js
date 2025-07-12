/**
 * Shared emotion configuration used across the application
 * Defines the six core emotions tracked by the Arthrokinetix algorithm
 */

export const emotionOptions = [
  { 
    key: 'hope', 
    label: 'Hope', 
    icon: '🌱', 
    color: '#27ae60',
    description: 'This content gives me hope for medical advancement'
  },
  { 
    key: 'confidence', 
    label: 'Confidence', 
    icon: '💪', 
    color: '#3498db',
    description: 'I feel confident about these medical findings'
  },
  { 
    key: 'breakthrough', 
    label: 'Breakthrough', 
    icon: '⚡', 
    color: '#f39c12',
    description: 'This feels like a significant medical breakthrough'
  },
  { 
    key: 'healing', 
    label: 'Healing', 
    icon: '💚', 
    color: '#16a085',
    description: 'This content emphasizes healing and recovery'
  },
  { 
    key: 'tension', 
    label: 'Tension', 
    icon: '⚠️', 
    color: '#e74c3c',
    description: 'I sense complexity or challenges in this content'
  },
  { 
    key: 'uncertainty', 
    label: 'Uncertainty', 
    icon: '❓', 
    color: '#95a5a6',
    description: 'This content raises questions that need more research'
  }
];

/**
 * Get emotion configuration by key
 * @param {string} key - The emotion key
 * @returns {Object|undefined} The emotion configuration object
 */
export const getEmotionByKey = (key) => {
  return emotionOptions.find(emotion => emotion.key === key);
};

/**
 * Get emotion color by key
 * @param {string} key - The emotion key
 * @returns {string} The emotion color or default gray
 */
export const getEmotionColor = (key) => {
  const emotion = getEmotionByKey(key);
  return emotion ? emotion.color : '#95a5a6';
};

/**
 * Get emotion icon by key
 * @param {string} key - The emotion key
 * @returns {string} The emotion icon or default question mark
 */
export const getEmotionIcon = (key) => {
  const emotion = getEmotionByKey(key);
  return emotion ? emotion.icon : '❓';
};

export default emotionOptions;