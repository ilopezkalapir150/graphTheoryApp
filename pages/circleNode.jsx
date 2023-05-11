import { useCallback, useEffect, useState } from 'react';
import { Handle, Position, getId, getNodes, useNodeId, getNodesEdges, getConnectedEdges, useReactFlow, } from 'reactflow';

function CircleNode({ data, isConnectable }) {
  const nodeID = useNodeId();
  const flow = useReactFlow();
  const [degree, setDegree] = useState(0);


  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
    // id = `${evt.target.value}`;
    // console.log(id);
  }, []);


  return (
    <div className="circle-node" 
    >
      <p id="id-number">{data.label}</p>
      <Handle 
        type="source" 
        position={Position.Top} 
        id="top" 
        isConnectable={isConnectable} />
      <div>
        <input id="text" name="text" onChange={onChange} align="middle" className="nodrag" />
      </div>
      <Handle type="source" position={Position.Bottom} id="bottom" isConnectable={isConnectable} />
      <Handle type="source" position={Position.Left} id="left" isConnectable={isConnectable} />
      <Handle type="source" position={Position.Right} id="right" isConnectable={isConnectable} />
    </div>
  );
}

export default CircleNode;