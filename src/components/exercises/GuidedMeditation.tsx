import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Brain, Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';

const meditations = [
  {
    id: 'mindful-breathing',
    title: 'Mindful Breathing',
    description: 'Focus on breath to find calm and presence',
    duration: 300, // 5 minutes
    audioUrl: '/meditations/mindful-breathing.mp3'
  },
  {
    id: 'body-scan',
    title: 'Body Scan',
    description: 'Relax through progressive body awareness',
    duration: 600, // 10 minutes
    audioUrl: '/meditations/body-scan.mp3'
  },
  {
    id: 'loving-kindness',
    title: 'Loving-Kindness',
    description: 'Cultivate compassion and inner peace',
    duration: 900, // 15 minutes
    audioUrl: '/meditations/loving-kindness.mp3'
  },
  {
    id: 'stress-relief',
    title: 'Stress Relief',
    description: 'Release tension and find mental clarity',
    duration: 480, // 8 minutes
    audioUrl: '/meditations/stress-relief.mp3'
  },
  {
    id: 'morning-energy',
    title: 'Morning Energy',
    description: 'Start your day with mindful vitality',
    duration: 420, // 7 minutes
    audioUrl: '/meditations/morning-energy.mp3'
  },
  {
    id: 'evening-calm',
    title: 'Evening Calm',
    description: 'Gentle practice for peaceful sleep',
    duration: 720, // 12 minutes
    audioUrl: '/meditations/evening-calm.mp3'
  },
  {
    id: 'gratitude',
    title: 'Gratitude Flow',
    description: 'Cultivate appreciation and joy',
    duration: 360, // 6 minutes
    audioUrl: '/meditations/gratitude.mp3'
  },
  {
    id: 'anxiety-ease',
    title: 'Anxiety Ease',
    description: 'Find relief from anxious thoughts',
    duration: 540, // 9 minutes
    audioUrl: '/meditations/anxiety-ease.mp3'
  },
  {
    id: 'focus-clarity',
    title: 'Focus & Clarity',
    description: 'Sharpen mind and concentration',
    duration: 450, // 7.5 minutes
    audioUrl: '/meditations/focus-clarity.mp3'
  }
];

export function GuidedMeditation() {
  const [selectedMeditation, setSelectedMeditation] = useState(meditations[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    if (!audioElement && !isPlaying) {
      const audio = new Audio(selectedMeditation.audioUrl);
      audio.volume = volume / 100;
      audio.addEventListener('timeupdate', () => {
        setProgress((audio.currentTime / selectedMeditation.duration) * 100);
      });
      audio.addEventListener('ended', () => {
        setIsPlaying(false);
        setProgress(0);
      });
      setAudioElement(audio);
      audio.play();
    } else if (audioElement) {
      if (isPlaying) {
        audioElement.pause();
      } else {
        audioElement.play();
      }
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
      setProgress(0);
      setIsPlaying(false);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (audioElement) {
      audioElement.volume = newVolume / 100;
    }
    if (newVolume === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (audioElement) {
      if (isMuted) {
        audioElement.volume = volume / 100;
      } else {
        audioElement.volume = 0;
      }
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="rounded-lg bg-primary/10 p-3 w-fit mx-auto mb-4">
          <Brain className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold mb-4 animate-text bg-gradient-to-r from-primary via-emerald-500 via-teal-400 to-primary bg-clip-text text-transparent bg-300%">
          Guided Meditation
        </h1>
        <p className="text-xl text-muted-foreground">
          Choose a meditation to begin your mindfulness journey.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {meditations.map((meditation, index) => (
          <motion.div
            key={meditation.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="h-full"
          >
            <Button
              variant={selectedMeditation.id === meditation.id ? "default" : "outline"}
              className="w-full min-h-[200px] p-6 flex flex-col items-center justify-between gap-3 relative"
              onClick={() => {
                if (audioElement) {
                  audioElement.pause();
                  setAudioElement(null);
                }
                setSelectedMeditation(meditation);
                setIsPlaying(false);
                setProgress(0);
              }}
            >
              <div className="space-y-3 text-center w-full">
                <div className="font-semibold text-lg">{meditation.title}</div>
                <div className={`text-sm break-words whitespace-normal overflow-hidden px-2 ${
                  selectedMeditation.id === meditation.id 
                    ? "text-foreground/90" 
                    : "text-muted-foreground"
                }`}>
                  {meditation.description}
                </div>
              </div>
              <div className={`text-sm ${
                selectedMeditation.id === meditation.id 
                  ? "text-foreground/90" 
                  : "text-muted-foreground"
              }`}>
                {formatTime(meditation.duration)}
              </div>
            </Button>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="rounded-lg bg-[#0a0a0a] border border-[#1a1a1a] p-6 md:p-8 mx-auto max-w-3xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold mb-2">{selectedMeditation.title}</h2>
          <p className="text-muted-foreground">{selectedMeditation.description}</p>
        </div>

        <Progress value={progress} className="mb-8" />

        <div className="flex flex-col items-center gap-6">
          <div className="text-2xl font-bold">
            {formatTime(Math.floor((selectedMeditation.duration * progress) / 100))} / {formatTime(selectedMeditation.duration)}
          </div>

          <div className="flex items-center gap-4">
            <Button
              size="lg"
              className="w-32"
              onClick={handlePlayPause}
            >
              {isPlaying ? (
                <>
                  <Pause className="mr-2 h-5 w-5" /> Pause
                </>
              ) : (
                <>
                  <Play className="mr-2 h-5 w-5" /> Start
                </>
              )}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-32"
              onClick={handleReset}
            >
              <RotateCcw className="mr-2 h-5 w-5" /> Reset
            </Button>
          </div>

          <div className="flex items-center gap-4 w-full max-w-md">
            <Button
              size="icon"
              variant="ghost"
              onClick={toggleMute}
            >
              {isMuted ? (
                <VolumeX className="h-5 w-5" />
              ) : (
                <Volume2 className="h-5 w-5" />
              )}
            </Button>
            <Slider
              value={[isMuted ? 0 : volume]}
              min={0}
              max={100}
              step={1}
              onValueChange={handleVolumeChange}
              className="flex-1"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
