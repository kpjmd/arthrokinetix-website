// Enhanced Arthrokinetix HTML-to-Art Transformation Algorithm
// Version 2.0 - Organic Growth & Emotional Data Mapping
// Transforms medical research articles into abstract art inspired by Andry's splinted tree

class ArthrokinetixArtGenerator {
  constructor() {
    this.canvasWidth = 800;
    this.canvasHeight = 800;
    this.articleData = {};
    this.emotionalJourney = {};
    this.visualElements = [];
    this.subspecialty = 'sportsMedicine';
    
    // Enhanced brand colors with emotional variants
    this.brandColors = {
      primary: "#2c3e50",
      secondary: "#3498db", 
      accent: "#e74c3c",
      light: "#ecf0f1",
      dark: "#2c3e50"
    };
    
    // Emotional color palettes
    this.emotionalPalettes = {
      hope: ["#27ae60", "#2ecc71", "#58d68d", "#85e085"],
      tension: ["#e74c3c", "#c0392b", "#a93226", "#8b0000"],
      confidence: ["#3498db", "#2980b9", "#1f4e79", "#1a5490"],
      uncertainty: ["#95a5a6", "#7f8c8d", "#5d6d7e", "#484c52"],
      breakthrough: ["#f39c12", "#e67e22", "#d35400", "#cc6600"],
      healing: ["#16a085", "#1abc9c", "#48c9b0", "#76d7c4"]
    };
    
    // Andry Tree growth parameters
    this.treeParameters = {
      rootDepth: 0.7,        // How deep roots extend
      branchComplexity: 0.8, // How intricate branching gets
      healingRate: 0.6,      // Speed of healing animation
      strengthFactor: 1.0    // Overall tree health/strength
    };
  }

  // Main processing function
  processArticle(articleElement) {
    console.log("🎨 Starting Enhanced Arthrokinetix Art Generation...");
    
    // Extract and analyze article data
    this.extractArticleData(articleElement);
    
    // Analyze emotional journey through the content
    this.analyzeEmotionalJourney();
    
    // Detect medical subspecialty for visual styling
    this.detectSubspecialty();
    
    // Generate visual elements based on analysis
    this.generateVisualElements();
    
    // Apply subspecialty-specific styling
    this.applySubspecialtyStyle();
    
    // Create the final artwork
    return this.renderArtwork();
  }

  // Enhanced article data extraction
  extractArticleData(articleElement) {
    this.articleData = {
      // Basic content analysis
      wordCount: this.getWordCount(articleElement),
      paragraphCount: this.getParagraphCount(articleElement),
      headingStructure: this.analyzeHeadingStructure(articleElement),
      
      // Medical content analysis
      medicalTerms: this.extractMedicalTerms(articleElement),
      statisticalData: this.extractStatistics(articleElement),
      researchCitations: this.extractCitations(articleElement),
      
      // Content complexity analysis
      readabilityScore: this.calculateReadability(articleElement),
      technicalDensity: this.calculateTechnicalDensity(articleElement),
      
      // Evidence quality indicators
      evidenceStrength: this.assessEvidenceStrength(articleElement),
      certaintyLevel: this.assessCertaintyLevel(articleElement),
      
      // Structural analysis for visual mapping
      contentSections: this.identifyContentSections(articleElement),
      argumentFlow: this.analyzeArgumentFlow(articleElement)
    };
    
    console.log("📊 Article data extracted:", this.articleData);
  }

  // Emotional journey analysis through content
  analyzeEmotionalJourney() {
    const text = this.articleData.fullText || "";
    
    this.emotionalJourney = {
      // Problem identification (tension)
      problemIntensity: this.detectEmotionalMarkers(text, [
        'complication', 'failure', 'risk', 'challenge', 'difficult', 'controversy'
      ]) / text.length * 1000,
      
      // Solution confidence (confidence)
      solutionConfidence: this.detectEmotionalMarkers(text, [
        'effective', 'successful', 'proven', 'reliable', 'consistent', 'evidence'
      ]) / text.length * 1000,
      
      // Innovation excitement (breakthrough)
      innovationLevel: this.detectEmotionalMarkers(text, [
        'novel', 'innovative', 'breakthrough', 'advanced', 'cutting-edge', 'revolutionary'
      ]) / text.length * 1000,
      
      // Healing potential (hope)
      healingPotential: this.detectEmotionalMarkers(text, [
        'recovery', 'healing', 'improvement', 'restoration', 'rehabilitation', 'outcome'
      ]) / text.length * 1000,
      
      // Research uncertainty (uncertainty)
      uncertaintyLevel: this.detectEmotionalMarkers(text, [
        'may', 'might', 'possibly', 'unclear', 'variable', 'depends', 'further research'
      ]) / text.length * 1000
    };
    
    // Calculate dominant emotional theme
    this.emotionalJourney.dominantEmotion = this.getDominantEmotion();
    
    console.log("💭 Emotional journey mapped:", this.emotionalJourney);
  }

  // Enhanced medical term extraction
  extractMedicalTerms(articleElement) {
    const text = articleElement.textContent.toLowerCase();
    
    const medicalCategories = {
      // Surgical procedures
      procedures: {
        terms: ['tenotomy', 'tenodesis', 'arthroscopy', 'repair', 'reconstruction', 'arthroplasty'],
        weight: 1.0
      },
      
      // Anatomical structures
      anatomy: {
        terms: ['tendon', 'ligament', 'joint', 'bone', 'muscle', 'cartilage', 'meniscus'],
        weight: 0.8
      },
      
      // Clinical outcomes
      outcomes: {
        terms: ['success rate', 'complication', 'recovery', 'satisfaction', 'function'],
        weight: 1.2
      },
      
      // Research terminology
      research: {
        terms: ['study', 'trial', 'meta-analysis', 'evidence', 'randomized', 'cohort'],
        weight: 0.9
      }
    };
    
    const extractedTerms = {};
    
    for (const [category, data] of Object.entries(medicalCategories)) {
      extractedTerms[category] = {};
      
      for (const term of data.terms) {
        const regex = new RegExp(`\\b${term}\\b`, 'gi');
        const matches = text.match(regex) || [];
        
        if (matches.length > 0) {
          extractedTerms[category][term] = {
            count: matches.length,
            weight: data.weight,
            significance: matches.length * data.weight
          };
        }
      }
    }
    
    return extractedTerms;
  }

  // Statistical data extraction with context
  extractStatistics(articleElement) {
    const text = articleElement.textContent;
    const statistics = [];
    
    // Enhanced regex patterns for medical statistics
    const patterns = {
      percentages: /(\d+(?:\.\d+)?)\s*%/g,
      outcomes: /(\d+(?:\.\d+)?)\s*(?:out of|\/)\s*(\d+)/g,
      pValues: /p\s*[<>=]\s*(\d+(?:\.\d+)?)/gi,
      confidenceIntervals: /(\d+(?:\.\d+)?)\s*%?\s*ci/gi,
      followUp: /(\d+)\s*(?:months?|years?|weeks?)\s*follow-?up/gi,
      sampleSizes: /n\s*=\s*(\d+)/gi
    };
    
    for (const [type, pattern] of Object.entries(patterns)) {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        statistics.push({
          type: type,
          value: parseFloat(match[1]),
          rawText: match[0],
          context: this.getStatisticContext(text, match.index),
          significance: this.assessStatisticSignificance(type, parseFloat(match[1]))
        });
      }
    }
    
    return statistics;
  }

  // Generate visual elements based on analysis
  generateVisualElements() {
    this.visualElements = [];
    
    // 1. Generate Andry Tree root system
    this.generateAndryTreeRoots();
    
    // 2. Generate main trunk and branches
    this.generateTreeStructure();
    
    // 3. Generate healing/growth elements
    this.generateHealingElements();
    
    // 4. Generate data flow streams
    this.generateDataFlows();
    
    // 5. Generate emotional color fields
    this.generateEmotionalFields();
    
    // 6. Generate research constellation
    this.generateResearchConstellation();
    
    // 7. Generate atmospheric elements
    this.generateAtmosphericElements();
    
    console.log(`🌳 Generated ${this.visualElements.length} visual elements`);
  }

  // Generate Andry Tree root system (foundational research)
  generateAndryTreeRoots() {
    const evidenceStrength = this.articleData.evidenceStrength || 0.5;
    const rootComplexity = Math.max(3, Math.floor(evidenceStrength * 8));
    
    for (let i = 0; i < rootComplexity; i++) {
      const angle = (i / rootComplexity) * 180 + 180; // Spread roots below ground
      const length = 50 + (evidenceStrength * 100);
      const thickness = 1 + (evidenceStrength * 3);
      
      this.visualElements.push({
        type: 'andryRoot',
        x: this.canvasWidth / 2,
        y: this.canvasHeight * 0.85, // Ground level
        angle: angle,
        length: length,
        thickness: thickness,
        color: this.getEmotionalColor('confidence', 0.3),
        branches: this.generateRootBranches(angle, length * 0.7, thickness * 0.8, 2)
      });
    }
  }

  // Generate main tree structure
  generateTreeStructure() {
    const contentSections = this.articleData.contentSections || [];
    const trunkHeight = Math.min(300, contentSections.length * 40 + 100);
    
    // Main trunk (article spine)
    this.visualElements.push({
      type: 'andryTrunk',
      x: this.canvasWidth / 2,
      y: this.canvasHeight * 0.85,
      height: trunkHeight,
      thickness: 8 + (this.articleData.technicalDensity * 5),
      color: this.brandColors.primary,
      healing: this.treeParameters.healingRate
    });
    
    // Generate branches for each major content section
    contentSections.forEach((section, index) => {
      const branchY = this.canvasHeight * 0.85 - (index + 1) * (trunkHeight / contentSections.length);
      const branchSide = index % 2 === 0 ? -1 : 1; // Alternate sides
      
      this.generateBranch(
        this.canvasWidth / 2,
        branchY,
        branchSide * (30 + Math.random() * 30), // Angle
        60 + section.importance * 40, // Length based on section importance
        4 + section.complexity * 2, // Thickness
        section.emotionalTone
      );
    });
  }

  // Generate healing/growth elements
  generateHealingElements() {
    const healingPotential = this.emotionalJourney.healingPotential || 0.5;
    const numElements = Math.floor(healingPotential * 15) + 5;
    
    for (let i = 0; i < numElements; i++) {
      // Healing particles that emanate from the tree
      this.visualElements.push({
        type: 'healingParticle',
        x: this.canvasWidth / 2 + (Math.random() - 0.5) * 200,
        y: this.canvasHeight * 0.3 + Math.random() * 200,
        size: 3 + Math.random() * 8,
        color: this.getEmotionalColor('healing', 0.6),
        pulseRate: 0.5 + Math.random() * 1.5,
        growthDirection: {
          x: (Math.random() - 0.5) * 2,
          y: -Math.random() * 2 // Generally upward
        }
      });
    }
    
    // Healing aura around the tree
    this.visualElements.push({
      type: 'healingAura',
      x: this.canvasWidth / 2,
      y: this.canvasHeight * 0.6,
      radius: 100 + healingPotential * 150,
      color: this.getEmotionalColor('healing', 0.1),
      pulseAmplitude: healingPotential * 50
    });
  }

  // Generate data flow streams
  generateDataFlows() {
    const statistics = this.articleData.statisticalData || [];
    
    statistics.forEach((stat, index) => {
      const flowPath = this.generateFlowPath(stat);
      
      this.visualElements.push({
        type: 'dataFlow',
        path: flowPath,
        thickness: 1 + stat.significance * 2,
        color: this.getStatisticColor(stat),
        opacity: 0.4 + stat.significance * 0.4,
        flowSpeed: 0.5 + stat.significance,
        particleCount: Math.floor(stat.significance * 5) + 2
      });
    });
  }

  // Generate emotional color fields
  generateEmotionalFields() {
    const emotions = Object.keys(this.emotionalJourney);
    
    emotions.forEach((emotion, index) => {
      if (emotion === 'dominantEmotion') return;
      
      const intensity = this.emotionalJourney[emotion] || 0;
      if (intensity < 0.01) return; // Skip very low intensity emotions
      
      const fieldSize = 50 + intensity * 200;
      const x = this.canvasWidth * (0.2 + index * 0.15);
      const y = this.canvasHeight * (0.3 + Math.random() * 0.4);
      
      this.visualElements.push({
        type: 'emotionalField',
        emotion: emotion,
        x: x,
        y: y,
        size: fieldSize,
        intensity: intensity,
        color: this.getEmotionalColor(emotion, intensity * 0.3),
        morphSpeed: 0.2 + intensity * 0.8
      });
    });
  }

  // Generate research constellation (citations and studies)
  generateResearchConstellation() {
    const citations = this.articleData.researchCitations || [];
    const constellationCenter = {
      x: this.canvasWidth * 0.8,
      y: this.canvasHeight * 0.2
    };
    
    citations.forEach((citation, index) => {
      const angle = (index / citations.length) * 360;
      const distance = 30 + citation.importance * 80;
      
      const x = constellationCenter.x + Math.cos(angle * Math.PI / 180) * distance;
      const y = constellationCenter.y + Math.sin(angle * Math.PI / 180) * distance;
      
      this.visualElements.push({
        type: 'researchStar',
        x: x,
        y: y,
        size: 2 + citation.impact * 4,
        color: this.getEmotionalColor('confidence', 0.8),
        twinkleRate: 0.5 + citation.impact,
        connections: this.generateStarConnections(x, y, citations, index)
      });
    });
  }

  // Generate atmospheric elements
  generateAtmosphericElements() {
    // Atmospheric particles based on article complexity
    const complexity = this.articleData.technicalDensity || 0.5;
    const particleCount = Math.floor(complexity * 100) + 20;
    
    for (let i = 0; i < particleCount; i++) {
      this.visualElements.push({
        type: 'atmosphericParticle',
        x: Math.random() * this.canvasWidth,
        y: Math.random() * this.canvasHeight,
        size: 0.5 + Math.random() * 2,
        color: this.brandColors.primary,
        opacity: 0.1 + Math.random() * 0.2,
        driftSpeed: 0.1 + Math.random() * 0.5,
        driftDirection: Math.random() * 360
      });
    }
    
    // Subtle grid representing medical precision
    this.visualElements.push({
      type: 'precisionGrid',
      spacing: 30 + complexity * 20,
      opacity: 0.05 + complexity * 0.1,
      color: this.brandColors.secondary
    });
  }

  // Render the complete artwork
  renderArtwork() {
    const svg = this.createSVGElement();
    
    // Add background with subtle gradient
    this.addBackground(svg);
    
    // Render elements in layered order
    const layerOrder = [
      'precisionGrid',
      'atmosphericParticle', 
      'emotionalField',
      'healingAura',
      'andryRoot',
      'andryTrunk',
      'andryBranch',
      'dataFlow',
      'healingParticle',
      'researchStar'
    ];
    
    layerOrder.forEach(layerType => {
      const elements = this.visualElements.filter(el => el.type === layerType);
      elements.forEach(element => this.renderElement(svg, element));
    });
    
    // Add metadata for provenance
    this.addArtworkMetadata(svg);
    
    console.log("🎨 Artwork rendering complete!");
    return svg;
  }

  // Helper methods for emotional color mapping
  getEmotionalColor(emotion, intensity = 1.0) {
    const palette = this.emotionalPalettes[emotion] || this.emotionalPalettes.confidence;
    const colorIndex = Math.min(Math.floor(intensity * palette.length), palette.length - 1);
    return palette[colorIndex];
  }

  getDominantEmotion() {
    const emotions = { ...this.emotionalJourney };
    delete emotions.dominantEmotion;
    
    return Object.entries(emotions).reduce((a, b) => 
      emotions[a[0]] > emotions[b[0]] ? a : b
    )[0];
  }

  // Subspecialty detection and styling
  detectSubspecialty() {
    const text = this.articleData.fullText?.toLowerCase() || "";
    
    const subspecialtyKeywords = {
      sportsMedicine: ['sports', 'athlete', 'acl', 'meniscus', 'rotator cuff', 'return to play'],
      jointReplacement: ['arthroplasty', 'replacement', 'implant', 'prosthesis', 'bearing'],
      trauma: ['fracture', 'fixation', 'trauma', 'nonunion', 'hardware'],
      spine: ['spine', 'disc', 'vertebra', 'fusion', 'stenosis'],
      handUpperExtremity: ['hand', 'wrist', 'carpal', 'finger', 'tendon'],
      footAnkle: ['foot', 'ankle', 'plantar', 'bunion', 'arch']
    };
    
    let maxScore = 0;
    let detectedSubspecialty = 'sportsMedicine';
    
    for (const [specialty, keywords] of Object.entries(subspecialtyKeywords)) {
      const score = keywords.reduce((sum, keyword) => {
        const matches = (text.match(new RegExp(`\\b${keyword}\\b`, 'g')) || []).length;
        return sum + matches;
      }, 0);
      
      if (score > maxScore) {
        maxScore = score;
        detectedSubspecialty = specialty;
      }
    }
    
    this.subspecialty = detectedSubspecialty;
    console.log(`🏥 Detected subspecialty: ${this.subspecialty}`);
  }

  // Apply subspecialty-specific visual characteristics
  applySubspecialtyStyle() {
    const subspecialtyStyles = {
      sportsMedicine: {
        treeStyle: 'dynamic',
        branchPattern: 'flowing',
        colorEmphasis: 'energy',
        motionType: 'athletic'
      },
      jointReplacement: {
        treeStyle: 'geometric',
        branchPattern: 'structured',
        colorEmphasis: 'precision',
        motionType: 'mechanical'
      },
      trauma: {
        treeStyle: 'reinforced',
        branchPattern: 'angular',
        colorEmphasis: 'strength',
        motionType: 'stabilizing'
      },
      spine: {
        treeStyle: 'vertical',
        branchPattern: 'segmented',
        colorEmphasis: 'alignment',
        motionType: 'undulating'
      }
    };
    
    const style = subspecialtyStyles[this.subspecialty] || subspecialtyStyles.sportsMedicine;
    
    // Adjust tree parameters based on subspecialty
    this.treeParameters.branchComplexity *= this.getStyleMultiplier(style.branchPattern);
    this.treeParameters.healingRate *= this.getStyleMultiplier(style.motionType);
    
    // Adjust emotional palette weights
    this.adjustEmotionalPalettes(style.colorEmphasis);
  }

  // Export functionality for various formats
  exportArtwork(format = 'svg') {
    const artwork = this.renderArtwork();
    
    switch (format) {
      case 'svg':
        return this.exportSVG(artwork);
      case 'png':
        return this.exportPNG(artwork);
      case 'metadata':
        return this.exportMetadata();
      default:
        return artwork;
    }
  }

  // Generate comprehensive metadata for art world documentation
  generateArtworkMetadata() {
    return {
      title: this.generateArtworkTitle(),
      created: new Date().toISOString(),
      algorithm: "Arthrokinetix HTML-to-Art v2.0",
      subspecialty: this.subspecialty,
      sourceData: {
        wordCount: this.articleData.wordCount,
        technicalDensity: this.articleData.technicalDensity,
        evidenceStrength: this.articleData.evidenceStrength,
        dominantEmotion: this.emotionalJourney.dominantEmotion
      },
      visualCharacteristics: {
        colorPalette: this.getUsedColors(),
        complexity: this.calculateVisualComplexity(),
        organicElements: this.countOrganicElements(),
        dataElements: this.countDataElements()
      },
      uniqueIdentifier: this.generateUniqueID(),
      reproducible: true,
      medicalContext: this.articleData.medicalTerms
    };
  }

  // Helper methods for creating SVG elements
  createSVGElement() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', this.canvasWidth);
    svg.setAttribute('height', this.canvasHeight);
    svg.setAttribute('viewBox', `0 0 ${this.canvasWidth} ${this.canvasHeight}`);
    return svg;
  }

  addBackground(svg) {
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('width', '100%');
    rect.setAttribute('height', '100%');
    rect.setAttribute('fill', '#f8f9fa');
    svg.appendChild(rect);
  }

  renderElement(svg, element) {
    switch (element.type) {
      case 'andryTrunk':
        this.renderTrunk(svg, element);
        break;
      case 'healingParticle':
        this.renderParticle(svg, element);
        break;
      case 'emotionalField':
        this.renderField(svg, element);
        break;
      default:
        console.log(`Unknown element type: ${element.type}`);
    }
  }

  renderTrunk(svg, element) {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', element.x);
    line.setAttribute('y1', element.y);
    line.setAttribute('x2', element.x);
    line.setAttribute('y2', element.y - element.height);
    line.setAttribute('stroke', element.color);
    line.setAttribute('stroke-width', element.thickness);
    svg.appendChild(line);
  }

  renderParticle(svg, element) {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', element.x);
    circle.setAttribute('cy', element.y);
    circle.setAttribute('r', element.size);
    circle.setAttribute('fill', element.color);
    circle.setAttribute('opacity', '0.7');
    svg.appendChild(circle);
  }

  renderField(svg, element) {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', element.x);
    circle.setAttribute('cy', element.y);
    circle.setAttribute('r', element.size);
    circle.setAttribute('fill', element.color);
    circle.setAttribute('opacity', '0.3');
    svg.appendChild(circle);
  }

  addArtworkMetadata(svg) {
    const metadata = document.createElementNS('http://www.w3.org/2000/svg', 'metadata');
    metadata.textContent = JSON.stringify(this.generateArtworkMetadata());
    svg.appendChild(metadata);
  }

  generateArtworkTitle() {
    return `Arthrokinetix Art - ${this.subspecialty} - ${new Date().toISOString().split('T')[0]}`;
  }

  getUsedColors() {
    return Object.values(this.emotionalPalettes).flat();
  }

  calculateVisualComplexity() {
    return this.visualElements.length / 50;
  }

  countOrganicElements() {
    return this.visualElements.filter(el => ['andryTrunk', 'healingParticle'].includes(el.type)).length;
  }

  countDataElements() {
    return this.visualElements.filter(el => el.type === 'dataFlow').length;
  }

  generateUniqueID() {
    return `AKX-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Simple implementations of missing helper methods
  getWordCount(element) {
    return (element.textContent || '').split(/\s+/).length;
  }

  getParagraphCount(element) {
    return element.querySelectorAll('p').length;
  }

  analyzeHeadingStructure(element) {
    const headings = element.querySelectorAll('h1, h2, h3, h4, h5, h6');
    return Array.from(headings).map(h => h.tagName.toLowerCase());
  }

  calculateReadability(element) {
    const wordCount = this.getWordCount(element);
    const sentenceCount = (element.textContent || '').split(/[.!?]+/).length;
    return wordCount / Math.max(sentenceCount, 1); // Simple metric
  }

  calculateTechnicalDensity(element) {
    const text = element.textContent || '';
    const medicalTermCount = (text.match(/\b(surgery|surgical|medical|patient|treatment|therapy|diagnosis)\b/gi) || []).length;
    return Math.min(medicalTermCount / 100, 1.0);
  }

  assessEvidenceStrength(element) {
    const text = element.textContent || '';
    const evidenceTerms = (text.match(/\b(evidence|study|research|trial|meta-analysis|systematic)\b/gi) || []).length;
    return Math.min(evidenceTerms / 10, 1.0);
  }

  assessCertaintyLevel(element) {
    const text = element.textContent || '';
    const uncertaintyTerms = (text.match(/\b(may|might|possibly|unclear|uncertain|variable)\b/gi) || []).length;
    return Math.max(0, 1.0 - (uncertaintyTerms / 20));
  }

  identifyContentSections(element) {
    const sections = element.querySelectorAll('section, div.section, .content-section');
    return Array.from(sections).map((section, index) => ({
      importance: 0.5 + Math.random() * 0.5,
      complexity: 0.3 + Math.random() * 0.7,
      emotionalTone: Object.keys(this.emotionalPalettes)[index % Object.keys(this.emotionalPalettes).length]
    }));
  }

  analyzeArgumentFlow(element) {
    return ['introduction', 'methodology', 'results', 'discussion', 'conclusion'];
  }

  detectEmotionalMarkers(text, markers) {
    return markers.reduce((count, marker) => {
      const regex = new RegExp(`\\b${marker}\\b`, 'gi');
      return count + (text.match(regex) || []).length;
    }, 0);
  }

  generateRootBranches(angle, length, thickness, depth) {
    if (depth <= 0) return [];
    return [{
      angle: angle + (Math.random() - 0.5) * 30,
      length: length * 0.7,
      thickness: thickness * 0.8
    }];
  }

  generateBranch(x, y, angle, length, thickness, emotionalTone) {
    this.visualElements.push({
      type: 'andryBranch',
      x: x,
      y: y,
      angle: angle,
      length: length,
      thickness: thickness,
      color: this.getEmotionalColor(emotionalTone || 'confidence', 0.7)
    });
  }

  generateFlowPath(stat) {
    return [[100, 100], [200, 150], [300, 120]]; // Simple path
  }

  getStatisticColor(stat) {
    return this.brandColors.secondary;
  }

  generateStarConnections(x, y, citations, index) {
    return []; // Simple implementation
  }

  getStyleMultiplier(style) {
    const multipliers = {
      'dynamic': 1.2,
      'flowing': 1.1,
      'geometric': 0.9,
      'structured': 0.8,
      'reinforced': 1.3,
      'angular': 1.0,
      'vertical': 1.0,
      'segmented': 0.9
    };
    return multipliers[style] || 1.0;
  }

  adjustEmotionalPalettes(emphasis) {
    // Simple implementation - could be expanded
    console.log(`Adjusting palette for ${emphasis}`);
  }

  exportSVG(artwork) {
    return new XMLSerializer().serializeToString(artwork);
  }

  exportPNG(artwork) {
    // Would require canvas conversion - simplified for now
    return null;
  }

  exportMetadata() {
    return this.generateArtworkMetadata();
  }
}

// Usage example and initialization
function initializeArthrokinetixArt() {
  const generator = new ArthrokinetixArtGenerator();
  
  // Find article content
  const articleElement = document.querySelector('article') || 
                        document.querySelector('.post-content') || 
                        document.querySelector('.entry-content');
  
  if (articleElement) {
    console.log("🎨 Arthrokinetix Art Generator initialized");
    
    // Process article and generate art
    const artwork = generator.processArticle(articleElement);
    
    // Insert artwork into page
    const container = document.createElement('div');
    container.id = 'arthrokinetix-artwork';
    container.style.cssText = `
      width: 800px;
      height: 800px;
      margin: 40px auto;
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      overflow: hidden;
    `;
    
    container.appendChild(artwork);
    
    // Insert after header or at beginning of article
    const insertPoint = document.querySelector('header') || articleElement;
    insertPoint.parentNode.insertBefore(container, insertPoint.nextSibling);
    
    // Add export functionality
    // addExportControls(generator); // Commented out for web app use
    
    return generator;
  } else {
    console.warn("⚠️ No article content found for art generation");
    return null;
  }
}

// Initialize when DOM is ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeArthrokinetixArt);
  } else {
    initializeArthrokinetixArt();
  }
}

// Export for use in other contexts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ArthrokinetixArtGenerator;
}