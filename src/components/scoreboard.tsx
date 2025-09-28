'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AnimatedCounter } from './animated-counter';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';

interface ScoreboardProps {
  totalPledges: number;
}

export function Scoreboard({ totalPledges }: ScoreboardProps) {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-white/10 transition-all duration-500 hover:bg-card/70">
      <CardHeader>
        <CardTitle className="font-headline text-3xl sm:text-5xl">Live Pledges</CardTitle>
        <CardDescription>
          See the impact of your pledges in real-time!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col lg:flex-row justify-center items-center text-center gap-8 lg:gap-16 p-4">
          <div className='flex flex-col items-center'>
            <p className="text-xl font-medium text-muted-foreground mb-2 sm:mb-4">
              Total Pledges
            </p>
            <AnimatedCounter 
              value={totalPledges}
              className="font-mono text-8xl sm:text-9xl md:text-[12rem] lg:text-[16rem] leading-none font-bold text-white tracking-tighter"
              style={{ textShadow: '0 0 10px rgba(255, 255, 255, 0.3), 0 0 25px rgba(255, 255, 255, 0.5)' }}
            />
          </div>
          <Separator orientation='vertical' className="hidden lg:block h-32 lg:h-64 bg-white/20" />
          <Separator orientation='horizontal' className="lg:hidden w-3/4 mx-auto bg-white/20" />
          <div className="flex flex-col items-center gap-2 sm:gap-4">
            <a href='https://me-qr.com' target='_blank' rel='noopener noreferrer' style={{border:'0', cursor:'pointer', display:'block'}}>
              <Image 
                src='https://storage2.me-qr.com/qr/255576515.png?v=1759054820' 
                alt='QR code for Udgaar' 
                width={200} 
                height={200}
                className="rounded-md border-4 border-white shadow-lg w-[150px] h-[150px] sm:w-[200px] sm:h-[200px] lg:w-[320px] lg:h-[320px]"
              />
            </a>
            <p className="text-white text-lg sm:text-xl mt-2">Scan to Register</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
