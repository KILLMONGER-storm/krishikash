export interface GameState {
  month: number;
  balance: number;
  monthlyIncome: number;
  savings: number;
  stabilityScore: number;
  hasInsurance: boolean;
  debt: number;
  consecutiveSavingMonths: number;
  totalSavedThisStreak: number;
  gamePhase: 'intro' | 'playing' | 'event' | 'decision' | 'summary' | 'ended';
  currentEvent: GameEvent | null;
  monthHistory: MonthRecord[];
}

export interface GameEvent {
  id: string;
  type: 'medical' | 'crop_loss' | 'good_rain' | 'loan_offer' | 'festival' | 'equipment' | 'bonus';
  title: string;
  description: string;
  cost?: number;
  reward?: number;
  interest?: number;
  choices?: EventChoice[];
}

export interface EventChoice {
  id: string;
  label: string;
  description: string;
  effect: () => Partial<GameState>;
}

export interface MonthRecord {
  month: number;
  income: number;
  expenses: number;
  savings: number;
  balance: number;
  event?: GameEvent;
  decisions: string[];
}

export interface FixedExpenses {
  household: number;
  farming: number;
  education: number;
}

export const FIXED_EXPENSES: FixedExpenses = {
  household: 3000,
  farming: 2500,
  education: 1000,
};

export const INITIAL_GAME_STATE: GameState = {
  month: 1,
  balance: 0,
  monthlyIncome: 12000,
  savings: 0,
  stabilityScore: 70,
  hasInsurance: false,
  debt: 0,
  consecutiveSavingMonths: 0,
  totalSavedThisStreak: 0,
  gamePhase: 'intro',
  currentEvent: null,
  monthHistory: [],
};

export const GAME_EVENTS: GameEvent[] = [
  {
    id: 'medical_1',
    type: 'medical',
    title: 'Medical Emergency',
    description: 'A family member fell sick and needs immediate treatment.',
    cost: 2000,
  },
  {
    id: 'medical_2',
    type: 'medical',
    title: 'Hospital Visit',
    description: 'Your child needs medical attention and medicines.',
    cost: 1500,
  },
  {
    id: 'crop_loss_1',
    type: 'crop_loss',
    title: 'Pest Attack',
    description: 'Pests damaged a portion of your crops.',
    cost: 3000,
  },
  {
    id: 'crop_loss_2',
    type: 'crop_loss',
    title: 'Drought Impact',
    description: 'Lack of rain affected your harvest yield.',
    cost: 2500,
  },
  {
    id: 'good_rain_1',
    type: 'good_rain',
    title: 'Excellent Harvest',
    description: 'Good rainfall blessed your fields with a bumper crop!',
    reward: 2500,
  },
  {
    id: 'good_rain_2',
    type: 'good_rain',
    title: 'Premium Crop Sale',
    description: 'Your high-quality produce fetched excellent prices at the market.',
    reward: 3000,
  },
  {
    id: 'festival_1',
    type: 'festival',
    title: 'Festival Season',
    description: 'It\'s festival time! Family expects gifts and celebrations.',
    cost: 1500,
  },
  {
    id: 'equipment_1',
    type: 'equipment',
    title: 'Tool Repair',
    description: 'Your farming equipment needs urgent repair.',
    cost: 1000,
  },
  {
    id: 'bonus_1',
    type: 'bonus',
    title: 'Government Subsidy',
    description: 'You received a farming subsidy from the government.',
    reward: 2000,
  },
  {
    id: 'loan_offer_1',
    type: 'loan_offer',
    title: 'Quick Loan Offer',
    description: 'An agent offers you a quick loan of ₹5000 at 20% interest.',
    interest: 20,
  },
];
