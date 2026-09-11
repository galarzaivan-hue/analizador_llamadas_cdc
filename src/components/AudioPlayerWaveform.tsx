import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, RotateCcw, FastForward, Activity } from "lucide-react";

interface AudioPlayerWaveformProps {
  audioUrl?: string | null;
  durationSeconds?: number;
  fileName?: string;
}

export const AudioPlayerWaveform: React.FC<AudioPlayerWaveformProps> = ({
  audioUrl,
  durationSeconds = 60,
  fileName = "Llamada_Operativa_SEP.mp3",
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Generate synthetic waveform height bars for visual representation
  const [barHeights] = useState<number[]>(() => {
    const bars: number[] = [];
    for (let i = 0; i < 70; i++) {
      // Create realistic speech pattern waveform (peaks and quiet gaps)
      const isGap = i % 12 === 0 || i % 17 === 0;
      const height = isGap ? Math.random() * 15 + 5 : Math.random() * 70 + 25;
      bars.push(height);
    }
    return bars;
  });

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= durationSeconds) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 0.2;
        });
      }, 200);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying, durationSeconds]);

  const handleTogglePlay = () => {
    if (audioRef.current && audioUrl) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(() => {});
      }
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const progressPercent = Math.min(100, (currentTime / (durationSeconds || 1)) * 100);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg mb-6">
      <audio
        ref={audioRef}
        src={audioUrl || undefined}
        onTimeUpdate={() => {
          if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
          }
        }}
        onEnded={() => {
          setIsPlaying(false);
          setCurrentTime(0);
        }}
      />

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-blue-600/20 text-blue-400 rounded-md">
            <Activity className="w-4 h-4 animate-pulse" />
          </div>
          <span className="text-xs font-semibold text-slate-200 truncate max-w-xs sm:max-w-md">
            {fileName}
          </span>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
          <span className="text-blue-400 font-bold">{formatTime(currentTime)}</span>
          <span>/</span>
          <span>{formatTime(durationSeconds)}</span>
        </div>
      </div>

      {/* Waveform Visualization Canvas */}
      <div className="relative h-16 bg-slate-950/90 rounded-lg p-2 border border-slate-800/80 flex items-center justify-between gap-1 overflow-hidden">
        {barHeights.map((height, idx) => {
          const barProgress = (idx / barHeights.length) * 100;
          const isPassed = barProgress <= progressPercent;

          return (
            <div
              key={idx}
              onClick={() => {
                const targetTime = (idx / barHeights.length) * durationSeconds;
                setCurrentTime(targetTime);
                if (audioRef.current) audioRef.current.currentTime = targetTime;
              }}
              style={{
                height: `${height}%`,
              }}
              className={`flex-1 rounded-full cursor-pointer transition-all duration-150 hover:bg-blue-400 ${
                isPassed
                  ? "bg-blue-500 shadow-sm shadow-blue-500/50"
                  : "bg-slate-700/60"
              }`}
            />
          );
        })}

        {/* Progress Line Indicator */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-amber-400 shadow-md shadow-amber-400/80 pointer-events-none transition-all duration-75"
          style={{ left: `${progressPercent}%` }}
        />
      </div>

      {/* Scrub Bar & Controls */}
      <div className="mt-3 flex items-center justify-between gap-4 text-xs">
        {/* Play / Pause / Rewind Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              setCurrentTime(0);
              if (audioRef.current) audioRef.current.currentTime = 0;
            }}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            title="Reiniciar audio"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={handleTogglePlay}
            className="p-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-full transition shadow-md shadow-blue-900/40"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current ml-0.5" />
            )}
          </button>

          <button
            onClick={() => {
              const rates = [0.75, 1, 1.25, 1.5];
              const nextIndex = (rates.indexOf(playbackRate) + 1) % rates.length;
              setPlaybackRate(rates[nextIndex]);
            }}
            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-mono text-[11px]"
            title="Velocidad de reproducción"
          >
            {playbackRate}x
          </button>
        </div>

        {/* Timeline Slider */}
        <div className="flex-1">
          <input
            type="range"
            min={0}
            max={durationSeconds || 1}
            step={0.1}
            value={currentTime}
            onChange={handleSeek}
            className="w-full accent-blue-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
          />
        </div>

        {/* Volume Mute Toggle */}
        <button
          onClick={() => {
            if (audioRef.current) {
              audioRef.current.muted = !isMuted;
            }
            setIsMuted(!isMuted);
          }}
          className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
