#!/usr/bin/env python3
"""
Comprehensive Backwards Compatibility Test for Content Adapters
Tests that HTML processing produces identical results with both legacy and adapter methods
"""

import sys
import os
import json
import math
from typing import Dict, Any, List, Tuple
from datetime import datetime

# Add backend to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Test HTML articles with various complexities
TEST_ARTICLES = {
    "simple": {
        "title": "Simple Medical Article",
        "html": """
        <h1>Introduction to Sports Medicine</h1>
        <p>This article discusses ACL reconstruction techniques in sports medicine.</p>
        <h2>Methods</h2>
        <p>We performed arthroscopic ACL reconstruction on 50 patients.</p>
        <h2>Results</h2>
        <p>The success rate was 95% with excellent patient satisfaction.</p>
        <h2>Conclusion</h2>
        <p>Arthroscopic ACL reconstruction shows promising results for athletes.</p>
        """
    },
    
    "medical_complex": {
        "title": "Complex Medical Research",
        "html": """
        <article>
            <h1>Biceps Tenodesis vs Tenotomy: A Randomized Controlled Trial</h1>
            
            <section id="abstract">
                <h2>Abstract</h2>
                <p>This meta-analysis examines the effectiveness of biceps tenodesis compared to 
                tenotomy in patients with SLAP lesions and rotator cuff pathology.</p>
            </section>
            
            <section id="introduction">
                <h2>Introduction</h2>
                <p>The management of biceps pathology remains controversial. Recent evidence 
                suggests that both tenodesis and tenotomy procedures yield satisfactory outcomes, 
                though complications may vary significantly.</p>
            </section>
            
            <section id="methods">
                <h2>Methods</h2>
                <p>We conducted a systematic review of randomized controlled trials (n=1250) 
                comparing arthroscopic biceps tenodesis to tenotomy. Statistical analysis 
                included p-values < 0.05 for significance. The mean follow-up was 24 months.</p>
                <ul>
                    <li>Inclusion criteria: Age 18-65, isolated biceps pathology</li>
                    <li>Exclusion criteria: Previous shoulder surgery, rotator cuff tears</li>
                    <li>Primary outcome: Constant-Murley score</li>
                </ul>
            </section>
            
            <section id="results">
                <h2>Results</h2>
                <p>Among 1250 patients, tenodesis showed superior outcomes (p=0.03) with 
                92.5% satisfaction rate compared to 87.3% for tenotomy. Complication rates 
                were 3.2% and 5.1% respectively. Recovery time averaged 12 weeks for both 
                procedures. The healing rate was significantly higher in the tenodesis group.</p>
                <table>
                    <tr><th>Outcome</th><th>Tenodesis</th><th>Tenotomy</th></tr>
                    <tr><td>Success Rate</td><td>92.5%</td><td>87.3%</td></tr>
                    <tr><td>Complications</td><td>3.2%</td><td>5.1%</td></tr>
                </table>
            </section>
            
            <section id="discussion">
                <h2>Discussion</h2>
                <p>Our findings demonstrate that biceps tenodesis may offer marginally better 
                outcomes than tenotomy, particularly in younger athletic populations. However, 
                both procedures remain effective options for managing biceps pathology.</p>
            </section>
            
            <section id="conclusion">
                <h2>Conclusions</h2>
                <p>Both tenodesis and tenotomy are reliable surgical options. The choice 
                should be individualized based on patient factors, activity level, and 
                surgeon preference. Further research is needed to establish long-term outcomes.</p>
            </section>
        </article>
        """
    },
    
    "statistical_heavy": {
        "title": "Statistical Analysis Article",
        "html": """
        <div class="research-article">
            <h1>Comprehensive Analysis of Joint Replacement Outcomes</h1>
            
            <p>This study analyzes outcomes from 5,000 total knee arthroplasty procedures 
            performed between 2015-2023.</p>
            
            <h2>Statistical Findings</h2>
            <p>Primary outcomes showed 94.7% success rate (95% CI: 93.8-95.6%, p<0.001). 
            Secondary analysis revealed age-stratified differences: patients <65 years 
            had 96.2% success vs 91.3% for >80 years (p=0.002).</p>
            
            <p>Complication analysis: DVT incidence 1.8% (n=90), infection rate 0.9% (n=45), 
            revision surgery required in 2.4% (n=120) of cases. Mean hospital stay was 
            3.2 ± 1.1 days. Patient-reported outcome measures (PROMs) improved from 
            baseline 32.5 ± 8.2 to 78.6 ± 12.3 at 12-month follow-up (p<0.0001).</p>
            
            <h3>Multivariate Analysis</h3>
            <p>Cox regression identified risk factors: BMI >35 (HR 2.3, 95% CI 1.8-2.9), 
            diabetes (HR 1.7, 95% CI 1.3-2.2), smoking (HR 1.9, 95% CI 1.5-2.4). 
            Protective factors included preoperative physiotherapy (HR 0.6, 95% CI 0.4-0.8).</p>
            
            <p>Cost-effectiveness analysis: QALY gain 8.2 years, ICER $12,500/QALY, well 
            below threshold of $50,000/QALY. Budget impact model projects $2.3M savings 
            over 5 years with implementation of enhanced recovery protocol.</p>
        </div>
        """
    },
    
    "mixed_subspecialty": {
        "title": "Multi-Subspecialty Article",
        "html": """
        <main>
            <h1>Orthopedic Innovations Across Subspecialties</h1>
            
            <section>
                <h2>Sports Medicine Advances</h2>
                <p>Recent developments in ACL reconstruction include novel graft choices 
                and improved fixation techniques. Meniscus repair success rates have 
                improved to 85% with new suturing methods.</p>
            </section>
            
            <section>
                <h2>Shoulder and Elbow Surgery</h2>
                <p>Arthroscopic rotator cuff repair continues to evolve. SLAP repair 
                versus biceps tenodesis remains controversial. Tennis elbow treatment 
                has shifted towards biologics with PRP showing promising results.</p>
            </section>
            
            <section>
                <h2>Hand and Wrist Innovations</h2>
                <p>Carpal tunnel release techniques have been refined. Trigger finger 
                management increasingly favors percutaneous release. Dupuytren's 
                contracture treatment options have expanded.</p>
            </section>
            
            <section>
                <h2>Foot and Ankle Updates</h2>
                <p>Ankle arthroscopy indications have expanded. Achilles tendon repair 
                techniques show improved outcomes. Plantar fasciitis treatment algorithms 
                have been updated based on recent evidence.</p>
            </section>
            
            <section>
                <h2>Spine Surgery Progress</h2>
                <p>Minimally invasive spine surgery continues to advance. Disc replacement 
                versus fusion remains an active area of research. Vertebroplasty techniques 
                have been refined for osteoporotic fractures.</p>
            </section>
        </main>
        """
    },
    
    "edge_case_empty": {
        "title": "Empty Article",
        "html": "<div></div>"
    },
    
    "edge_case_malformed": {
        "title": "Malformed HTML",
        "html": """
        <h1>Broken HTML Test
        <p>This paragraph is not closed
        <h2>Missing closing tag
        <p>Another unclosed paragraph with <strong>nested unclosed tag
        </div>
        <p>Random text with special characters: @#$%^&*()_+{}|:"<>?</p>
        """
    }
}

def compare_floats(a: float, b: float, tolerance: float = 0.01) -> bool:
    """Compare two floats with tolerance"""
    if math.isnan(a) and math.isnan(b):
        return True
    if math.isnan(a) or math.isnan(b):
        return False
    return abs(a - b) <= tolerance

def compare_emotional_journey(legacy: Dict, adapter: Dict) -> List[str]:
    """Compare emotional journey data between legacy and adapter results"""
    differences = []
    
    # Get emotional journey from both
    legacy_journey = legacy.get('emotional_journey', {})
    adapter_journey = adapter.get('emotional_journey', {})
    
    # Compare each emotional metric
    emotions = [
        'problemIntensity', 'solutionConfidence', 'innovationLevel',
        'healingPotential', 'uncertaintyLevel', 'dominantEmotion'
    ]
    
    for emotion in emotions:
        legacy_val = legacy_journey.get(emotion)
        adapter_val = adapter_journey.get(emotion)
        
        if emotion == 'dominantEmotion':
            # String comparison
            if legacy_val != adapter_val:
                differences.append(f"  - {emotion}: '{legacy_val}' vs '{adapter_val}'")
        else:
            # Float comparison
            if isinstance(legacy_val, (int, float)) and isinstance(adapter_val, (int, float)):
                if not compare_floats(float(legacy_val), float(adapter_val)):
                    differences.append(f"  - {emotion}: {legacy_val:.4f} vs {adapter_val:.4f}")
            elif legacy_val != adapter_val:
                differences.append(f"  - {emotion}: {legacy_val} vs {adapter_val}")
    
    return differences

def compare_visual_elements(legacy: Dict, adapter: Dict) -> List[str]:
    """Compare visual elements between legacy and adapter results"""
    differences = []
    
    legacy_elements = legacy.get('visual_elements', [])
    adapter_elements = adapter.get('visual_elements', [])
    
    # Compare count
    if len(legacy_elements) != len(adapter_elements):
        differences.append(f"  - Element count: {len(legacy_elements)} vs {len(adapter_elements)}")
    
    # Count elements by type
    legacy_types = {}
    adapter_types = {}
    
    for elem in legacy_elements:
        elem_type = elem.get('type', 'unknown')
        legacy_types[elem_type] = legacy_types.get(elem_type, 0) + 1
    
    for elem in adapter_elements:
        elem_type = elem.get('type', 'unknown')
        adapter_types[elem_type] = adapter_types.get(elem_type, 0) + 1
    
    # Compare type counts
    all_types = set(legacy_types.keys()) | set(adapter_types.keys())
    for elem_type in sorted(all_types):
        legacy_count = legacy_types.get(elem_type, 0)
        adapter_count = adapter_types.get(elem_type, 0)
        if legacy_count != adapter_count:
            differences.append(f"  - {elem_type} count: {legacy_count} vs {adapter_count}")
    
    # If counts match, compare properties of matching elements
    if len(legacy_elements) == len(adapter_elements) and not differences:
        for i, (legacy_elem, adapter_elem) in enumerate(zip(legacy_elements, adapter_elements)):
            if legacy_elem.get('type') != adapter_elem.get('type'):
                differences.append(f"  - Element {i} type mismatch: '{legacy_elem.get('type')}' vs '{adapter_elem.get('type')}'")
                continue
            
            # Compare numeric properties with tolerance
            for prop in ['x', 'y', 'length', 'thickness', 'size', 'radius']:
                legacy_val = legacy_elem.get(prop)
                adapter_val = adapter_elem.get(prop)
                if legacy_val is not None and adapter_val is not None:
                    if not compare_floats(float(legacy_val), float(adapter_val), tolerance=1.0):
                        differences.append(f"  - Element {i} ({legacy_elem.get('type')}) {prop}: {legacy_val} vs {adapter_val}")
    
    return differences

def compare_other_fields(legacy: Dict, adapter: Dict) -> List[str]:
    """Compare other important fields"""
    differences = []
    
    # Fields to compare
    fields = [
        'subspecialty', 'evidence_strength', 'technical_density',
        'dominant_emotion', 'tree_complexity', 'branch_pattern'
    ]
    
    for field in fields:
        legacy_val = legacy.get(field)
        adapter_val = adapter.get(field)
        
        if isinstance(legacy_val, (int, float)) and isinstance(adapter_val, (int, float)):
            if not compare_floats(float(legacy_val), float(adapter_val)):
                differences.append(f"  - {field}: {legacy_val:.4f} vs {adapter_val:.4f}")
        elif legacy_val != adapter_val:
            differences.append(f"  - {field}: '{legacy_val}' vs '{adapter_val}'")
    
    return differences

def test_article(article_name: str, article_data: Dict) -> Tuple[bool, List[str]]:
    """Test a single article through both processing methods"""
    print(f"\n{'='*60}")
    print(f"Testing: {article_data['title']}")
    print(f"{'='*60}")
    
    html_content = article_data['html']
    all_differences = []
    
    try:
        # Import processing functions
        from arthrokinetix_algorithm import process_article_with_manual_algorithm, process_content_with_adapters
        
        # Process with legacy method
        print("🔸 Processing with legacy method...")
        legacy_result = process_article_with_manual_algorithm(html_content)
        
        # Process with adapter method
        print("🔹 Processing with adapter method...")
        adapter_result = process_content_with_adapters(html_content, "html")
        
        # Compare results
        print("\n📊 Comparing results...")
        
        # Compare emotional journey
        emotional_diffs = compare_emotional_journey(legacy_result, adapter_result)
        if emotional_diffs:
            all_differences.append("❌ Emotional Journey Differences:")
            all_differences.extend(emotional_diffs)
        else:
            print("✅ Emotional journey: IDENTICAL")
        
        # Compare visual elements
        visual_diffs = compare_visual_elements(legacy_result, adapter_result)
        if visual_diffs:
            all_differences.append("❌ Visual Elements Differences:")
            all_differences.extend(visual_diffs)
        else:
            print("✅ Visual elements: IDENTICAL")
        
        # Compare other fields
        other_diffs = compare_other_fields(legacy_result, adapter_result)
        if other_diffs:
            all_differences.append("❌ Other Fields Differences:")
            all_differences.extend(other_diffs)
        else:
            print("✅ Other fields: IDENTICAL")
        
        # Summary for this article
        if all_differences:
            print(f"\n❌ FAILED: Found {len([d for d in all_differences if d.startswith('  -')])} differences")
            for diff in all_differences:
                print(diff)
        else:
            print("\n✅ PASSED: Results are identical!")
        
        # Show key metrics
        print(f"\n📈 Key Metrics:")
        print(f"   Subspecialty: {legacy_result.get('subspecialty')}")
        print(f"   Dominant emotion: {legacy_result.get('dominant_emotion')}")
        print(f"   Visual elements: {len(legacy_result.get('visual_elements', []))}")
        print(f"   Evidence strength: {legacy_result.get('evidence_strength', 0):.3f}")
        
        # Check if we have critical differences (not just visual)
        critical_differences = [d for d in all_differences if not d.startswith("⚠️")]
        return len(critical_differences) == 0, all_differences
        
    except Exception as e:
        print(f"❌ Test failed with error: {e}")
        import traceback
        traceback.print_exc()
        return False, [f"Exception: {str(e)}"]

def main():
    """Run all backwards compatibility tests"""
    print("🧪 Backwards Compatibility Test Suite")
    print("Testing that HTML processing produces identical results")
    print("with both legacy and content adapter methods")
    print("=" * 60)
    
    # Check if content adapters are available
    try:
        from content_adapters import ContentAdapterFactory
        print("✅ Content adapters are available")
    except ImportError:
        print("⚠️  Content adapters not found - installing may be required")
        print("   Run: pip install beautifulsoup4 lxml")
    
    # Run tests
    results = {}
    total_passed = 0
    
    for article_name, article_data in TEST_ARTICLES.items():
        passed, differences = test_article(article_name, article_data)
        results[article_name] = {
            "passed": passed,
            "differences": differences,
            "title": article_data["title"]
        }
        if passed:
            total_passed += 1
    
    # Final summary
    print("\n" + "=" * 60)
    print("📊 FINAL SUMMARY")
    print("=" * 60)
    
    print(f"\nTotal tests: {len(TEST_ARTICLES)}")
    print(f"Passed: {total_passed}")
    print(f"Failed: {len(TEST_ARTICLES) - total_passed}")
    
    print("\nDetailed Results:")
    for article_name, result in results.items():
        status = "✅ PASS" if result["passed"] else "❌ FAIL"
        print(f"\n{status} - {result['title']}")
        if not result["passed"] and result["differences"]:
            print(f"   Differences found: {len([d for d in result['differences'] if d.startswith('  -')])}")
    
    # Overall verdict
    print("\n" + "=" * 60)
    if total_passed == len(TEST_ARTICLES):
        print("🎉 ALL TESTS PASSED! Complete backwards compatibility confirmed!")
        return 0
    else:
        print(f"⚠️  {len(TEST_ARTICLES) - total_passed} tests failed. Review differences above.")
        return 1

if __name__ == "__main__":
    exit(main())