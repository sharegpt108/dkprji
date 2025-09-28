'use client';

import { useState, useEffect } from 'react';
import type { Pledge } from '@/lib/types';
import { PledgeForm } from '@/components/pledge-form';
import { Scoreboard } from '@/components/scoreboard';
import { Leaderboard } from '@/components/leaderboard';
import { placeholderImages } from '@/lib/placeholder-images.json';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Handshake } from 'lucide-react';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { database } from '@/lib/firebase';
import { ref, set, onValue, push, remove } from 'firebase/database';
import { clearPledgesAction } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';


export default function Home() {
  const [pledges, setPledges] = useState<Pledge[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [isPledgeFormOpen, setIsPledgeFormOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    setIsPledgeFormOpen(true);
    const pledgesRef = ref(database, 'pledges');
    const unsubscribe = onValue(pledgesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const pledgesList: Pledge[] = Object.keys(data).map(key => ({
          id: key,
          ...data[key],
          timestamp: new Date(data[key].timestamp)
        }));
        setPledges(pledgesList);
      } else {
        setPledges([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const addPledge = (pledge: Omit<Pledge, 'id' | 'timestamp'>) => {
    const newPledgeRef = push(ref(database, 'pledges'));
    const newPledge: Omit<Pledge, 'id'> = {
      ...pledge,
      timestamp: new Date().toISOString(),
    };
    set(newPledgeRef, newPledge);
    setIsPledgeFormOpen(false);
  };
  
  const handleClearPledges = async (password: string) => {
    const result = await clearPledgesAction(password);
    if (result.success) {
      toast({
        title: 'Success',
        description: 'Pledge records have been cleared.',
      });
      return true;
    } else {
      toast({
        title: 'Error',
        description: result.error,
        variant: 'destructive',
      });
      return false;
    }
  };


  const totalPledges = pledges.reduce((sum, p) => sum + p.count, 0);

  return (
    <div
      className="flex min-h-screen flex-col bg-cover bg-center bg-fixed transition-all duration-500"
      style={{
        backgroundImage: `linear-gradient(rgba(44, 62, 80, 0.3), rgba(44, 62, 80, 0.3)), url(/maxresdefault.jpg)`,
      }}
    >
      <header className="container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Image
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOBf_MsmDQGH4XiE4uE_Ms8WOy742dwPvhmA&s"
            alt="Udgaar Logo"
            width={64}
            height={64}
            className="rounded-full border-2 border-white shadow-lg object-cover"
          />
        </div>
        <div className="text-center">
          <h1 className="font-headline text-5xl font-bold tracking-tight text-white md:text-6xl">
            UDGAAR Live Pledge
          </h1>
          <p className="mt-2 text-lg text-primary-foreground/80">
            Join the Movement, Pledge Now
          </p>
        </div>
        <div>
           <Image
            src="https://yt3.googleusercontent.com/Opk8F8nCjIbNo-8tKi2rJugBYUwqwvnc-adshczH16Px6DSgOMEpc49PFPEF-siSToskEBWC2dE=s900-c-k-c0x00ffffff-no-rj"
            alt="Iskcon Logo"
            width={64}
            height={64}
            className="rounded-full border-2 border-white shadow-lg object-cover"
          />
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-8">
          <div className="lg:col-span-1">
            <Leaderboard pledges={pledges} onClear={handleClearPledges} />
          </div>
          <div className="lg:col-span-2 flex flex-col gap-8">
            <Scoreboard totalPledges={totalPledges} />
            
            {isClient && (
              <Dialog open={isPledgeFormOpen} onOpenChange={setIsPledgeFormOpen}>
                <DialogTrigger asChild>
                  <div className="w-full max-w-lg mx-auto">
                    <Card className="bg-card/50 backdrop-blur-sm border-white/10">
                      <div className="p-12 flex justify-center">
                        <Button
                          size="lg"
                          className="bg-accent hover:bg-accent/90 text-accent-foreground text-xl py-8 px-10"
                        >
                          <Handshake className="mr-4 h-8 w-8" />
                          Make a Pledge
                        </Button>
                      </div>
                    </Card>
                  </div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] bg-card/50 backdrop-blur-sm border-white/10">
                    <DialogHeader>
                      <DialogTitle className="font-headline text-2xl">Make a Pledge</DialogTitle>
                      <DialogDescription>
                        Your contribution makes a difference.
                      </DialogDescription>
                    </DialogHeader>
                    <PledgeForm addPledge={addPledge} />
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-white/50">
        <Separator className="my-4 bg-white/10" />
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center gap-4">
            {isClient && (
              <p>Udgaar Festival &copy; {new Date().getFullYear()}</p>
            )}
            <p>Contact: info@udgaar.com</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
