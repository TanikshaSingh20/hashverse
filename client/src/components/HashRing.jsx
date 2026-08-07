import React from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { getNodeColor } from '../utils/nodeColor';

const HashRing = ({ nodes, dataKeys }) => {
  const size = 500;
  const center = size / 2;
  const radius = 200;
  const virtualNodes = nodes.flatMap((node) =>
    (node.virtualNodes || [{ id: node.name, index: 0, hash: node.hash }]).map(
      (virtualNode) => ({ ...virtualNode, nodeName: node.name })
    )
  );

  return (
    <div className="mt-8 flex justify-center items-center">
      <svg width={size} height={size}>
        <circle cx={center} cy={center} r={radius} stroke="#444" fill="none" />
        <AnimatePresence>
          {virtualNodes.map((virtualNode) => {
            const theta = (virtualNode.hash / 0xffffffff) * 2 * Math.PI;
            const x = center + radius * Math.cos(theta);
            const y = center + radius * Math.sin(theta);
            return (
              <Motion.circle
                key={virtualNode.id}
                cx={x}
                cy={y}
                r={7}
                fill={getNodeColor(virtualNode.nodeName)}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.3 }}
              >
                <title>{`Virtual node: ${virtualNode.nodeName}#${virtualNode.index}`}</title>
              </Motion.circle>
            );
          })}
        </AnimatePresence>

        <AnimatePresence>
          {dataKeys.map((d, kidx) => {
            const theta = (d.hash / 0xffffffff) * 2 * Math.PI;
            const x = center + (radius - 30) * Math.cos(theta);
            const y = center + (radius - 30) * Math.sin(theta);
            return (
              <Motion.circle
                key={d.hash + d.key}
                cx={x}
                cy={y}
                r={6}
                fill="skyblue"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <title>{`Key: ${d.key} (Key #${kidx + 1})`}</title>
              </Motion.circle>
            );
          })}
        </AnimatePresence>
      </svg>
    </div>
  );
};

<<<<<<< HEAD
export default HashRing;
=======
export default HashRing;
>>>>>>> e5ae96dcefd71aa34e7c01fc755f132fc15bebc7
