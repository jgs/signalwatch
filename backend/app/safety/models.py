from __future__ import annotations

from typing import Literal

from pydantic import BaseModel


class EvidenceLink(BaseModel):
    source_id: str
    note: str


class SafetySource(BaseModel):
    id: str
    title: str
    publisher: str
    url: str
    category: str
    reliability: Literal["official", "academic", "institutional"]
    accessed: str
    summary: str


class RiskCategory(BaseModel):
    id: str
    name: str
    summary: str
    why_it_matters: str
    mitigations: list[str]
    evidence: list[EvidenceLink]


class JobExposureInsight(BaseModel):
    id: str
    area: str
    pressure: Literal["task exposure", "transition pressure", "augmentation potential", "policy dependency"]
    explanation: str
    benefits: list[str]
    transition_risks: list[str]
    evidence: list[EvidenceLink]


class AlignmentConcept(BaseModel):
    id: str
    title: str
    plain_language: str
    operational_view: str
    examples: list[str]
    evidence: list[EvidenceLink]


class DemoDescriptor(BaseModel):
    id: str
    title: str
    status: Literal["available", "architecture-ready", "conceptual"]
    category: str
    summary: str
    constraints: list[str]
    evidence: list[EvidenceLink] = []
