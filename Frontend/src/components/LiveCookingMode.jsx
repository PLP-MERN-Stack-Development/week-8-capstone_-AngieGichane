import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, SkipForward, SkipBack, Mic, MicOff, Check, Timer } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const LiveCookingMode = ({ recipe, onExit }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [completedSteps, setCompletedSteps] = useState(
    new Array(recipe.instructions.length).fill(false)
  );
  const recognitionRef = useRef(null);
  const { toast } = useToast();

  const cookingSteps = recipe.instructions.map((instruction, index) => ({
    id: `step-${index}`,
    instruction,
    duration: estimateStepDuration(instruction),
    completed: completedSteps[index]
  }));

  function estimateStepDuration(instruction) {
    const lowerInstruction = instruction.toLowerCase();
    if (lowerInstruction.includes('bake') || lowerInstruction.includes('roast')) return 30;
    if (lowerInstruction.includes('simmer') || lowerInstruction.includes('cook')) return 15;
    if (lowerInstruction.includes('heat') || lowerInstruction.includes('fry')) return 10;
    if (lowerInstruction.includes('mix') || lowerInstruction.includes('combine')) return 3;
    if (lowerInstruction.includes('chop') || lowerInstruction.includes('slice')) return 5;
    return 5;
  }

  useEffect(() => {
    let interval;
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer(timer => {
          if (timer <= 1) {
            setIsTimerRunning(false);
            toast({
              title: "Timer finished!",
              description: `Step ${currentStep + 1} timer completed`,
            });
            return 0;
          }
          return timer - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timer, currentStep, toast]);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event) => {
        const last = event.results.length - 1;
        const command = event.results[last][0].transcript.toLowerCase();
        handleVoiceCommand(command);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
        toast({
          title: "Voice recognition error",
          description: "Please try again or use manual controls",
          variant: "destructive"
        });
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const handleVoiceCommand = (command) => {
    if (command.includes('next') || command.includes('continue')) {
      nextStep();
    } else if (command.includes('previous') || command.includes('back')) {
      previousStep();
    } else if (command.includes('start timer')) {
      startTimer();
    } else if (command.includes('stop timer') || command.includes('pause timer')) {
      setIsTimerRunning(false);
    } else if (command.includes('complete') || command.includes('done')) {
      markStepComplete();
    } else if (command.includes('repeat')) {
      speakCurrentStep();
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const speakCurrentStep = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(
        `Step ${currentStep + 1}: ${cookingSteps[currentStep].instruction}`
      );
      speechSynthesis.speak(utterance);
    }
  };

  const nextStep = () => {
    if (currentStep < cookingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      setTimer(0);
      setIsTimerRunning(false);
      speakCurrentStep();
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setTimer(0);
      setIsTimerRunning(false);
      speakCurrentStep();
    }
  };

  const startTimer = () => {
    const duration = cookingSteps[currentStep].duration;
    if (duration) {
      setTimer(duration * 60);
      setIsTimerRunning(true);
    }
  };

  const markStepComplete = () => {
    const newCompletedSteps = [...completedSteps];
    newCompletedSteps[currentStep] = true;
    setCompletedSteps(newCompletedSteps);
    
    if (currentStep < cookingSteps.length - 1) {
      nextStep();
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((currentStep + 1) / cookingSteps.length) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Live Cooking Mode</h1>
          <p className="text-muted-foreground">{recipe.title}</p>
        </div>
        <Button variant="outline" onClick={onExit}>
          Exit Cooking Mode
        </Button>
      </div>

      <Card className="bg-gradient-card border-border/50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">
              Step {currentStep + 1} of {cookingSteps.length}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="w-full" />
        </CardContent>
      </Card>

      <Card className="bg-gradient-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Step {currentStep + 1}
            {completedSteps[currentStep] && (
              <Badge variant="default" className="bg-green-500">
                <Check className="w-3 h-3 mr-1" />
                Complete
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg text-foreground">
            {cookingSteps[currentStep].instruction}
          </p>
          
          {cookingSteps[currentStep].duration && (
            <div className="flex items-center gap-4 p-4 bg-background/50 rounded-lg">
              <Timer className="w-5 h-5 text-muted-foreground" />
              <span className="font-mono text-lg">
                {timer > 0 ? formatTime(timer) : `${cookingSteps[currentStep].duration}:00`}
              </span>
              <Button
                variant={isTimerRunning ? "secondary" : "default"}
                size="sm"
                onClick={() => isTimerRunning ? setIsTimerRunning(false) : startTimer()}
              >
                {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isTimerRunning ? 'Pause' : 'Start Timer'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-4 justify-center">
        <Button
          variant="outline"
          onClick={previousStep}
          disabled={currentStep === 0}
        >
          <SkipBack className="w-4 h-4 mr-2" />
          Previous
        </Button>
        
        <Button
          variant="outline"
          onClick={markStepComplete}
          disabled={completedSteps[currentStep]}
        >
          <Check className="w-4 h-4 mr-2" />
          Mark Complete
        </Button>
        
        <Button
          variant="outline"
          onClick={nextStep}
          disabled={currentStep === cookingSteps.length - 1}
        >
          Next
          <SkipForward className="w-4 h-4 ml-2" />
        </Button>
        
        <Button
          variant={isListening ? "destructive" : "secondary"}
          onClick={toggleListening}
        >
          {isListening ? <MicOff className="w-4 h-4 mr-2" /> : <Mic className="w-4 h-4 mr-2" />}
          {isListening ? 'Stop Voice' : 'Voice Commands'}
        </Button>
        
        <Button variant="ghost" onClick={speakCurrentStep}>
          🔊 Read Step
        </Button>
      </div>

      <Card className="bg-background/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-sm">Voice Commands</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs text-muted-foreground">
            <span>"Next" - Next step</span>
            <span>"Previous" - Previous step</span>
            <span>"Start timer" - Start timer</span>
            <span>"Stop timer" - Stop timer</span>
            <span>"Complete" - Mark step done</span>
            <span>"Repeat" - Read current step</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};