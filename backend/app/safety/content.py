from __future__ import annotations

from app.safety.models import AlignmentConcept, DemoDescriptor, EvidenceLink, JobExposureInsight, RiskCategory, SafetySource


SOURCES = [
    SafetySource(
        id="openai-preparedness",
        title="Preparedness Framework",
        publisher="OpenAI",
        url="https://openai.com/preparedness",
        category="official AI safety framework",
        reliability="official",
        accessed="2026-05-16",
        summary="OpenAI's framework for tracking and preparing for advanced model capabilities that could introduce severe risks.",
    ),
    SafetySource(
        id="anthropic-rsp-v3",
        title="Responsible Scaling Policy: Version 3.0",
        publisher="Anthropic",
        url="https://www.anthropic.com/news/responsible-scaling-policy-v3",
        category="official AI safety framework",
        reliability="official",
        accessed="2026-05-16",
        summary="Anthropic's framework for managing risks from increasingly capable frontier models through safety levels and safeguards.",
    ),
    SafetySource(
        id="oecd-ai-work",
        title="AI and Work",
        publisher="OECD",
        url="https://www.oecd.org/en/topics/ai-and-work.html",
        category="labor and economic institution",
        reliability="institutional",
        accessed="2026-05-16",
        summary="OECD research on AI's labor market impact, worker transition, skills, workplace deployment, and policy responses.",
    ),
    SafetySource(
        id="stanford-ai-index-2025",
        title="The 2025 AI Index Report",
        publisher="Stanford HAI",
        url="https://hai.stanford.edu/ai-index/",
        category="academic annual report",
        reliability="academic",
        accessed="2026-05-16",
        summary="Stanford HAI's annual synthesis of AI research, deployment, policy, economy, and societal trends.",
    ),
]


ALIGNMENT = [
    AlignmentConcept(
        id="alignment-objectives",
        title="Alignment",
        plain_language="Alignment asks whether an AI system is actually pursuing what humans intended, not just what was easiest to measure.",
        operational_view="A system can look successful against a proxy metric while still producing behavior that fails under real deployment conditions.",
        examples=[
            "A model optimized for helpfulness may over-answer when uncertainty should be surfaced.",
            "An agent optimized for task completion may use tools in ways the operator did not intend.",
        ],
        evidence=[EvidenceLink(source_id="openai-preparedness", note="Preparedness evaluations are one approach to monitoring advanced capability risks.")],
    ),
    AlignmentConcept(
        id="oversight-interpretability",
        title="Oversight and interpretability",
        plain_language="More capable models need stronger ways to evaluate, inspect, and constrain behavior.",
        operational_view="Evaluation, red teaming, interpretability, and governance become part of the deployment surface, not optional documentation.",
        examples=[
            "A model may pass narrow tests but behave differently when connected to tools or long-horizon tasks.",
            "Interpretability and monitoring can help identify when a system's internal process diverges from operator expectations.",
        ],
        evidence=[EvidenceLink(source_id="anthropic-rsp-v3", note="Responsible scaling policies connect capability thresholds with safety and security measures.")],
    ),
]


RISK_FRAMEWORKS = [
    RiskCategory(
        id="autonomy",
        name="Autonomy and agents",
        summary="Advanced models may become more capable at planning, tool use, and long-horizon execution.",
        why_it_matters="Autonomy changes a model from a passive assistant into a system that can take sequences of actions.",
        mitigations=["Capability evaluations", "tool-use constraints", "human approval gates", "deployment monitoring"],
        evidence=[
            EvidenceLink(source_id="openai-preparedness", note="Preparedness frameworks evaluate advanced capabilities before deployment."),
            EvidenceLink(source_id="anthropic-rsp-v3", note="Anthropic identifies autonomous AI R&D capability as a frontier risk area."),
        ],
    ),
    RiskCategory(
        id="cyber",
        name="Cyber misuse",
        summary="Frontier systems may lower barriers for cyber operations if safeguards fail.",
        why_it_matters="Cyber capability can scale quickly when combined with automation and tool access.",
        mitigations=["Red teaming", "access controls", "abuse monitoring", "model behavior evaluations"],
        evidence=[EvidenceLink(source_id="openai-preparedness", note="Cyber is part of frontier model risk monitoring.")],
    ),
    RiskCategory(
        id="cbrn",
        name="CBRN misuse",
        summary="Some frameworks monitor whether models can materially assist chemical, biological, radiological, or nuclear misuse.",
        why_it_matters="The concern is not generic knowledge, but whether a model changes an actor's practical capability.",
        mitigations=["Expert evaluation", "restricted assistance", "deployment thresholds", "incident response planning"],
        evidence=[EvidenceLink(source_id="openai-preparedness", note="CBRN risk is a category in frontier safety evaluation.")],
    ),
    RiskCategory(
        id="loss-of-control",
        name="Loss of control",
        summary="A system may pursue proxy objectives or evade oversight when incentives and deployment context are misaligned.",
        why_it_matters="The risk grows when models are more autonomous, more capable, and connected to external tools.",
        mitigations=["Interpretability", "oversight", "sandboxing", "shutdown and rollback procedures"],
        evidence=[EvidenceLink(source_id="anthropic-rsp-v3", note="Responsible scaling connects higher capabilities to stronger safeguards.")],
    ),
]


JOB_DISPLACEMENT = [
    JobExposureInsight(
        id="tasks-before-jobs",
        area="Task exposure",
        pressure="task exposure",
        explanation="AI often changes tasks and skill demand before it replaces whole occupations. Exposure depends on the task mix inside a role.",
        benefits=["Routine information work can become faster.", "Workers may gain decision support or drafting assistance."],
        transition_risks=["Entry-level pathways may change.", "Routine cognitive and administrative tasks may face higher transition pressure."],
        evidence=[
            EvidenceLink(source_id="oecd-ai-work", note="OECD frames AI and work as a labor-market transition requiring policy and skills responses."),
            EvidenceLink(source_id="stanford-ai-index-2025", note="The AI Index tracks AI's economic and societal impact across sectors."),
        ],
    ),
    JobExposureInsight(
        id="sector-differences",
        area="Sector differences",
        pressure="transition pressure",
        explanation="AI impact varies by sector, workflow, regulation, and whether tasks are digital, repetitive, or require embodied real-world context.",
        benefits=["Some occupations gain productivity from automation of narrow subtasks."],
        transition_risks=["Support, administrative, and routine cognitive workflows can face reconfiguration pressure."],
        evidence=[EvidenceLink(source_id="oecd-ai-work", note="OECD research emphasizes both benefits and risks across labor markets.")],
    ),
    JobExposureInsight(
        id="policy-reskilling",
        area="Reskilling and policy",
        pressure="policy dependency",
        explanation="The labor outcome depends on training access, organizational deployment choices, worker bargaining power, and public policy.",
        benefits=["Better tools can expand access to some kinds of expertise."],
        transition_risks=["Uneven access to training can concentrate gains and losses."],
        evidence=[EvidenceLink(source_id="oecd-ai-work", note="OECD highlights policy responses, training, and worker adaptation.")],
    ),
]


LAB_DEMOS = [
    DemoDescriptor(
        id="cv-confidence",
        title="Computer Vision Confidence",
        status="architecture-ready",
        category="perception systems",
        summary="Upload or camera-based perception module planned for confidence, uncertainty, and failure-case inspection. Model inference is not running in this environment.",
        constraints=["No detections are fabricated.", "Results are shown only when a model is connected."],
    ),
    DemoDescriptor(
        id="perception-failure-modes",
        title="Perception Failure Modes",
        status="available",
        category="computer vision robustness",
        summary="Browser-side image transformations demonstrate how blur, low light, occlusion, compression, and cropping can degrade perception inputs.",
        constraints=["Educational transformation demo.", "Does not claim model outputs without a running model."],
    ),
    DemoDescriptor(
        id="alignment-toy",
        title="Alignment Toy Example",
        status="conceptual",
        category="alignment education",
        summary="A non-LLM conceptual simulation showing proxy objectives, reward hacking, and unintended behavior.",
        constraints=["Conceptual demo only.", "Not a claim about any deployed system."],
        evidence=[EvidenceLink(source_id="openai-preparedness", note="Evaluation gaps and safeguards motivate conceptual alignment demos.")],
    ),
    DemoDescriptor(
        id="job-pressure-explorer",
        title="Job Automation Pressure Explorer",
        status="architecture-ready",
        category="labor transition",
        summary="Explorer requires source-backed values before rendering sector pressure. No placeholder numbers are displayed.",
        constraints=["Every value must include a citation.", "No fabricated exposure scores."],
        evidence=[EvidenceLink(source_id="oecd-ai-work", note="Labor transition data should be grounded in institutional research.")],
    ),
    DemoDescriptor(
        id="barpath-liftvision",
        title="Barpath / LiftVision Safety Lab",
        status="architecture-ready",
        category="safety-critical vision",
        summary="Future computer vision experiments for pose, movement, and biomechanical signal extraction.",
        constraints=["No heavy inference included yet.", "Designed for future model plug-in."],
    ),
]
