'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AnimatedCounter } from './animated-counter';

interface ScoreboardProps {
  totalPledges: number;
}

export function Scoreboard({ totalPledges }: ScoreboardProps) {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-white/10 transition-all duration-500 hover:bg-card/70">
      <CardHeader>
        <CardTitle className="font-headline text-5xl">Live Pledges</CardTitle>
        <CardDescription>
          See the impact of your pledges in real-time!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <p className="text-sm font-medium text-muted-foreground">
            Total Pledges
          </p>
          <AnimatedCounter 
            value={totalPledges}
            className="font-mono text-[10rem] leading-none font-bold text-white tracking-tighter"
            style={{ textShadow: '0 0 10px rgba(255, 255, 255, 0.3)' }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
