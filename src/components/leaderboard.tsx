'use client';

import { useMemo, useState, useEffect } from 'react';
import type { Pledge } from '@/lib/types';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Sparkles, Download, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import * as XLSX from 'xlsx';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from './ui/input';
import { useToast } from '@/hooks/use-toast';
import { verifyPasswordAction } from '@/lib/actions';

interface LeaderboardProps {
  pledges: Pledge[];
  onClear: (password: string) => Promise<boolean>;
}

type ActionType = 'download' | 'clear';

export function Leaderboard({ pledges, onClear }: LeaderboardProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [password, setPassword] = useState('');
  const [actionType, setActionType] = useState<ActionType | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const topPledges = useMemo(() => {
    if (!isMounted) return [];
    return [...pledges]
      .sort((a, b) => {
        if (b.count !== a.count) {
          return b.count - a.count;
        }
        return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      });
  }, [pledges, isMounted]);

  const handleDownload = () => {
    const ws = XLSX.utils.json_to_sheet(
      topPledges.map((p, i) => ({
        Rank: i + 1,
        'Pledger Name': p.name,
        Facilitator: p.facilitator,
        Count: p.count,
        Timestamp: new Date(p.timestamp).toLocaleString(),
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Pledge Records');
    XLSX.writeFile(wb, 'pledge-records.xlsx');
    toast({ title: 'Success', description: 'Pledge records have been downloaded.' });
  };
  
  const handleAction = async () => {
    if (!actionType) return;
    setIsVerifying(true);
    const result = await verifyPasswordAction(password);
    setIsVerifying(false);

    if (result.success) {
      if (actionType === 'download') {
        handleDownload();
      } else if (actionType === 'clear') {
        const clearResult = await onClear(password);
        if(!clearResult) {
            setPassword('');
            return;
        }
      }
      setPassword('');
      document.getElementById('alert-dialog-cancel')?.click();

    } else {
      toast({
        title: 'Error',
        description: result.error,
        variant: 'destructive',
      });
      setPassword('');
    }
  };


  if (!isMounted) {
    return (
       <Card className="bg-card/50 backdrop-blur-sm border-white/10 transition-all duration-500 hover:bg-card/70">
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            Pledge Record
          </CardTitle>
        </CardHeader>
        <CardContent>
           <div className="text-center text-muted-foreground py-8">
              <p>Loading pledge records...</p>
            </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <AlertDialog>
        <Card className="bg-card/50 backdrop-blur-sm border-white/10 transition-all duration-500 hover:bg-card/70">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-headline text-2xl flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-primary" />
                Pledge Record
            </CardTitle>
            <div className='flex gap-2'>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => setActionType('download')} disabled={pledges.length === 0}>
                    <Download className="h-5 w-5" />
                    <span className="sr-only">Download</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="icon" onClick={() => setActionType('clear')} disabled={pledges.length === 0}>
                    <Trash2 className="h-5 w-5" />
                    <span className="sr-only">Clear Records</span>
                </Button>
              </AlertDialogTrigger>
            </div>
          </CardHeader>
          <CardContent>
            {pledges.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10">
                    <TableHead>Rank</TableHead>
                    <TableHead>Pledger Name</TableHead>
                    <TableHead>Facilitator</TableHead>
                    <TableHead className="text-right">Count</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topPledges.map((pledge, index) => (
                    <TableRow key={pledge.id} className="border-white/10">
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell className="font-medium">{pledge.name}</TableCell>
                      <TableCell>{pledge.facilitator}</TableCell>
                      <TableCell className="text-right font-mono text-lg">
                        {pledge.count.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <p>Pledges are coming in...</p>
                <p>The leaderboard will appear here!</p>
              </div>
            )}
          </CardContent>
        </Card>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Authentication Required</AlertDialogTitle>
            <AlertDialogDescription>
              To {actionType}, please enter the password.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Input 
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAction()}
          />
          <AlertDialogFooter>
            <AlertDialogCancel id="alert-dialog-cancel" onClick={() => setPassword('')}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleAction} disabled={isVerifying || !password}>
              {isVerifying ? 'Verifying...' : 'Proceed'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
