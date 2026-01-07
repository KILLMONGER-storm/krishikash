export interface GameGoal {
  id: string;
  name: string;
  cost: number;
  emoji: string;
}

export const GAME_GOALS: GameGoal[] = [
  { id: 'cycle', name: 'Cycle', cost: 7000, emoji: '🚲' },
  { id: 'motorbike', name: 'Motorbike', cost: 300000, emoji: '🏍️' },
  { id: 'car', name: 'Car', cost: 1200000, emoji: '🚗' },
  { id: 'house', name: 'New House', cost: 2000000, emoji: '🏠' },
];

export interface GameState {
  month: number;
  balance: number;
  monthlyIncome: number;
  savings: number;
  stabilityScore: number;
  hasInsurance: boolean;
  insuranceAmount: number;
  debt: number;
  loanMonthsRemaining: number;
  consecutiveSavingMonths: number;
  totalSavedThisStreak: number;
  gamePhase: 'intro' | 'goal_selection' | 'playing' | 'event' | 'decision' | 'summary' | 'ended';
  currentEvent: GameEvent | null;
  monthHistory: MonthRecord[];
  selectedGoal: GameGoal | null;
  goalAchieved: boolean;
  propertyConfiscated: boolean;
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
  household: 35000,
  farming: 30000,
  education: 15000,
};

export const INITIAL_GAME_STATE: GameState = {
  month: 1,
  balance: 0,
  monthlyIncome: 150000,
  savings: 0,
  stabilityScore: 70,
  hasInsurance: false,
  insuranceAmount: 0,
  debt: 0,
  loanMonthsRemaining: 0,
  consecutiveSavingMonths: 0,
  totalSavedThisStreak: 0,
  gamePhase: 'intro',
  currentEvent: null,
  monthHistory: [],
  selectedGoal: null,
  goalAchieved: false,
  propertyConfiscated: false,
};

export const GAME_EVENTS: GameEvent[] = [
  {
    id: 'medical_1',
    type: 'medical',
    title: 'Medical Emergency',
    description: 'A family member fell sick and needs immediate treatment.',
    cost: 25000,
  },
  {
    id: 'medical_2',
    type: 'medical',
    title: 'Hospital Visit',
    description: 'Your child needs medical attention and medicines.',
    cost: 18000,
  },
  {
    id: 'medical_3',
    type: 'medical',
    title: 'Accident Injury',
    description: 'You hurt yourself while working and need treatment.',
    cost: 22000,
  },
  {
    id: 'crop_loss_1',
    type: 'crop_loss',
    title: 'Pest Attack',
    description: 'Pests damaged a portion of your crops.',
    cost: 40000,
  },
  {
    id: 'crop_loss_2',
    type: 'crop_loss',
    title: 'Drought Impact',
    description: 'Lack of rain affected your harvest yield.',
    cost: 35000,
  },
  {
    id: 'crop_loss_3',
    type: 'crop_loss',
    title: 'Flood Damage',
    description: 'Heavy rains flooded your fields and ruined crops.',
    cost: 45000,
  },
  {
    id: 'festival_1',
    type: 'festival',
    title: 'Festival Season',
    description: 'It\'s festival time! Family expects gifts and celebrations.',
    cost: 20000,
  },
  {
    id: 'festival_2',
    type: 'festival',
    title: 'Wedding in Family',
    description: 'A relative\'s wedding requires contribution and gifts.',
    cost: 30000,
  },
  {
    id: 'equipment_1',
    type: 'equipment',
    title: 'Tool Repair',
    description: 'Your farming equipment needs urgent repair.',
    cost: 12000,
  },
  {
    id: 'equipment_2',
    type: 'equipment',
    title: 'Pump Breakdown',
    description: 'Your water pump broke and needs replacement parts.',
    cost: 25000,
  },
  {
    id: 'equipment_3',
    type: 'equipment',
    title: 'Tractor Service',
    description: 'Your tractor requires immediate servicing.',
    cost: 18000,
  },
  {
    id: 'medical_4',
    type: 'medical',
    title: 'Medicine Costs',
    description: 'Monthly medicines for elderly parents are needed.',
    cost: 10000,
  },
  {
    id: 'good_rain_1',
    type: 'good_rain',
    title: 'Excellent Harvest',
    description: 'Good rainfall blessed your fields with a bumper crop!',
    reward: 30000,
  },
  {
    id: 'bonus_1',
    type: 'bonus',
    title: 'Government Subsidy',
    description: 'You received a farming subsidy from the government.',
    reward: 25000,
  },
  {
    id: 'bonus_2',
    type: 'bonus',
    title: 'Crop Bonus',
    description: 'You got a bonus for delivering quality produce.',
    reward: 20000,
  },
  {
    id: 'loan_offer_1',
    type: 'loan_offer',
    title: 'Quick Loan Offer',
    description: 'An agent offers you a quick loan at 5% monthly interest.',
    interest: 5,
  },
];
