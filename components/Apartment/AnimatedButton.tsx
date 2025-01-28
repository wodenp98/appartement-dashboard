import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const AnimatedSubmitButton = ({ onClick, isLoading, disabled, className }) => {
    const [animationState, setAnimationState] = useState('idle');

    const handleClick = async () => {
        try {
            setAnimationState('loading');
            const result = await onClick();
            if (result.success) {
                setAnimationState('success');
            } else {
                setAnimationState('error');
            }

            setTimeout(() => {
                setAnimationState('idle');
            }, 2000);

        } catch (error) {
            setAnimationState('error');
            setTimeout(() => {
                setAnimationState('idle');
            }, 2000);
        }
    };

    return (
        <Button
            className={cn(
                'w-full mt-4 relative transition-all duration-200 flex items-center justify-center',
                animationState === 'success' && 'bg-green-600 hover:bg-green-700',
                animationState === 'error' && 'bg-red-600 hover:bg-red-700',
                className
            )}
            onClick={handleClick}
            disabled={disabled || isLoading || animationState !== 'idle'}
        >
      <span className={cn(
          'transition-opacity duration-200',
          (animationState !== 'idle') && 'opacity-0'
      )}>
        Enregistrer
      </span>

            {animationState === 'loading' && (
                <Loader2 className="w-5 h-5 animate-spin absolute" />
            )}

            {animationState === 'success' && (
                <Check className="w-5 h-5 absolute animate-in fade-in" />
            )}

            {animationState === 'error' && (
                <X className="w-5 h-5 absolute animate-in fade-in" />
            )}
        </Button>
    );
};

export default AnimatedSubmitButton;