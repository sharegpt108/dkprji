'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  CardContent
} from '@/components/ui/card';
import { facilitators } from '@/lib/data';
import type { Pledge } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Check, ChevronsUpDown, Send } from 'lucide-react';
import { useTransition, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { cn } from '@/lib/utils';


const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  mobile: z.string().regex(/^\d{10}$/, 'Please enter a valid 10-digit mobile number.'),
  facilitator: z.string().min(1, 'Please select a facilitator.'),
  count: z.coerce.number().int().positive('Pledge count must be a positive number.'),
});

interface PledgeFormProps {
  addPledge: (pledge: Omit<Pledge, 'id' | 'timestamp'>) => void;
}

export function PledgeForm({ addPledge }: PledgeFormProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      mobile: '',
      facilitator: '',
      count: 1,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(() => {
      addPledge(values);
      toast({
        title: 'Pledge Submitted! 🎉',
        description: `Thank you, ${values.name}, for your pledge of ${values.count}!`,
      });
      form.reset();
    });
  }

  return (
    <>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mobile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile Number</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="Enter your mobile number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="facilitator"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Facilitator Name</FormLabel>
                   <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? facilitators.find(
                                (facilitator) => facilitator === field.value
                              )
                            : "Select a facilitator"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height] p-0">
                      <Command>
                        <CommandInput placeholder="Search facilitator..." />
                        <CommandList>
                          <CommandEmpty>No facilitator found.</CommandEmpty>
                          <CommandGroup>
                            {facilitators.map((facilitator) => (
                              <CommandItem
                                value={facilitator}
                                key={facilitator}
                                onSelect={(value) => {
                                  form.setValue("facilitator", value === field.value ? "" : value)
                                  setOpen(false)
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    facilitator === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {facilitator}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="count"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pledge Count</FormLabel>
                  <FormControl>
                    <Input type="number" min="1" placeholder="e.g., 5" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isPending}>
                {isPending ? 'Submitting...' : 'Submit Pledge'}
                {!isPending && <Send className="ml-2 h-4 w-4" />}
            </Button>
          </form>
        </Form>
      </CardContent>
    </>
  );
}
