import { GameEvent } from '@/types/game';
import { cn } from '@/lib/utils';
import { AlertTriangle, CloudRain, Heart, Gift, Wrench, Coins, BadgeDollarSign } from 'lucide-react';

interface EventCardProps {
  event: GameEvent;
  hasInsurance?: boolean;
  onContinue: () => void;
}

const eventIcons = {
  medical: Heart,
  crop_loss: CloudRain,
  good_rain: CloudRain,
  festival: Gift,
  equipment: Wrench,
  bonus: Coins,
  loan_offer: BadgeDollarSign,
};

const eventColors = {
  medical: 'from-red-100 to-red-50 border-red-200',
  crop_loss: 'from-orange-100 to-orange-50 border-orange-200',
  good_rain: 'from-emerald-100 to-emerald-50 border-emerald-200',
  festival: 'from-purple-100 to-purple-50 border-purple-200',
  equipment: 'from-slate-100 to-slate-50 border-slate-200',
  bonus: 'from-amber-100 to-amber-50 border-amber-200',
  loan_offer: 'from-blue-100 to-blue-50 border-blue-200',
};

const iconColors = {
  medical: 'text-red-600',
  crop_loss: 'text-orange-600',
  good_rain: 'text-emerald-600',
  festival: 'text-purple-600',
  equipment: 'text-slate-600',
  bonus: 'text-amber-600',
  loan_offer: 'text-blue-600',
};

export const EventCard = ({ event, hasInsurance, onContinue }: EventCardProps) => {
  const Icon = eventIcons[event.type];
  const isPositive = !!event.reward;
  const isLoanOffer = event.type === 'loan_offer';

  let effectiveCost = event.cost || 0;
  let insuranceSaved = 0;
  
  if (event.type === 'crop_loss' && hasInsurance && event.cost) {
    insuranceSaved = event.cost - 500;
    effectiveCost = 500;
  }

  return (
    <div className={cn(
      'game-card border-2 animate-slide-up',
      `bg-gradient-to-br ${eventColors[event.type]}`
    )}>
      <div className="flex flex-col items-center text-center">
        <div className={cn(
          'w-16 h-16 rounded-full flex items-center justify-center mb-4',
          isPositive ? 'bg-emerald-200' : 'bg-white/50'
        )}>
          <Icon className={cn('w-8 h-8', iconColors[event.type])} />
        </div>

        <h3 className="text-xl font-bold text-foreground mb-2">
          {event.title}
        </h3>

        <p className="text-muted-foreground mb-4">
          {event.description}
        </p>

        {!isLoanOffer && (
          <div className={cn(
            'text-2xl font-bold mb-4',
            isPositive ? 'text-emerald-600' : 'text-red-600'
          )}>
            {isPositive ? '+' : '-'}₹{(event.reward || effectiveCost).toLocaleString()}
          </div>
        )}

        {insuranceSaved > 0 && (
          <div className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-lg mb-4 text-sm font-semibold">
            🛡️ Insurance saved you ₹{insuranceSaved.toLocaleString()}!
          </div>
        )}

        {isLoanOffer && (
          <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg mb-4 text-sm">
            <AlertTriangle className="inline w-4 h-4 mr-1" />
            Warning: {event.interest}% interest rate!
          </div>
        )}

        <button
          onClick={onContinue}
          className="btn-primary-game w-full"
        >
          Continue
        </button>
      </div>
    </div>
  );
};
