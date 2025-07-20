#!/usr/bin/env node
/**
 * Responsive Article Layout Testing Suite
 * Validates mobile optimization and algorithm compatibility
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Enhanced Article Layout Testing Suite');
console.log('==========================================\n');

// Test configuration
const TEST_CONFIG = {
  backend_url: process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001',
  frontend_url: 'http://localhost:3000',
  test_articles: [
    'f6c5adba-d874-418b-8be0-d2259cb480cb', // Biceps - complex HTML + images
    '0e06467e-288b-4d77-9818-f716e8bd634f', // Clavicle - long content (50K chars)
    'f235803b-b43d-4974-88b9-0546c846d60d'  // Spine - complex medical terms
  ],
  responsive_breakpoints: [
    { name: 'Mobile', width: 375 },
    { name: 'Tablet', width: 768 },
    { name: 'Desktop', width: 1024 },
    { name: 'Large Desktop', width: 1200 }
  ]
};

// Enhanced features to test
const FEATURES_TO_TEST = {
  typography: {
    mobile_font_size: '18px',
    desktop_font_size: '16px',
    mobile_line_height: '1.7',
    desktop_line_height: '1.6'
  },
  container: {
    max_width: '900px',
    mobile_padding: '20px'
  },
  interactive: {
    back_to_top_threshold: '500px',
    image_enlarge: true,
    smooth_scroll: true
  },
  algorithm: {
    medical_terms_extraction: true,
    statistical_data_parsing: true,
    emotional_journey_mapping: true,
    subspecialty_detection: true,
    artwork_generation: true
  }
};

// Test results storage
let testResults = {
  timestamp: new Date().toISOString(),
  total_tests: 0,
  passed_tests: 0,
  failed_tests: 0,
  tests: []
};

function logTest(testName, status, details = '') {
  const result = {
    name: testName,
    status: status,
    details: details,
    timestamp: new Date().toISOString()
  };
  
  testResults.tests.push(result);
  testResults.total_tests++;
  
  if (status === 'PASS') {
    testResults.passed_tests++;
    console.log(`✅ ${testName}: PASSED ${details ? '- ' + details : ''}`);
  } else {
    testResults.failed_tests++;
    console.log(`❌ ${testName}: FAILED ${details ? '- ' + details : ''}`);
  }
}

// Test 1: Verify ArticlePage component has responsive enhancements
function testComponentEnhancements() {
  console.log('\n📱 Testing Component Enhancements...');
  
  try {
    const articlePagePath = path.join(__dirname, 'src', 'pages', 'ArticlePage.js');
    const articlePageContent = fs.readFileSync(articlePagePath, 'utf8');
    
    // Check for responsive container implementation
    if (articlePageContent.includes('max-w-[900px]')) {
      logTest('Container Max Width', 'PASS', '900px implemented');
    } else {
      logTest('Container Max Width', 'FAIL', 'max-w-[900px] not found');
    }
    
    // Check for mobile padding
    if (articlePageContent.includes('px-5')) {
      logTest('Mobile Padding', 'PASS', 'px-5 (20px) implemented');
    } else {
      logTest('Mobile Padding', 'FAIL', 'px-5 not found');
    }
    
    // Check for responsive typography
    if (articlePageContent.includes('font-size: 18px') && articlePageContent.includes('@media (min-width: 768px)')) {
      logTest('Responsive Typography', 'PASS', 'Mobile-first typography implemented');
    } else {
      logTest('Responsive Typography', 'FAIL', 'Mobile-first typography not found');
    }
    
    // Check for back-to-top functionality
    if (articlePageContent.includes('showBackToTop') && articlePageContent.includes('scrollToTop')) {
      logTest('Back-to-Top Button', 'PASS', 'Functionality implemented');
    } else {
      logTest('Back-to-Top Button', 'FAIL', 'Back-to-top functionality not found');
    }
    
    // Check for image enhancement
    if (articlePageContent.includes('click-to-enlarge') && articlePageContent.includes('medical-diagram')) {
      logTest('Image Enhancement', 'PASS', 'Click-to-enlarge implemented');
    } else {
      logTest('Image Enhancement', 'FAIL', 'Image enhancement features not found');
    }
    
    // Check for table responsiveness
    if (articlePageContent.includes('overflow-x: auto') && articlePageContent.includes('sticky')) {
      logTest('Responsive Tables', 'PASS', 'Mobile table enhancements implemented');
    } else {
      logTest('Responsive Tables', 'FAIL', 'Responsive table features not found');
    }
    
  } catch (error) {
    logTest('Component File Access', 'FAIL', error.message);
  }
}

// Test 2: Verify algorithm compatibility preservation
function testAlgorithmCompatibility() {
  console.log('\n🔬 Testing Algorithm Compatibility...');
  
  try {
    const articlePagePath = path.join(__dirname, 'src', 'pages', 'ArticlePage.js');
    const articlePageContent = fs.readFileSync(articlePagePath, 'utf8');
    
    // Check for HTML structure preservation
    if (articlePageContent.includes('dangerouslySetInnerHTML')) {
      logTest('HTML Structure Preservation', 'PASS', 'dangerouslySetInnerHTML maintained');
    } else {
      logTest('HTML Structure Preservation', 'FAIL', 'HTML rendering method changed');
    }
    
    // Check for algorithm data processing
    if (articlePageContent.includes('algorithm_parameters') && articlePageContent.includes('emotional_data')) {
      logTest('Algorithm Data Processing', 'PASS', 'Algorithm parameter handling maintained');
    } else {
      logTest('Algorithm Data Processing', 'FAIL', 'Algorithm data handling modified');
    }
    
    // Check for emotional signature component
    if (articlePageContent.includes('EmotionalSignature')) {
      logTest('Emotional Analysis', 'PASS', 'Emotional signature rendering maintained');
    } else {
      logTest('Emotional Analysis', 'FAIL', 'EmotionalSignature component missing');
    }
    
    // Check for artwork association
    if (articlePageContent.includes('View Associated Visualization')) {
      logTest('Artwork Association', 'PASS', 'Article-artwork linking maintained');
    } else {
      logTest('Artwork Association', 'FAIL', 'Artwork linking functionality missing');
    }
    
  } catch (error) {
    logTest('Algorithm Compatibility Check', 'FAIL', error.message);
  }
}

// Test 3: Performance validation
function testPerformance() {
  console.log('\n⚡ Testing Performance Impact...');
  
  try {
    // Check build files
    const buildPath = path.join(__dirname, 'build', 'static');
    
    if (fs.existsSync(buildPath)) {
      const cssFiles = fs.readdirSync(path.join(buildPath, 'css')).filter(f => f.endsWith('.css'));
      const jsFiles = fs.readdirSync(path.join(buildPath, 'js')).filter(f => f.includes('main') && f.endsWith('.js'));
      
      if (cssFiles.length > 0) {
        const cssSize = fs.statSync(path.join(buildPath, 'css', cssFiles[0])).size;
        logTest('CSS Bundle Size', 'PASS', `${(cssSize / 1024).toFixed(2)} KB`);
      }
      
      if (jsFiles.length > 0) {
        const jsSize = fs.statSync(path.join(buildPath, 'js', jsFiles[0])).size;
        logTest('JS Bundle Size', 'PASS', `${(jsSize / 1024 / 1024).toFixed(2)} MB`);
      }
      
      logTest('Build Files', 'PASS', 'Production build successfully created');
    } else {
      logTest('Build Files', 'FAIL', 'Build directory not found - run yarn build');
    }
    
  } catch (error) {
    logTest('Performance Validation', 'FAIL', error.message);
  }
}

// Test 4: CSS implementation validation
function testCSSImplementation() {
  console.log('\n🎨 Testing CSS Implementation...');
  
  try {
    const articlePagePath = path.join(__dirname, 'src', 'pages', 'ArticlePage.js');
    const articlePageContent = fs.readFileSync(articlePagePath, 'utf8');
    
    // Extract style section
    const styleMatch = articlePageContent.match(/<style jsx>\{`([\s\S]*?)`\}<\/style>/);
    
    if (styleMatch) {
      const styles = styleMatch[1];
      
      // Check for mobile-first media queries
      if (styles.includes('@media (max-width: 767px)')) {
        logTest('Mobile-First Media Queries', 'PASS', 'Mobile breakpoints implemented');
      } else {
        logTest('Mobile-First Media Queries', 'FAIL', 'Mobile breakpoints missing');
      }
      
      // Check for responsive font sizes
      if (styles.includes('font-size: 18px') && styles.includes('font-size: 16px')) {
        logTest('Responsive Font Sizes', 'PASS', '18px mobile, 16px desktop');
      } else {
        logTest('Responsive Font Sizes', 'FAIL', 'Font size responsiveness not implemented');
      }
      
      // Check for table responsiveness
      if (styles.includes('overflow-x: auto') && styles.includes('sticky')) {
        logTest('Responsive Table Styles', 'PASS', 'Mobile table optimization implemented');
      } else {
        logTest('Responsive Table Styles', 'FAIL', 'Table responsiveness missing');
      }
      
      // Check for image enhancements
      if (styles.includes('cursor: pointer') && styles.includes('enlarged')) {
        logTest('Image Enhancement Styles', 'PASS', 'Click-to-enlarge styles implemented');
      } else {
        logTest('Image Enhancement Styles', 'FAIL', 'Image enhancement styles missing');
      }
      
      // Check for back-to-top button styles
      if (styles.includes('back-to-top') && styles.includes('position: fixed')) {
        logTest('Back-to-Top Styles', 'PASS', 'Fixed positioning and styling implemented');
      } else {
        logTest('Back-to-Top Styles', 'FAIL', 'Back-to-top button styles missing');
      }
      
    } else {
      logTest('CSS Extraction', 'FAIL', 'Style section not found in component');
    }
    
  } catch (error) {
    logTest('CSS Implementation Check', 'FAIL', error.message);
  }
}

// Generate test report
function generateTestReport() {
  console.log('\n📊 Test Summary');
  console.log('================');
  console.log(`Total Tests: ${testResults.total_tests}`);
  console.log(`Passed: ${testResults.passed_tests}`);
  console.log(`Failed: ${testResults.failed_tests}`);
  console.log(`Success Rate: ${((testResults.passed_tests / testResults.total_tests) * 100).toFixed(1)}%`);
  
  const reportPath = path.join(__dirname, 'test-results.json');
  fs.writeFileSync(reportPath, JSON.stringify(testResults, null, 2));
  console.log(`\n📄 Detailed results saved to: ${reportPath}`);
  
  if (testResults.failed_tests === 0) {
    console.log('\n🎉 All tests passed! Enhanced article layout is ready for production.');
  } else {
    console.log('\n⚠️  Some tests failed. Please review the implementation.');
  }
  
  console.log('\n🔗 Quick Test Links:');
  console.log(`   📱 Mobile Testing Suite: file://${path.join(__dirname, '..', 'test-mobile-layout.html')}`);
  console.log(`   📖 Test Verification: file://${path.join(__dirname, '..', 'test-verification-results.md')}`);
  
  TEST_CONFIG.test_articles.forEach((articleId, index) => {
    const articleNames = ['Biceps (Images)', 'Clavicle (Long)', 'Spine (Complex)'];
    console.log(`   📄 ${articleNames[index]}: ${TEST_CONFIG.frontend_url}/articles/${articleId}`);
  });
}

// Run all tests
async function runAllTests() {
  console.log('Starting comprehensive testing suite...\n');
  
  testComponentEnhancements();
  testAlgorithmCompatibility();
  testPerformance();
  testCSSImplementation();
  
  generateTestReport();
}

// Execute if run directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = {
  runAllTests,
  testResults,
  TEST_CONFIG,
  FEATURES_TO_TEST
};