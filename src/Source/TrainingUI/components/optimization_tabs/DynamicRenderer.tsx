import React from 'react';
import * as Icons from 'lucide-react';
import { COLORS } from '../../../../constants/colors';
import { FeatureMatrix, MultiplayerImpact, SectionCard, HighlightBox, StatRow, PageHeader, CodeBlock, Collapsible } from './OptimizationHelpers';
import tabData from '../../../TrainingCore/core/optimization_tabs_data.json';

const COMPONENTS: Record<string, any> = {
  div: 'div',
  span: 'span',
  p: 'p',
  ul: 'ul',
  li: 'li',
  strong: 'strong',
  code: 'code',
  pre: 'pre',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  br: 'br',
  a: 'a',
  FeatureMatrix,
  MultiplayerImpact,
  SectionCard,
  HighlightBox,
  StatRow,
  PageHeader,
  CodeBlock,
  Collapsible,
  // Some standard things maybe missing but these cover 99% of what we saw
};

function resolveValue(val: string) {
    if (val === undefined) return undefined;
    if (typeof val !== 'string') return val;
    
    const trimmed = val.trim();

    if (trimmed.startsWith('COLORS.')) {
        const parts = trimmed.split('.');
        if (parts.length === 3) {
            return (COLORS as any)[parts[1]][parts[2]];
        }
        if (parts.length === 2) {
            return (COLORS as any)[parts[1]];
        }
    }
    
    if ((Icons as any)[trimmed]) {
        return (Icons as any)[trimmed];
    }

    // Handle style objects like "{ color: COLORS.kingfisher.warm }"
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
        const styleObj: any = {};
        // Attempt to extract key-value pairs
        // e.g. "color: COLORS.kingfisher.warm"
        const pairs = trimmed.slice(1, -1).split(',');
        for (let pair of pairs) {
            const [k, v] = pair.split(':').map(s => s.trim());
            if (k && v) {
                styleObj[k] = resolveValue(v);
            }
        }
        if (Object.keys(styleObj).length > 0) return styleObj;
        
        try {
            return JSON.parse(trimmed.replace(/'/g, '"'));
        } catch(e) {}
    }

    // Check if it looks like a JSON array expression
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
       try {
           return JSON.parse(trimmed);
       } catch(e) {
           // Cleanup and try again
           try {
               const cleaned = trimmed.replace(/'/g, '"').replace(/\\"/g, '"');
               return JSON.parse(cleaned);
           } catch(e2) {}
       }
    }
    return val;
}

function renderNode(node: any, index: number): React.ReactNode {
    if (!node) return null;
    if (node.type === 'text') return node.value;
    if (node.type === 'expression') return null; // We can't render arbitrary expressions, skip for now. Most text is already text

    const Comp = COMPONENTS[node.type] || (Icons as any)[node.type] || node.type;
    const resolvedProps: any = {};
    
    if (node.props) {
        for (const [key, value] of Object.entries(node.props)) {
            if (key === 'key') continue;
            resolvedProps[key] = resolveValue(value as string);
        }
    }

    if (!node.children || node.children.length === 0) {
        return <Comp key={index} {...resolvedProps} />;
    }

    return (
        <Comp key={index} {...resolvedProps}>
            {node.children.map((child: any, i: number) => renderNode(child, i))}
        </Comp>
    );
}

interface DynamicTabProps {
   tabId: string;
}

export const DynamicTab: React.FC<DynamicTabProps> = ({ tabId }) => {
    // We map activeTab -> component Name
    // e.g. aaa_profiling -> AAAQualityProfilingTab
    // Let's assume the caller passes the exact key from the JSON, like "AAAQualityProfilingTab"
    const data = (tabData as any)[tabId];
    if (!data) return <div className="p-10 text-white">Tab Data Not Found for {tabId}</div>;

    return (
        <div className="dynamic-tab-container">
             {renderNode(data, 0)}
        </div>
    );
};
