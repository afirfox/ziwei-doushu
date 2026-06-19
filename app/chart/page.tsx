'use client';
// @ts-ignore
const AnyInsightPanel = (typeof InsightPanel !== 'undefined' ? InsightPanel : null) as any;

// @ts-ignore
if (typeof AnyInsightPanel === 'undefined' && typeof InsightPanel !== 'undefined') { var AnyInsightPanel = InsightPanel as any; }
