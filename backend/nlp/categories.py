"""
Domain-Specific Legal Document & Contract Clause Classifier
Taxonomies, Risk Mappings, and Category Definitions.
"""

from typing import Dict, List, Any

# 10 Legal Clause Categories
CLAUSE_CATEGORIES: List[str] = [
    "Confidentiality",
    "Termination",
    "Indemnification",
    "Limitation of Liability",
    "Governing Law",
    "Payment Terms",
    "Auto-Renewal",
    "Intellectual Property",
    "Warranties & Disclaimers",
    "Force Majeure",
]

# Risk Level Classification for Clauses
RISK_LEVELS: Dict[str, str] = {
    "Termination": "High",
    "Indemnification": "High",
    "Limitation of Liability": "High",
    "Auto-Renewal": "High",
    "Intellectual Property": "High",
    "Confidentiality": "Medium",
    "Payment Terms": "Medium",
    "Warranties & Disclaimers": "Medium",
    "Governing Law": "Low",
    "Force Majeure": "Low",
}

# Category Descriptions for UI tooltips & reports
CATEGORY_DESCRIPTIONS: Dict[str, str] = {
    "Confidentiality": "Restricts disclosure of proprietary information, trade secrets, and non-public business data.",
    "Termination": "Specifies grounds, notice periods, breach cure windows, and immediate dissolution rights.",
    "Indemnification": "Obligates one party to compensate or defend against third-party liabilities, damages, or claims.",
    "Limitation of Liability": "Caps monetary damages and excludes indirect, punitive, or consequential losses.",
    "Governing Law": "Defines jurisdiction, applicable statutory laws, and dispute resolution venues.",
    "Payment Terms": "Governs financial consideration, invoice schedules, milestone releases, and late fees.",
    "Auto-Renewal": "Specifies automatic contract extension mechanisms and termination notice deadlines.",
    "Intellectual Property": "Allocates ownership, licensing, assignment, and work-for-hire rights.",
    "Warranties & Disclaimers": "Sets representations of quality, fitness, or express 'AS-IS' warranty waivers.",
    "Force Majeure": "Excuses non-performance due to unforeseen catastrophic events, acts of God, or civil unrest.",
}

# High-risk trigger phrases to dynamically elevate risk or highlight dangerous stipulations
HIGH_RISK_TRIGGERS: List[str] = [
    "sole discretion",
    "unlimited liability",
    "perpetual and irrevocable",
    "waives all rights",
    "indemnify and hold harmless",
    "liquidated damages",
    "automatically renew",
    "without notice",
    "exclusive remedy",
    "strictly liable",
]

# 5 Document Types for Bulk Due Diligence Sorting
DOCUMENT_TYPES: List[str] = [
    "Non-Disclosure Agreement (NDA)",
    "Employment Agreement",
    "Commercial Lease Agreement",
    "Service / Vendor Agreement",
    "Court Judgment / Settlement",
]

DOCUMENT_TYPE_KEYWORDS: Dict[str, List[str]] = {
    "Non-Disclosure Agreement (NDA)": [
        "non-disclosure", "confidential information", "receiving party", "disclosing party", "trade secrets"
    ],
    "Employment Agreement": [
        "employee", "employer", "employment", "salary", "duties", "non-compete", "probationary"
    ],
    "Commercial Lease Agreement": [
        "landlord", "tenant", "leased premises", "rent", "security deposit", "sublease", "quiet enjoyment"
    ],
    "Service / Vendor Agreement": [
        "services", "contractor", "client", "deliverables", "statement of work", "milestones", "independent contractor"
    ],
    "Court Judgment / Settlement": [
        "plaintiff", "defendant", "court", "judge", "hereby ordered", "settlement agreement", "in witness whereof"
    ],
}

def get_risk_level(category: str, text: str = "") -> str:
    """
    Returns risk level ('Low', 'Medium', 'High') based on baseline category
    and presence of high-risk operational triggers.
    """
    base_risk = RISK_LEVELS.get(category, "Low")
    if base_risk == "High":
        return "High"
    
    text_lower = text.lower()
    for trigger in HIGH_RISK_TRIGGERS:
        if trigger in text_lower:
            return "High"
            
    return base_risk
