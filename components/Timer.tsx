"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button'; // Assuming shadcn/ui button path
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Assuming shadcn/ui card path
import { Progress } from '@/components/ui/progress'; // Assuming shadcn/ui progress path

const Timer = () => {
  const initialTime = 30;
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!isActive || timeLeft === 0) return;

    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [isActive, timeLeft]);

  const handleStart = () => {
    setIsActive(true);
    setTimeLeft(initialTime); // Reset time on start
  };

  const progressValue = (timeLeft / initialTime) * 100;

  return (
    <Card className="w-fit mx-auto">
      <CardHeader>
        <CardTitle>Timer</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <motion.div
          key={timeLeft}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold"
        >
          {timeLeft}
        </motion.div>
        <Progress value={progressValue} className="w-full" />
        {!isActive || timeLeft === 0 ? (
          <Button onClick={handleStart}>
            {timeLeft === 0 ? 'Restart Timer' : 'Start Timer'}
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default Timer;
