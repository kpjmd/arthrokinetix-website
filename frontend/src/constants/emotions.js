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
 * Backend to frontend emotion mapping for backwards compatibility
 * Maps raw backend terms to user-friendly terms
 */
const backendToFrontendMapping = {
  'problemIntensity': 'tension',
  'ProblemIntensity': 'tension',
  'solutionConfidence': 'confidence', 
  'SolutionConfidence': 'confidence',
  'healingPotential': 'healing',
  'HealingPotential': 'healing', 
  'innovationLevel': 'breakthrough',
  'InnovationLevel': 'breakthrough',
  'uncertaintyLevel': 'uncertainty',
  'UncertaintyLevel': 'uncertainty'
};

/**
 * Normalize emotion key to handle backend terms
 * @param {string} key - The emotion key (could be backend or frontend term)
 * @returns {string} The normalized frontend emotion key
 */
export const normalizeEmotionKey = (key) => {
  if (!key) return 'confidence';
  return backendToFrontendMapping[key] || key;
};

/**
 * Get emotion configuration by key
 * @param {string} key - The emotion key
 * @returns {Object|undefined} The emotion configuration object
 */
export const getEmotionByKey = (key) => {
  const normalizedKey = normalizeEmotionKey(key);
  return emotionOptions.find(emotion => emotion.key === normalizedKey);
};

/**
 * Get emotion color by key
 * @param {string} key - The emotion key (handles both backend and frontend terms)
 * @returns {string} The emotion color or default gray
 */
export const getEmotionColor = (key) => {
  const emotion = getEmotionByKey(key);
  return emotion ? emotion.color : '#95a5a6';
};

/**
 * Get emotion icon by key
 * @param {string} key - The emotion key (handles both backend and frontend terms) 
 * @returns {string} The emotion icon or default question mark
 */
export const getEmotionIcon = (key) => {
  const emotion = getEmotionByKey(key);
  return emotion ? emotion.icon : '❓';
};

/**
 * Get emotion label by key
 * @param {string} key - The emotion key (handles both backend and frontend terms)
 * @returns {string} The emotion label or normalized key
 */
export const getEmotionLabel = (key) => {
  const emotion = getEmotionByKey(key);
  return emotion ? emotion.label : normalizeEmotionKey(key);
};

/**
 * Get emotion description by key
 * @param {string} key - The emotion key (handles both backend and frontend terms)
 * @returns {string} The emotion description or default message
 */
export const getEmotionDescription = (key) => {
  const emotion = getEmotionByKey(key);
  return emotion ? emotion.description : 'Algorithm-detected emotion';
};

export default emotionOptions;
export { backendToFrontendMapping };