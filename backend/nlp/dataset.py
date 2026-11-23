"""
Domain-Specific Legal Document & Contract Clause Classifier
Curated Legal Clause and Document Corpus for Model Training and Benchmarking.
Contains representative clauses across all 10 legal categories and 5 document classes.
"""

from typing import List, Tuple, Dict

# Clause-level training data: (clause_text, category_label)
CLAUSE_TRAINING_DATA: List[Tuple[str, str]] = [
    # 1. Confidentiality
    (
        "Each party agrees that all code, inventions, business, technical and financial information disclosed to such party by the other party shall remain the confidential property of the disclosing party, and the receiving party shall hold the same in strict confidence.",
        "Confidentiality"
    ),
    (
        "The Receiving Party agrees to prevent unauthorized disclosure of the Disclosing Party's Proprietary Information using the same degree of care, but no less than a reasonable degree of care, that it uses to protect its own confidential information of like nature.",
        "Confidentiality"
    ),
    (
        "Confidential Information shall not include any information that is or becomes generally available to the public other than as a result of a disclosure by the recipient in violation of this Agreement, or was within the recipient's possession prior to disclosure.",
        "Confidentiality"
    ),
    (
        "During the term of this Agreement and for a period of five (5) years thereafter, neither party shall disclose to any third party any confidential data, trade secrets, customer lists, or financial terms without prior written authorization.",
        "Confidentiality"
    ),
    (
        "Upon termination of this Agreement or upon written request from the Disclosing Party, the Receiving Party shall promptly return or destroy all physical and electronic copies of the Confidential Information.",
        "Confidentiality"
    ),
    (
        "Recipient agrees that the non-disclosure obligations shall survive the expiration of this contract and apply to all proprietary technical specifications, trade secrets, and source code.",
        "Confidentiality"
    ),

    # 2. Termination
    (
        "Either party may terminate this Agreement immediately upon written notice if the other party breaches any material term of this Agreement and fails to cure such breach within thirty (30) days after receipt of written notice thereof.",
        "Termination"
    ),
    (
        "This Agreement may be terminated by either party for convenience at any time upon providing sixty (60) days prior written notice to the other party.",
        "Termination"
    ),
    (
        "The Company reserves the right to immediately terminate the Employee's engagement for Cause, including but not limited to gross negligence, willful misconduct, conviction of a felony, or material fraud.",
        "Termination"
    ),
    (
        "In the event of insolvency, bankruptcy petition, liquidation, or appointment of a receiver over either party's assets, the other party shall be entitled to terminate this contract forthwith without liability.",
        "Termination"
    ),
    (
        "Upon notice of termination, Contractor shall immediately stop all work under the applicable Statement of Work, mitigate incurred costs, and deliver all completed work product to Client.",
        "Termination"
    ),
    (
        "Failure by Client to pay undisputed invoices within forty-five (45) days of due date shall constitute grounds for Vendor to suspend performance or terminate this Agreement upon five (5) business days notice.",
        "Termination"
    ),

    # 3. Indemnification
    (
        "Contractor agrees to indemnify, defend, and hold harmless Client, its affiliates, directors, officers, and employees against any third-party claims, liabilities, losses, costs, or damages arising out of Contractor's gross negligence, willful misconduct, or breach of this Agreement.",
        "Indemnification"
    ),
    (
        "Vendor shall indemnify and defend Customer against any claim or action brought by a third party alleging that the Software or Deliverables infringe any copyright, patent, trademark, or misappropriate any trade secret.",
        "Indemnification"
    ),
    (
        "Each party shall defend, indemnify, and hold harmless the other party from and against all legal expenses, reasonable attorney fees, court settlements, and civil damages resulting from bodily injury, death, or property damage.",
        "Indemnification"
    ),
    (
        "Tenant shall indemnify Landlord against any penalties, liabilities, losses, or legal costs incurred in connection with Tenant's unauthorized use of the Leased Premises or violation of municipal environmental ordinances.",
        "Indemnification"
    ),
    (
        "The indemnifying party's obligations are conditioned upon prompt written notification of the claim, sole control over the defense and settlement, and reasonable cooperation from the indemnified party.",
        "Indemnification"
    ),
    (
        "Licensee shall indemnify Licensor from any actions, demands, proceedings, and judgments brought by end users alleging loss of data or service downtime caused by Licensee's customized implementation.",
        "Indemnification"
    ),

    # 4. Limitation of Liability
    (
        "In no event shall either party be liable to the other for any indirect, incidental, consequential, special, punitive, or exemplary damages, including lost profits, loss of goodwill, or business interruption, arising out of or in connection with this agreement.",
        "Limitation of Liability"
    ),
    (
        "To the maximum extent permitted by applicable law, Company's total aggregate liability arising out of or related to this Agreement shall be limited to the total amount actually paid by Customer in the twelve (12) months preceding the incident giving rise to liability.",
        "Limitation of Liability"
    ),
    (
        "Neither party's cumulative liability for all claims of any kind arising out of this contract shall exceed fifty thousand dollars ($50,000) or the contract fee paid, whichever is lower.",
        "Limitation of Liability"
    ),
    (
        "The limitations and exclusions of liability set forth in this section shall apply regardless of the form of action, whether in contract, tort (including negligence), strict liability, or breach of statutory duty.",
        "Limitation of Liability"
    ),
    (
        "Except for breaches of confidentiality and indemnification obligations under Section 8, neither party shall be subject to uncapped monetary liability under any legal or equitable theory.",
        "Limitation of Liability"
    ),
    (
        "Under no circumstances shall Vendor be liable for loss of data, unauthorized access to user accounts, or downtime caused by public telecommunication networks or third-party cloud hosting providers.",
        "Limitation of Liability"
    ),

    # 5. Governing Law
    (
        "This Agreement shall be governed by, and construed in accordance with, the laws of the State of Delaware, without giving effect to any principles of conflicts of law.",
        "Governing Law"
    ),
    (
        "Any dispute, controversy, or claim arising out of or relating to this contract, including its formation or breach, shall be submitted to binding arbitration administered by the American Arbitration Association in New York, NY.",
        "Governing Law"
    ),
    (
        "Each party irrevocably submits to the exclusive jurisdiction of the state and federal courts located in San Francisco County, California, for any action or proceeding arising out of or relating to this Agreement.",
        "Governing Law"
    ),
    (
        "This Agreement and all disputes hereunder shall be interpreted pursuant to the laws of England and Wales, and the parties agree to submit to the non-exclusive jurisdiction of the courts of London.",
        "Governing Law"
    ),
    (
        "The United Nations Convention on Contracts for the International Sale of Goods (CISG) shall not apply to this Agreement or any transaction contemplated hereunder.",
        "Governing Law"
    ),
    (
        "The parties waive any objection to venue in the courts of Travis County, Texas, and agree that service of process may be effected by registered mail.",
        "Governing Law"
    ),

    # 6. Payment Terms
    (
        "Customer shall pay all undisputed invoices within thirty (30) days from the date of invoice. Late payments shall accrue interest at the rate of 1.5% per month or the maximum rate permitted by law, whichever is less.",
        "Payment Terms"
    ),
    (
        "Client agrees to pay Contractor an hourly rate of $150 per billable hour, invoiced bi-weekly upon submission of detailed timesheets and task completion reports.",
        "Payment Terms"
    ),
    (
        "All fees quoted are exclusive of applicable federal, state, local, or value-added taxes (VAT), which shall be added to the invoice and borne solely by the Customer.",
        "Payment Terms"
    ),
    (
        "Tenant shall pay to Landlord monthly base rent in the amount of $4,500 on or before the first day of each calendar month, without deduction, setoff, or prior demand.",
        "Payment Terms"
    ),
    (
        "A non-refundable deposit of twenty percent (20%) shall be payable upon contract execution, with the remaining balance divided into three milestone installments.",
        "Payment Terms"
    ),
    (
        "Vendor reserves the right to suspend platform access if any undisputed fees remain unpaid for more than fifteen (15) days after delivery of past-due reminder notice.",
        "Payment Terms"
    ),

    # 7. Auto-Renewal
    (
        "This Agreement shall commence on the Effective Date and continue for an initial term of one (1) year, and shall automatically renew for successive one-year periods unless either party provides written notice of non-renewal at least sixty (60) days prior to the expiration of the then-current term.",
        "Auto-Renewal"
    ),
    (
        "Unless cancelled in writing by Subscriber at least thirty (30) days prior to the end of the current subscription cycle, the software subscription shall auto-renew on an annual basis at the prevailing list price.",
        "Auto-Renewal"
    ),
    (
        "The lease term shall automatically extend for additional consecutive six-month terms unless Tenant delivers written non-renewal notice ninety (90) days before lease expiration.",
        "Auto-Renewal"
    ),
    (
        "This contract shall automatically renew for additional terms of the same duration unless either party gives written notice of termination at least forty-five (45) days before the end of the initial term.",
        "Auto-Renewal"
    ),
    (
        "Subscription fees are billed recurringly; this agreement will automatically rollover into an evergreen term subject to annual price escalation adjustments of up to 5%.",
        "Auto-Renewal"
    ),
    (
        "Automatic renewal shall occur on each anniversary of the contract commencement date, unless written intent not to renew is delivered forty-five days prior.",
        "Auto-Renewal"
    ),

    # 8. Intellectual Property
    (
        "All inventions, software, documentation, designs, trademarks, and copyrightable works created by Contractor in the performance of Services shall be deemed 'work made for hire' and shall belong exclusively to Client.",
        "Intellectual Property"
    ),
    (
        "Licensor retains all right, title, and interest, including all patent, copyright, trademark, and trade secret rights, in and to the Platform and any updates, enhancements, or derivatives thereof.",
        "Intellectual Property"
    ),
    (
        "Employee hereby assigns to the Company all right, title, and interest in and to any and all inventions, patents, discoveries, and proprietary workflows developed during the course of employment.",
        "Intellectual Property"
    ),
    (
        "Except for the limited license expressly granted herein, neither party acquires any rights, title, ownership, or implied licenses to the intellectual property of the other party.",
        "Intellectual Property"
    ),
    (
        "Customer retains sole ownership of all customer data, files, and proprietary content uploaded or transmitted through the hosted software application.",
        "Intellectual Property"
    ),
    (
        "Contractor grants to Company an irrevocable, perpetual, royalty-free, worldwide license to utilize, modify, display, and distribute any pre-existing background code incorporated into Deliverables.",
        "Intellectual Property"
    ),

    # 9. Warranties & Disclaimers
    (
        "Vendor warrants that the Software will perform substantially in accordance with the accompanying documentation under normal use for a period of ninety (90) days following delivery.",
        "Warranties & Disclaimers"
    ),
    (
        "EXCEPT AS EXPRESSLY SET FORTH HEREIN, THE SERVICES AND DELIVERABLES ARE PROVIDED 'AS IS' AND 'AS AVAILABLE' WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS, IMPLIED, STATUTORY OR OTHERWISE.",
        "Warranties & Disclaimers"
    ),
    (
        "THE COMPANY SPECIFICALLY DISCLAIMS ALL IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT OF THIRD-PARTY RIGHTS.",
        "Warranties & Disclaimers"
    ),
    (
        "Contractor represents and warrants that all services will be performed in a professional, workmanlike manner conforming to prevailing industry standards and best practices.",
        "Warranties & Disclaimers"
    ),
    (
        "Licensor does not warrant that the operation of the cloud platform will be uninterrupted, error-free, secure from intrusion, or compatible with all third-party hardware architectures.",
        "Warranties & Disclaimers"
    ),
    (
        "Each party represents and warrants that it has the full legal power, corporate authority, and capacity to enter into and perform its obligations under this Agreement.",
        "Warranties & Disclaimers"
    ),

    # 10. Force Majeure
    (
        "Neither party shall be liable or responsible to the other party for any failure or delay in the performance of its obligations under this Agreement caused by events beyond its reasonable control, including acts of God, war, terrorism, floods, earthquakes, epidemics, strikes, or governmental embargoes.",
        "Force Majeure"
    ),
    (
        "In the event of a force majeure condition, the affected party shall promptly notify the other party in writing, specifying the nature and anticipated duration of the delay, and shall use diligent efforts to resume performance as soon as practicable.",
        "Force Majeure"
    ),
    (
        "If a Force Majeure event continues for more than sixty (60) consecutive days, either party may terminate this Agreement immediately without penalty upon written notice to the other party.",
        "Force Majeure"
    ),
    (
        "Performance deadlines shall be extended by a period equal to the time lost by reason of the uncontrollable delay caused by declared national emergencies or catastrophic utility failures.",
        "Force Majeure"
    ),
    (
        "Neither party shall be held in breach for delays resulting from labor disputes, supply chain disruptions, civil disturbances, or widespread telecommunications outages beyond its control.",
        "Force Majeure"
    ),
    (
        "The suspension of performance due to acts of God or force majeure shall not excuse or relieve either party from its accrued financial obligation to pay for services rendered prior to such event.",
        "Force Majeure"
    ),
]

# Additional validation / evaluation test set
CLAUSE_EVALUATION_DATA: List[Tuple[str, str]] = [
    # Confidentiality
    ("Recipient shall maintain in confidence all non-public technical data and proprietary business strategies disclosed by Company.", "Confidentiality"),
    ("Trade secrets and customer databases revealed hereunder shall be held in strictest confidence by both parties.", "Confidentiality"),
    # Termination
    ("This contract may be dissolved by either party if the opposing party commits a material breach and fails to remedy within 15 days.", "Termination"),
    ("Either company may terminate this agreement without cause upon thirty days written notification.", "Termination"),
    # Indemnification
    ("Vendor shall indemnify, defend, and hold harmless Purchaser from all third-party patent and copyright claims.", "Indemnification"),
    ("The Supplier agrees to hold harmless the Buyer against any claims of personal injury arising out of defective equipment.", "Indemnification"),
    # Limitation of Liability
    ("Neither party shall be liable for indirect, special, punitive, or consequential damages resulting from this transaction.", "Limitation of Liability"),
    ("In no circumstances shall the developer's financial liability exceed the total fees received during the past 6 months.", "Limitation of Liability"),
    # Governing Law
    ("This Agreement will be construed in accordance with the substantive laws of the Commonwealth of Massachusetts.", "Governing Law"),
    ("All actions arising under this agreement must be litigated exclusively in the district courts of Cook County, Illinois.", "Governing Law"),
    # Payment Terms
    ("Invoices are due net 30 days. Unpaid amounts shall carry an interest penalty of 1% monthly.", "Payment Terms"),
    ("Tenant will wire monthly rental installments of $3,200 on the first day of each calendar month.", "Payment Terms"),
    # Auto-Renewal
    ("This agreement automatically rolls over into consecutive 12-month periods unless notice of non-renewal is given 90 days prior.", "Auto-Renewal"),
    ("Membership will auto-renew annually at standard commercial rates unless canceled before the renewal date.", "Auto-Renewal"),
    # Intellectual Property
    ("All designs, prototypes, and patent rights produced under this Statement of Work belong exclusively to the Client.", "Intellectual Property"),
    ("The employee conveys and assigns to the company all inventions and copyrightable computer programs created on company time.", "Intellectual Property"),
    # Warranties & Disclaimers
    ("The software is provided AS IS with no implied warranties of merchantability or fitness for any purpose.", "Warranties & Disclaimers"),
    ("Provider warrants that services will be performed in accordance with high commercial and ethical standards.", "Warranties & Disclaimers"),
    # Force Majeure
    ("Delays caused by natural disasters, acts of God, pandemics, or civil insurrection shall excuse timely performance.", "Force Majeure"),
    ("Neither party shall bear fault for work stoppage caused by widespread electrical grid failure or government decrees.", "Force Majeure"),
]

# Document-level samples for bulk document sorting classifier
DOC_TRAINING_DATA: List[Tuple[str, str]] = [
    # Non-Disclosure Agreement (NDA)
    (
        "MUTUAL NON-DISCLOSURE AGREEMENT\nThis Non-Disclosure Agreement is entered into between Disclosing Party and Receiving Party. The parties wish to explore a business opportunity requiring the exchange of proprietary trade secrets, business plans, and confidential data. Receiving party agrees not to disclose proprietary information for 3 years.",
        "Non-Disclosure Agreement (NDA)"
    ),
    (
        "CONFIDENTIALITY AND PROPRIETARY INFORMATION AGREEMENT\nThe recipient agrees that all confidential disclosures, client lists, and technical algorithms shall remain strictly confidential. Recipient shall not disclose or exploit such confidential information without prior written consent.",
        "Non-Disclosure Agreement (NDA)"
    ),
    # Employment Agreement
    (
        "EXECUTIVE EMPLOYMENT AGREEMENT\nThis Employment Agreement is entered into by Employer and Employee. The Company hereby employs Employee as Senior Software Architect. Employee shall receive an annual base salary of $160,000, healthcare benefits, and shall be subject to standard non-compete and intellectual property assignment covenants.",
        "Employment Agreement"
    ),
    (
        "INDEPENDENT CONTRACTOR AND EMPLOYMENT CONTRACT\nTerms of employment: The employee agrees to devote full-time professional efforts to the corporation. Duties include product management, weekly reporting, and adherence to company employee handbook policies.",
        "Employment Agreement"
    ),
    # Commercial Lease Agreement
    (
        "COMMERCIAL REAL ESTATE LEASE AGREEMENT\nThis Lease is made by Landlord and Tenant for the leased commercial premises situated at 100 Main St. Tenant shall pay monthly base rent of $6,000, provide a security deposit of $12,000, and use the premises strictly for retail and office purposes.",
        "Commercial Lease Agreement"
    ),
    (
        "OFFICE SPACE LEASE AGREEMENT\nLandlord leases to Tenant Suite 400 for a term of five (5) years. Tenant agrees to pay base rent and common area maintenance charges. Subleasing requires prior written consent from Landlord.",
        "Commercial Lease Agreement"
    ),
    # Service / Vendor Agreement
    (
        "MASTER SERVICES AGREEMENT (MSA)\nThis Master Services Agreement governs IT consulting and cloud implementation services provided by Vendor to Client. Vendor will deliver milestones specified in Statements of Work (SOW), invoice monthly at agreed professional rates, and warrant deliverables.",
        "Service / Vendor Agreement"
    ),
    (
        "VENDOR SERVICE CONTRACT\nAgreement between Client and Contractor for marketing and development services. Contractor shall furnish deliverables according to schedule, and Client shall compensate Contractor upon satisfactory milestone acceptance.",
        "Service / Vendor Agreement"
    ),
    # Court Judgment / Settlement
    (
        "UNITED STATES DISTRICT COURT - FINAL JUDGMENT AND ORDER\nPlaintiff v. Defendant. Civil Action No. 24-CV-1092. The Court, having considered the joint motion for approval of settlement agreement and dismissal of claims with prejudice, hereby ORDERS and ADJUDGES that defendant shall pay the settlement sum and all claims are dismissed.",
        "Court Judgment / Settlement"
    ),
    (
        "STIPULATION AND SETTLEMENT AGREEMENT\nIn the matter of disputed contract claims between Party A and Party B. The parties hereby settle all litigated matters, consent to entry of judgment, release all causes of action, and submit to the continuing jurisdiction of the Court.",
        "Court Judgment / Settlement"
    ),
]
