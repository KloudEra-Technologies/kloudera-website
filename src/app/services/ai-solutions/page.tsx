"use client";

import React, { useState, useEffect, useRef } from "react";
import { AiSolutionsLoader } from "@/components/LoadingSequences";
import { useAccessibility } from "@/components/AccessibilityContext";
import { InlineText } from "@/components/editor";

interface Node {
  id: string;
  x: number;
  y: number;
  layer: "input" | "hidden1" | "hidden2" | "output";
  activation: number;
}

interface Connection {
  from: string;
  to: string;
  weight: number;
}

export default function AiSolutionsPage() {
  const { playAudio, performanceMode } = useAccessibility();
  const [loading, setLoading] = useState(true);
  const netCanvasRef = useRef<HTMLCanvasElement>(null);

  // Parameter states
  const [learningRate, setLearningRate] = useState(0.01);
  const [epoch, setEpoch] = useState(1482);
  const [accuracy, setAccuracy] = useState(98.42);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  
  // Custom training parameters
  const [inputCount, setInputCount] = useState(4);
  const [hiddenCount, setHiddenCount] = useState(5);
  const [outputCount, setOutputCount] = useState(3);
  const [isTraining, setIsTraining] = useState(true);

  // Pulse signals
  const [signals, setSignals] = useState<{ fromX: number; fromY: number; toX: number; toY: number; progress: number; speed: number; color: string }[]>([]);

  useEffect(() => {
    if (loading) return;

    // Build the neural structure based on inputs
    const newNodes: Node[] = [];
    const newConns: Connection[] = [];
    let idCounter = 0;

    const createLayer = (count: number, layerName: "input" | "hidden1" | "hidden2" | "output", xPos: number) => {
      const step = 300 / (count + 1);
      for (let i = 0; i < count; i++) {
        newNodes.push({
          id: `${layerName}_${i}`,
          x: xPos,
          y: step * (i + 1),
          layer: layerName,
          activation: Math.random()
        });
      }
    };

    createLayer(inputCount, "input", 80);
    createLayer(hiddenCount, "hidden1", 240);
    createLayer(hiddenCount - 1 > 0 ? hiddenCount - 1 : 2, "hidden2", 400);
    createLayer(outputCount, "output", 560);

    // Build fully connected layers
    const connectLayers = (layerA: string, layerB: string) => {
      const nodesA = newNodes.filter(n => n.layer === layerA);
      const nodesB = newNodes.filter(n => n.layer === layerB);

      nodesA.forEach((na) => {
        nodesB.forEach((nb) => {
          newConns.push({
            from: na.id,
            to: nb.id,
            weight: Math.random() * 2 - 1
          });
        });
      });
    };

    connectLayers("input", "hidden1");
    connectLayers("hidden1", "hidden2");
    connectLayers("hidden2", "output");

    setNodes(newNodes);
    setConnections(newConns);

    // Training interval loop
    const trainingTimer = setInterval(() => {
      if (isTraining) {
        setEpoch((prev) => prev + 1);
        setAccuracy((prev) => {
          const next = prev + (Math.random() * 0.02 - 0.008);
          return Math.min(Math.max(next, 95), 99.85);
        });

        // Trigger random signal wave
        const triggerRandNodeIdx = Math.floor(Math.random() * inputCount);
        fireSignal(`input_${triggerRandNodeIdx}`);
      }
    }, 1500);

    return () => clearInterval(trainingTimer);
  }, [loading, inputCount, hiddenCount, outputCount, isTraining]);

  // Main Canvas render loop for the Neural Net
  useEffect(() => {
    if (loading || performanceMode === "lite") return;
    const canvas = netCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrameId: number;

    const drawNetwork = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw Connection lines (synapses)
      connections.forEach((conn) => {
        const fromNode = nodes.find(n => n.id === conn.from);
        const toNode = nodes.find(n => n.id === conn.to);
        if (!fromNode || !toNode) return;

        ctx.strokeStyle = conn.weight > 0 ? "rgba(168, 85, 247, 0.15)" : "rgba(20, 184, 166, 0.15)";
        ctx.lineWidth = Math.abs(conn.weight) * 2;
        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(toNode.x, toNode.y);
        ctx.stroke();
      });

      // Animate Signals
      setSignals((prev) => {
        const updated = prev.map((sig) => ({
          ...sig,
          progress: sig.progress + sig.speed
        })).filter(sig => sig.progress < 1);

        updated.forEach((sig) => {
          const x = sig.fromX + (sig.toX - sig.fromX) * sig.progress;
          const y = sig.fromY + (sig.toY - sig.fromY) * sig.progress;
          ctx.fillStyle = sig.color;
          ctx.beginPath();
          ctx.arc(x, y, 3, 0, Math.PI * 2);
          ctx.fill();
        });

        return updated;
      });

      // Draw Nodes (Neurons)
      nodes.forEach((node) => {
        // Outer glowing ring
        ctx.fillStyle = node.layer === "input" ? "rgba(20, 184, 166, 0.05)" : "rgba(168, 85, 247, 0.05)";
        ctx.beginPath();
        ctx.arc(node.x, node.y, 16, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = node.layer === "input" ? "rgba(20, 184, 166, 0.3)" : "rgba(168, 85, 247, 0.3)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 8, 0, Math.PI * 2);
        ctx.stroke();

        // Inner core
        ctx.fillStyle = node.layer === "input" ? "#14b8a6" : "#a855f7";
        ctx.beginPath();
        ctx.arc(node.x, node.y, 3.5, 0, Math.PI * 2);
        ctx.fill();
      });

      animFrameId = requestAnimationFrame(drawNetwork);
    };

    drawNetwork();

    return () => cancelAnimationFrame(animFrameId);
  }, [loading, nodes, connections, performanceMode]);

  // Recursively fire synapses from input to hidden to output
  const fireSignal = (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    // Find outgoing connections
    const outgoing = connections.filter(c => c.from === nodeId);
    
    outgoing.forEach((conn) => {
      const targetNode = nodes.find(n => n.id === conn.to);
      if (!targetNode) return;

      const sigColor = node.layer === "input" ? "#14b8a6" : "#a855f7";
      setSignals((prev) => [
        ...prev,
        {
          fromX: node.x,
          fromY: node.y,
          toX: targetNode.x,
          toY: targetNode.y,
          progress: 0,
          speed: 0.03 + Math.random() * 0.02,
          color: sigColor
        }
      ]);

      // Propagate downstream after delay
      setTimeout(() => {
        if (targetNode.layer !== "output") {
          fireSignal(targetNode.id);
        }
      }, 400);
    });
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = netCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Find if clicked near any node
    const clickedNode = nodes.find((node) => {
      const dist = Math.sqrt((node.x - clickX) ** 2 + (node.y - clickY) ** 2);
      return dist < 20;
    });

    if (clickedNode) {
      playAudio("click");
      fireSignal(clickedNode.id);
    }
  };

  if (loading) {
    return <AiSolutionsLoader onComplete={() => setLoading(false)} duration={2000} />;
  }

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col font-mono selection:bg-purple-500/30">
      {/* Header */}
      <header className="border-b border-purple-500/20 bg-zinc-950/60 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center backdrop-blur-md">
        <div>
          <span className="text-[10px] font-bold text-purple-500 tracking-widest uppercase">KLOUDERA TECHNOLOGIES // COGNITIVE WING</span>
          <InlineText as="h1" className="text-xl font-bold tracking-widest text-white uppercase mt-1 glow-text-purple" path={["services", "ai-solutions", "title"]} fallback="NEURAL COMPUTATION LAB" />
        </div>

        <div className="flex gap-4 mt-4 sm:mt-0 items-center">
          <div className="text-right">
            <span className="text-[9px] text-zinc-500 block">MODEL_ACCURACY</span>
            <span className="text-xs text-purple-400 font-bold">{accuracy.toFixed(4)}% accuracy</span>
          </div>
          <button
            onClick={() => window.location.href = "/"}
            className="px-4 py-1.5 border border-purple-500/30 text-purple-400 text-[10px] tracking-wider rounded hover:bg-purple-500/10 cursor-none transition-all"
          >
            DISCONNECT
          </button>
        </div>
      </header>

      {/* Main Grid */}
      <div className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-7xl mx-auto w-full">
        {/* Left Column: Model Parameters */}
        <div className="lg:col-span-1 space-y-6">
          <div className="cyber-panel-purple p-5 rounded-lg border border-purple-500/20">
            <h2 className="text-[11px] font-bold tracking-widest text-purple-500/70 border-b border-purple-500/10 pb-2 uppercase mb-4">
              HYPERPARAMETERS
            </h2>

            {/* Inputs controls */}
            <div className="space-y-4 text-[10px]">
              <div>
                <label className="block text-zinc-400 mb-1">LEARNING RATE: {learningRate}</label>
                <input
                  type="range"
                  min="0.001"
                  max="0.1"
                  step="0.005"
                  value={learningRate}
                  onChange={(e) => { setLearningRate(parseFloat(e.target.value)); playAudio("click"); }}
                  className="w-full h-1 bg-zinc-800 rounded outline-none appearance-none accent-purple-500 cursor-none"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">INPUT NEURONS: {inputCount}</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setInputCount(prev => Math.max(prev - 1, 2)); playAudio("click"); }}
                    className="flex-1 bg-zinc-900 border border-purple-500/10 hover:border-purple-500/30 text-xs py-1 rounded text-purple-400 cursor-none"
                  >
                    -
                  </button>
                  <button
                    onClick={() => { setInputCount(prev => Math.min(prev + 1, 6)); playAudio("click"); }}
                    className="flex-1 bg-zinc-900 border border-purple-500/10 hover:border-purple-500/30 text-xs py-1 rounded text-purple-400 cursor-none"
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">HIDDEN NEURONS: {hiddenCount}</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setHiddenCount(prev => Math.max(prev - 1, 2)); playAudio("click"); }}
                    className="flex-1 bg-zinc-900 border border-purple-500/10 hover:border-purple-500/30 text-xs py-1 rounded text-purple-400 cursor-none"
                  >
                    -
                  </button>
                  <button
                    onClick={() => { setHiddenCount(prev => Math.min(prev + 1, 7)); playAudio("click"); }}
                    className="flex-1 bg-zinc-900 border border-purple-500/10 hover:border-purple-500/30 text-xs py-1 rounded text-purple-400 cursor-none"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="pt-2 border-t border-purple-500/10">
                <button
                  onClick={() => { setIsTraining(!isTraining); playAudio("click"); }}
                  className={`w-full py-2 rounded text-xs font-bold uppercase tracking-wider transition-all cursor-none ${
                    isTraining
                      ? "bg-purple-600 hover:bg-purple-500 text-black shadow-[0_0_12px_rgba(168,85,247,0.3)]"
                      : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200"
                  }`}
                >
                  {isTraining ? "PAUSE PIPELINE TRAINING" : "RESUME MODEL TRAINING"}
                </button>
              </div>
            </div>
          </div>

          {/* Model telemetry stats */}
          <div className="cyber-panel-purple p-5 rounded-lg border border-purple-500/20 text-[10px] leading-relaxed">
            <h2 className="text-[11px] font-bold tracking-widest text-purple-500/70 border-b border-purple-500/10 pb-2 uppercase mb-3">
              TRAINING STATS
            </h2>
            <div className="space-y-1.5 text-zinc-400">
              <div className="flex justify-between">
                <span>EPOCHS COMPLETE:</span>
                <span className="text-purple-400 font-bold">{epoch}</span>
              </div>
              <div className="flex justify-between">
                <span>BATCH LOSS:</span>
                <span className="text-teal-400 font-mono">0.00{(100 - accuracy).toFixed(2)}2</span>
              </div>
              <div className="flex justify-between">
                <span>CUDA CORES ENGAGED:</span>
                <span className="text-white">16,384 TENSORS</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center Canvas Workspace */}
        <div className="lg:col-span-3 space-y-6 flex flex-col">
          {/* Diagnostic header cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="cyber-panel-purple p-4 rounded-lg border border-purple-500/20 flex flex-col items-center">
              <span className="text-[9px] text-zinc-500 uppercase">BATCH SIZE</span>
              <span className="text-xl font-bold text-white mt-1">512 NODES</span>
            </div>
            <div className="cyber-panel-purple p-4 rounded-lg border border-purple-500/20 flex flex-col items-center">
              <span className="text-[9px] text-zinc-500 uppercase">FLOPS CAP</span>
              <span className="text-xl font-bold text-purple-400 mt-1">2.4 PETAFLOPS</span>
            </div>
            <div className="cyber-panel-purple p-4 rounded-lg border border-purple-500/20 flex flex-col items-center">
              <span className="text-[9px] text-zinc-500 uppercase">VECTOR SHARDS</span>
              <span className="text-xl font-bold text-purple-400 mt-1">1,024 REGISTERS</span>
            </div>
          </div>

          {/* Interactive Neural Net Canvas */}
          <div className="cyber-panel-purple p-5 rounded-lg border border-purple-500/20 flex-1 min-h-[300px] flex flex-col relative overflow-hidden bg-black/40">
            <div className="absolute top-4 left-4 z-10 flex gap-2">
              <span className="text-[9px] font-bold text-purple-400 tracking-widest uppercase bg-black/80 px-2 py-1 rounded border border-purple-500/10">
                INTERACTIVE NEURAL NETWORK GRAPH
              </span>
              <span className="text-[8px] text-zinc-500 font-mono bg-black/80 px-2 py-1 rounded border border-purple-500/5">
                CLICK NEURONS TO INJECT SIGNAL
              </span>
            </div>
            {performanceMode === "lite" ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center text-zinc-500 p-6">
                <svg className="h-10 w-10 text-purple-500/40 animate-pulse mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <p className="text-[10px] uppercase tracking-wide">WebGL neural graph deactivated in Lite mode.</p>
                <p className="text-[9px] text-zinc-600 mt-1">Modify HQ Settings to view interactive canvas nodes.</p>
              </div>
            ) : (
              <canvas
                ref={netCanvasRef}
                onClick={handleCanvasClick}
                width={640}
                height={300}
                className="flex-1 w-full h-full block rounded"
              />
            )}
          </div>

          {/* AI Pipeline Flowchart */}
          <div className="cyber-panel-purple p-5 rounded-lg border border-purple-500/20 min-h-[160px] flex flex-col justify-between">
            <h2 className="text-[11px] font-bold tracking-widest text-purple-500/70 border-b border-purple-500/10 pb-2 uppercase mb-4">
              AI SOLUTION PROCESS PIPELINE
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-center">
              {[
                { step: "01", name: "DATA SHARDING", desc: "Extracting corporate pdf/text logs." },
                { step: "02", name: "EMBEDDING ENGINE", desc: "Generating high-dimension vector floats." },
                { step: "03", name: "VECTOR DATABASE", desc: "Storing indexes in high-speed cache arrays." },
                { step: "04", name: "RAG KNOWLEDGE", desc: "Merging retrieval documents with system context." },
                { step: "05", name: "AGENT ROUTING", desc: "Validating safe, compiled response loops." }
              ].map((pipe, idx) => (
                <div key={idx} className="p-3 bg-black/40 border border-purple-500/5 rounded relative flex flex-col justify-between min-h-[88px]">
                  <div>
                    <span className="block text-[8px] font-bold text-purple-400">{pipe.step} // <InlineText as="span" path={["services", "ai-solutions", "pipeline", String(idx), "name"]} fallback={pipe.name} /></span>
                    <InlineText as="p" multiline className="text-[8px] text-zinc-500 mt-1 leading-normal" path={["services", "ai-solutions", "pipeline", String(idx), "desc"]} fallback={pipe.desc} />
                  </div>
                  {idx < 4 && (
                    <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-1.5 z-10 text-purple-500/40 font-bold">
                      &gt;
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
