import Head from 'next/head'
import Image from 'next/image'
// import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import styled from "styled-components";
import React, { useState, useCallback, useEffect, } from 'react';
import 'reactflow/dist/style.css';

import circleNode from './circleNode.jsx'

import ReactFlow, {
  Controls,
  Background,
  applyEdgeChanges,
  applyNodeChanges,
  useReactFlow,
  addEdge,
  ConnectionMode,
  getConnectedEdges,
  ReactFlowProvider,
} from 'reactflow';

const reactFlowStyle = {
  background: '#f4f2f7', //cool background
};

const nodeTypes = { 
  circle: circleNode //custom node
};

const defaultEdgeOptions = {
  type: 'straight', //default: bezier
};

//blank screen, can add in initial nodes here
const initialNodes = [
  // { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
];
let id = 0;
const getId = () => `${id++}`;

const initialEdges = [
  // { id: 'e0top-1bottom', source: 'top', target: 'bottom', type: 'straight' }
];


function App() {
  //flow basics 
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const onNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), [setNodes]);
  const onEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), [setEdges]);
  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []); //from tut

  //so i can use reactFlowInstance functions
  const flow = useReactFlow();
  //for resetting degree used in GetNodeData, init to 0
  const [degree, setDegree] = useState(0);
  //for resetting target node in GetNodeData, init to node label = 0
  const [currentNode, setCurrentNode] = useState(0);


  //test
  useEffect (() => { //runs after first and every render
    console.log("test change");
  }, []);

  //when pink button clicked, show node ids, degree of inputted node
  const showNodeId = useCallback(() => {
    console.log("pink click");
    var pars = document.querySelectorAll("p");
    for (let i = 0; i < pars.length; i++){
      if (pars[i].style.display === "none") {
        pars[i].style.display = "block";
      } else {
        pars[i].style.display = "none";
      }
    }
  }, [] );

  //GetNodeData - refresh on every input change, check for degree of inputted node
  const GetNodeData = useCallback((evt) => {
    const lookingFor = `${evt.target.value}`;
    setCurrentNode(lookingFor);
    console.log("fetching node degrees");
    const node_list = flow.getNodes();
    const edge_list = flow.getEdges();
    var node_item = [];
    var found = false;
    for (let i = 0; i < node_list.length; i++) {
      node_item = [node_list[i]];
      if (lookingFor == node_item[0].data.label){
        console.log(getConnectedEdges(node_item, edge_list).length);
        setDegree(getConnectedEdges(node_item, edge_list).length);
        found = true;
      }
    }
    if (!found) {
      setDegree("unknown... perhaps it does not exist");
    }

  }, [getConnectedEdges]);
  
  //onAdd - make a new node
  const onAdd = useCallback(() => { 
      const newNode = {
      id: getId(),
      type: "circle",
      data: { label: `${id}` },
      position: {
        x: 0,
        y: 0 + (nodes.length + 1) * 20,
      },
    };
    setNodes((nds) => nds.concat(newNode));
  }, [nodes, setNodes]);

  return (
    <div style={{ width: '100vw', height: '100vh',}}>
      <HeaderWrapper>
        <h1>Izzy's Graph Theory App</h1>
        <h2>for pat devlin math39 class</h2>
      </HeaderWrapper>
      <div class = "big-cont" style={{
        display: "flex", }}>
        <div class="left-container" style={{
          display: "flex",
          width: '60vw',
          height: '130px',
          margin: "0px",
        }}>
          <Image
            src="/beadtwist.gif"
            alt="hypno nodes"
            width={100}
            height={100}
            priority
            style={{
              display: "flex",
              position: "abolute",
              left: "50px",
              margin: "14px",

            }}
          />
          <Button theme="pink" onClick={onAdd}>Add</Button>
          <Button theme="purple" onClick={showNodeId}>
            Show Node Data
          </Button>
          <input id="degreeData" placeholder="enter node id." onChange={GetNodeData}></input>
        </div>
        <DescWrapper>
          <h3>here today i present to you, my math project... totaling over 2.34 days of learning.!</h3>
        </DescWrapper>

      </div>
      <p id="degree-text">The degree of node {currentNode} is {degree}</p>
      <ReactFlow style={reactFlowStyle}
        nodes={nodes}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        connectionMode={ConnectionMode.Loose}
      >
        <Controls />
        <Background variant="dots" gap={22} size={1} />

      </ReactFlow>
    </div>
  );
}

export default function FlowWithProvider() {
  return (
    <ReactFlowProvider>
      <App/>
    </ReactFlowProvider>
  );
}

const HeaderWrapper = styled.div`
    width:400px;
    height:90px;
    margin: 10px;
    background-image: linear-gradient(to right, #d0d3f2 0%, #dff5ea 100%);
    background-size:cover;
    border-radius: 3px;

`;

const DescWrapper = styled.div`
    width:40vw;
    height:110px;
    background-image: linear-gradient(to right, #f2dff0 0%, #dff5ea 100%);
    background-size:cover;
    margin: 10px;
    border-radius: 3px;

    


    display: "flex",
    width: '45vw',
`;

const Button = styled.button`
  background-color: ${(props) => theme[props.theme].default};
  display: inline;
  height: 100px;
  width: 100px;
  padding: 7px 7px;
  border-radius: 5%;
  outline: 0;
  margin-right: 15px;
  margin-left: 15px;
  margin-bottom: 15px;
  margin-top: 15px;
  transition: ease background-color 250ms;
  color: black;
  font-family: 'Glook', serif;
  border: 2px solid white;
  font-size: 20px;
  &:hover {
    background-color: ${(props) => theme[props.theme].hover};
  }
`;

//theme options for styled Button, default is white
const theme = {
  white: {
    default: "#ffffff",
    hover: "d4d4d4",

  },
  purple: {
    default: "#b4a1ff",
    hover: "#887eab",
  },
  pink: {
    default: "#ff97bb",
    hover: "#c48098"
  }
};
Button.defaultProps = {
  theme: "white"
};
