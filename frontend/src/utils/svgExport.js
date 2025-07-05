// svgExport.js - SVG export utilities with comprehensive metadata embedding
// Part of Arthrokinetix Phase 2C Advanced Analytics Dashboard foundation

/**
 * Generate downloadable SVG with embedded comprehensive metadata
 * @param {Element} svgElement - SVG DOM element to export
 * @param {Object} metadata - Comprehensive metadata object
 * @param {Object} artworkInfo - Basic artwork information
 * @returns {string} Complete SVG string with embedded metadata
 */
export const generateDownloadableSVG = (svgElement, metadata, artworkInfo = {}) => {
  if (!svgElement) {
    console.error('SVG element is required for export');
    return null;
  }
  
  try {
    // Clone the SVG element to avoid modifying the original
    const clonedSvg = svgElement.cloneNode(true);
    
    // Ensure SVG has proper attributes
    clonedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    clonedSvg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
    clonedSvg.setAttribute('xmlns:rdf', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#');
    clonedSvg.setAttribute('xmlns:dc', 'http://purl.org/dc/elements/1.1/');
    clonedSvg.setAttribute('xmlns:arthrokinetix', 'https://arthrokinetix.com/metadata');
    
    // Create comprehensive metadata element
    const metadataElement = createMetadataElement(metadata, artworkInfo);
    
    // Insert metadata as the first child of SVG
    clonedSvg.insertBefore(metadataElement, clonedSvg.firstChild);
    
    // Serialize the SVG to string
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(clonedSvg);
    
    // Add XML declaration and make it a complete standalone SVG
    const xmlDeclaration = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
    const completeSvg = `${xmlDeclaration}\n${svgString}`;
    
    console.log('✅ SVG generated with comprehensive metadata');
    return completeSvg;
    
  } catch (error) {
    console.error('Error generating downloadable SVG:', error);
    return null;
  }
};

/**
 * Download SVG file with proper filename and metadata
 * @param {string} svgString - Complete SVG string
 * @param {string} filename - Desired filename (optional)
 * @param {Object} metadata - Metadata for filename generation
 */
export const downloadSVG = (svgString, filename = null, metadata = {}) => {
  if (!svgString) {
    console.error('SVG string is required for download');
    return false;
  }
  
  try {
    // Generate filename if not provided
    const downloadFilename = filename || generateArtworkFilename(metadata);
    
    // Create blob with proper MIME type
    const blob = new Blob([svgString], { 
      type: 'image/svg+xml;charset=utf-8' 
    });
    
    // Create download URL
    const url = URL.createObjectURL(blob);
    
    // Create and trigger download link
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = downloadFilename;
    downloadLink.style.display = 'none';
    
    // Add to DOM, click, and remove
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    // Clean up the URL
    URL.revokeObjectURL(url);
    
    console.log(`✅ SVG downloaded as: ${downloadFilename}`);
    return true;
    
  } catch (error) {
    console.error('Error downloading SVG:', error);
    return false;
  }
};

/**
 * Generate descriptive filename for artwork SVG
 * @param {Object} metadata - Artwork metadata
 * @returns {string} Generated filename
 */
export const generateArtworkFilename = (metadata) => {
  const timestamp = new Date();
  const dateStr = timestamp.toISOString().split('T')[0]; // YYYY-MM-DD format
  
  // Extract key information for filename
  const signatureId = metadata.signature_id || 
                     metadata.generation_parameters?.signature_id ||
                     metadata.ai_analysis_data?.pattern_fingerprint?.substr(0, 8) ||
                     'AKX';
                     
  const subspecialty = metadata.subspecialty ||
                      metadata.generation_parameters?.subspecialty_input ||
                      'unknown';
                      
  const dominantEmotion = metadata.dominant_emotion ||
                         metadata.generation_parameters?.dominant_emotion ||
                         'unknown';
  
  // Create clean filename components
  const cleanSignatureId = signatureId.replace(/[^a-zA-Z0-9-]/g, '');
  const cleanSubspecialty = subspecialty.replace(/[^a-zA-Z0-9]/g, '');
  const cleanEmotion = dominantEmotion.replace(/[^a-zA-Z0-9]/g, '');
  
  // Construct filename: SignatureID_Date_Subspecialty_Emotion_arthrokinetix.svg
  return `${cleanSignatureId}_${dateStr}_${cleanSubspecialty}_${cleanEmotion}_arthrokinetix.svg`;
};

/**
 * Create comprehensive metadata element for SVG embedding
 * @param {Object} metadata - Comprehensive metadata object
 * @param {Object} artworkInfo - Basic artwork information
 * @returns {Element} Metadata DOM element
 */
const createMetadataElement = (metadata, artworkInfo) => {
  const doc = document.implementation.createDocument(null, null, null);
  const metadataElement = doc.createElementNS('http://www.w3.org/2000/svg', 'metadata');
  
  // Create RDF container
  const rdfElement = doc.createElementNS('http://www.w3.org/1999/02/22-rdf-syntax-ns#', 'rdf:RDF');
  const descriptionElement = doc.createElementNS('http://www.w3.org/1999/02/22-rdf-syntax-ns#', 'rdf:Description');
  descriptionElement.setAttribute('rdf:about', '');
  
  // Add Dublin Core metadata
  addDublinCoreMetadata(doc, descriptionElement, metadata, artworkInfo);
  
  // Add comprehensive Arthrokinetix metadata
  addArthrokinetixMetadata(doc, descriptionElement, metadata);
  
  // Build the metadata structure
  rdfElement.appendChild(descriptionElement);
  metadataElement.appendChild(rdfElement);
  
  return metadataElement;
};

/**
 * Add Dublin Core metadata elements
 * @param {Document} doc - XML document
 * @param {Element} descriptionElement - RDF description element
 * @param {Object} metadata - Metadata object
 * @param {Object} artworkInfo - Artwork information
 */
const addDublinCoreMetadata = (doc, descriptionElement, metadata, artworkInfo) => {
  const dcNamespace = 'http://purl.org/dc/elements/1.1/';
  
  // Title
  const titleElement = doc.createElementNS(dcNamespace, 'dc:title');
  const title = artworkInfo.title || 
               `Arthrokinetix Artwork - ${metadata.signature_id || 'Generated'}`;
  titleElement.textContent = title;
  descriptionElement.appendChild(titleElement);
  
  // Creator
  const creatorElement = doc.createElementNS(dcNamespace, 'dc:creator');
  const algorithmVersion = metadata.generation_parameters?.algorithm_version || '2.0';
  creatorElement.textContent = `Arthrokinetix Algorithm v${algorithmVersion}`;
  descriptionElement.appendChild(creatorElement);
  
  // Date
  const dateElement = doc.createElementNS(dcNamespace, 'dc:date');
  const creationDate = metadata.generation_parameters?.generation_timestamp ||
                      artworkInfo.created_date ||
                      new Date().toISOString();
  dateElement.textContent = creationDate;
  descriptionElement.appendChild(dateElement);
  
  // Subject/Keywords
  const subjectElement = doc.createElementNS(dcNamespace, 'dc:subject');
  const keywords = [
    'Arthrokinetix',
    'Algorithmic Art',
    'Medical Research Visualization',
    metadata.generation_parameters?.subspecialty_input || 'Medical',
    metadata.generation_parameters?.dominant_emotion || 'Emotional'
  ].join(', ');
  subjectElement.textContent = keywords;
  descriptionElement.appendChild(subjectElement);
  
  // Description
  const descElement = doc.createElementNS(dcNamespace, 'dc:description');
  const description = generateArtworkDescription(metadata, artworkInfo);
  descElement.textContent = description;
  descriptionElement.appendChild(descElement);
  
  // Type
  const typeElement = doc.createElementNS(dcNamespace, 'dc:type');
  typeElement.textContent = 'Algorithmic Artwork';
  descriptionElement.appendChild(typeElement);
  
  // Format
  const formatElement = doc.createElementNS(dcNamespace, 'dc:format');
  formatElement.textContent = 'image/svg+xml';
  descriptionElement.appendChild(formatElement);
  
  // Rights
  const rightsElement = doc.createElementNS(dcNamespace, 'dc:rights');
  rightsElement.textContent = 'Generated by Arthrokinetix Platform - Educational and Research Use';
  descriptionElement.appendChild(rightsElement);
};

/**
 * Add comprehensive Arthrokinetix-specific metadata
 * @param {Document} doc - XML document
 * @param {Element} descriptionElement - RDF description element
 * @param {Object} metadata - Comprehensive metadata object
 */
const addArthrokinetixMetadata = (doc, descriptionElement, metadata) => {
  const akxNamespace = 'https://arthrokinetix.com/metadata';
  
  // Visual Characteristics
  if (metadata.visual_characteristics) {
    const visualElement = doc.createElementNS(akxNamespace, 'arthrokinetix:visual_characteristics');
    visualElement.textContent = JSON.stringify(metadata.visual_characteristics, null, 2);
    descriptionElement.appendChild(visualElement);
  }
  
  // Generation Parameters
  if (metadata.generation_parameters) {
    const generationElement = doc.createElementNS(akxNamespace, 'arthrokinetix:generation_parameters');
    generationElement.textContent = JSON.stringify(metadata.generation_parameters, null, 2);
    descriptionElement.appendChild(generationElement);
  }
  
  // Pattern Usage
  if (metadata.pattern_usage) {
    const patternElement = doc.createElementNS(akxNamespace, 'arthrokinetix:pattern_usage');
    patternElement.textContent = JSON.stringify(metadata.pattern_usage, null, 2);
    descriptionElement.appendChild(patternElement);
  }
  
  // AI Analysis Data
  if (metadata.ai_analysis_data) {
    const aiElement = doc.createElementNS(akxNamespace, 'arthrokinetix:ai_analysis_data');
    aiElement.textContent = JSON.stringify(metadata.ai_analysis_data, null, 2);
    descriptionElement.appendChild(aiElement);
  }
  
  // Canvas Information
  const canvasElement = doc.createElementNS(akxNamespace, 'arthrokinetix:canvas_info');
  const canvasInfo = {
    width: metadata.canvas_dimensions?.width || 800,
    height: metadata.canvas_dimensions?.height || 800,
    element_count: metadata.visual_element_count || 0,
    rendering_complexity: metadata.rendering_complexity || 0
  };
  canvasElement.textContent = JSON.stringify(canvasInfo, null, 2);
  descriptionElement.appendChild(canvasElement);
  
  // Version Information
  const versionElement = doc.createElementNS(akxNamespace, 'arthrokinetix:version_info');
  const versionInfo = {
    metadata_version: '1.0',
    platform_phase: 'Phase 2C',
    export_timestamp: new Date().toISOString(),
    export_source: 'frontend_svg_export'
  };
  versionElement.textContent = JSON.stringify(versionInfo, null, 2);
  descriptionElement.appendChild(versionElement);
};

/**
 * Generate descriptive text for the artwork
 * @param {Object} metadata - Metadata object
 * @param {Object} artworkInfo - Artwork information
 * @returns {string} Generated description
 */
const generateArtworkDescription = (metadata, artworkInfo) => {
  const subspecialty = metadata.generation_parameters?.subspecialty_input || 'medical';
  const dominantEmotion = metadata.generation_parameters?.dominant_emotion || 'confidence';
  const complexity = metadata.visual_characteristics?.pattern_complexity || 0.5;
  const elementCount = metadata.visual_element_count || 0;
  
  const complexityText = complexity > 0.7 ? 'highly complex' : 
                        complexity > 0.4 ? 'moderately complex' : 'simple';
  
  const description = `Algorithmic artwork generated from ${subspecialty} medical research content. ` +
                     `The piece expresses ${dominantEmotion} as the dominant emotional theme through ` +
                     `a ${complexityText} composition featuring ${elementCount} visual elements. ` +
                     `Generated using the Arthrokinetix algorithm that analyzes medical literature ` +
                     `for emotional undertones and transforms them into unique "Andry Tree" visualizations.`;
  
  return description;
};

/**
 * Validate SVG string for completeness and metadata
 * @param {string} svgString - SVG string to validate
 * @returns {Object} Validation results
 */
export const validateSVGExport = (svgString) => {
  if (!svgString) {
    return {
      valid: false,
      error: 'SVG string is empty or null',
      metadata_present: false
    };
  }
  
  try {
    // Check for basic SVG structure
    const hasSVGTag = svgString.includes('<svg');
    const hasClosingTag = svgString.includes('</svg>');
    const hasXMLDeclaration = svgString.includes('<?xml');
    const hasMetadata = svgString.includes('<metadata');
    const hasArthrokinetixMetadata = svgString.includes('arthrokinetix:');
    
    // Check file size (rough estimate)
    const fileSizeKB = new Blob([svgString]).size / 1024;
    
    const validation = {
      valid: hasSVGTag && hasClosingTag,
      has_xml_declaration: hasXMLDeclaration,
      has_metadata: hasMetadata,
      has_arthrokinetix_metadata: hasArthrokinetixMetadata,
      estimated_file_size_kb: Math.round(fileSizeKB * 100) / 100,
      content_length: svgString.length,
      metadata_completeness: hasArthrokinetixMetadata ? 'comprehensive' : hasMetadata ? 'basic' : 'none'
    };
    
    if (!validation.valid) {
      validation.error = 'Invalid SVG structure';
    }
    
    return validation;
    
  } catch (error) {
    return {
      valid: false,
      error: `Validation error: ${error.message}`,
      metadata_present: false
    };
  }
};

/**
 * Extract metadata from SVG string (for reverse operations)
 * @param {string} svgString - SVG string containing metadata
 * @returns {Object} Extracted metadata object
 */
export const extractMetadataFromSVG = (svgString) => {
  if (!svgString) return null;
  
  try {
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgString, 'image/svg+xml');
    
    // Check for parser errors
    const parseError = svgDoc.querySelector('parsererror');
    if (parseError) {
      console.error('SVG parsing error:', parseError.textContent);
      return null;
    }
    
    const metadata = {};
    
    // Extract Arthrokinetix metadata
    const akxElements = svgDoc.querySelectorAll('[*|*^="arthrokinetix:"]');
    akxElements.forEach(element => {
      const localName = element.localName;
      if (localName && element.textContent) {
        try {
          metadata[localName] = JSON.parse(element.textContent);
        } catch (e) {
          metadata[localName] = element.textContent;
        }
      }
    });
    
    // Extract Dublin Core metadata
    const dcElements = svgDoc.querySelectorAll('[*|*^="dc:"]');
    const dublinCore = {};
    dcElements.forEach(element => {
      const localName = element.localName;
      if (localName && element.textContent) {
        dublinCore[localName] = element.textContent;
      }
    });
    
    if (Object.keys(dublinCore).length > 0) {
      metadata.dublin_core = dublinCore;
    }
    
    return Object.keys(metadata).length > 0 ? metadata : null;
    
  } catch (error) {
    console.error('Error extracting metadata from SVG:', error);
    return null;
  }
};

/**
 * Create a preview/thumbnail version of the SVG
 * @param {string} svgString - Original SVG string
 * @param {number} maxSize - Maximum width/height for thumbnail
 * @returns {string} Thumbnail SVG string
 */
export const createSVGThumbnail = (svgString, maxSize = 200) => {
  if (!svgString) return null;
  
  try {
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgString, 'image/svg+xml');
    const svgElement = svgDoc.querySelector('svg');
    
    if (!svgElement) return null;
    
    // Get original dimensions
    const originalWidth = parseFloat(svgElement.getAttribute('width')) || 800;
    const originalHeight = parseFloat(svgElement.getAttribute('height')) || 800;
    
    // Calculate new dimensions maintaining aspect ratio
    const aspectRatio = originalWidth / originalHeight;
    let newWidth, newHeight;
    
    if (aspectRatio > 1) {
      newWidth = maxSize;
      newHeight = maxSize / aspectRatio;
    } else {
      newHeight = maxSize;
      newWidth = maxSize * aspectRatio;
    }
    
    // Update SVG dimensions
    svgElement.setAttribute('width', newWidth.toString());
    svgElement.setAttribute('height', newHeight.toString());
    
    // Remove metadata to reduce size
    const metadataElements = svgElement.querySelectorAll('metadata');
    metadataElements.forEach(el => el.remove());
    
    // Serialize thumbnail
    const serializer = new XMLSerializer();
    return serializer.serializeToString(svgElement);
    
  } catch (error) {
    console.error('Error creating SVG thumbnail:', error);
    return null;
  }
};